import { X, Crosshair } from "lucide-react";

import { Button } from "./ui/button";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "./ui/radio-group";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateGoal } from "../http/update-goal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const updateGoalSchema = z.object({
  title: z.string().min(1, "Informe a atividade que deseja atualizar"),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

type UpdateGoalSchema = z.infer<typeof updateGoalSchema>;

interface UpdateGoalProps {
  goalId: string;
  currentTitle: string;
  currentFrequency: number;
  onClose: () => void; // Para fechar o diálogo
}

export function UpdateGoal({
  goalId,
  currentTitle,
  currentFrequency,
  onClose,
}: UpdateGoalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateGoalSchema>({
    resolver: zodResolver(updateGoalSchema),
    defaultValues: {
      title: currentTitle,
      desiredWeeklyFrequency: currentFrequency,
    },
  });

  async function handleUpdateGoal({
    title,
    desiredWeeklyFrequency,
  }: UpdateGoalSchema) {
    try {
      await updateGoal({
        goalId,
        title,
        desiredWeeklyFrequency,
      });

      reset();
      queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });

      toast.success("Meta atualizada com sucesso!");
      onClose(); // Fechar o diálogo após sucesso
    } catch {
      toast.error("Erro ao atualizar a meta, tente novamente!");
    }
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Atualizar meta</DialogTitle>

            <DialogClose asChild>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Atualize os detalhes da sua atividade semanal.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleUpdateGoal)}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>

              <Input
                id="title"
                autoFocus
                placeholder="Atualizar exercícios, meditação, etc..."
                {...register("title")}
              />

              {errors.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="desiredWeeklyFrequency">
                Quantas vezes na semana?
              </Label>

              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                render={({ field }) => {
                  return (
                    <RadioGroup
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      {Array.from({ length: 7 }).map((_, i) => {
                        const frequency = String(i + 1);

                        return (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <RadioGroupItem key={i} value={frequency}>
                            <RadioGroupIndicator />
                            <span className="text-zinc-300 text-sm font-medium leading-none">
                              {frequency}x na semana
                            </span>
                            <span className="text-lg leading-none">
                              <Crosshair
                                color="#2311ac"
                                strokeWidth="3"
                                width={18}
                              />
                            </span>
                          </RadioGroupItem>
                        );
                      })}
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <DialogClose asChild>
              <Button variant="secondary" className="flex-1">
                Fechar
              </Button>
            </DialogClose>

            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
