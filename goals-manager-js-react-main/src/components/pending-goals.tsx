import { Plus, Trash2, PencilLine } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";
import { deleteGoal } from "../http/delete-goal";
import { Button } from "./ui/button";
import { UpdateGoal } from "./update-goal";
import { Dialog } from "./ui/dialog";
import { useState } from "react";

export function PendingGoals() {
  const queryClient = useQueryClient();
  const [selectedGoal, setSelectedGoal] = useState<{
    id: string;
    title: string;
    frequency: number;
  } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
  });

  const createCompletionMutation = useMutation({
    mutationFn: createGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error("Error completing goal:", error);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error("Error deleting goal:", error);
    },
  });

  if (isLoading) {
    return <p>Loading pending goals...</p>;
  }

  if (isError || !data) {
    return <p>Erro: erro ao carregar as tarefas pendentes</p>;
  }

  const handleCreateGoalCompletion = async (goalId: string) => {
    createCompletionMutation.mutate({ goalId });
  };

  const handleDeleteGoal = async (goalId: string) => {
    deleteGoalMutation.mutate({ goalId });
  };

  return (
    <div className="flex flex-col gap-3">
      {data.pendingGoals
        .sort((i, j) => {
          const aCompleted = i.completionCount >= i.desiredWeeklyFrequency;
          const bCompleted = j.completionCount >= j.desiredWeeklyFrequency;
          if (aCompleted === bCompleted) {
            return 0;
          }
          return aCompleted ? 1 : -1;
        })
        .map((goal) => {
          const isGoalCompleted =
            goal.completionCount >= goal.desiredWeeklyFrequency;
          return (
            <OutlineButton
              key={goal.id}
              onClick={() => handleCreateGoalCompletion(goal.id)}
              disabled={isGoalCompleted}
              className=" p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Plus className={"size-4 text-green-500"} />

                  <span
                    className={`align-middle font-mono text-lg ${
                      isGoalCompleted
                        ? "text-green-400 line-through"
                        : "text-white"
                    }`}
                  >
                    {goal.title.length > 30
                      ? `${goal.title.slice(0, 30)}...`
                      : goal.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white italic font-light">
                      {goal.completionCount}/{goal.desiredWeeklyFrequency}
                    </span>
                    <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden ">
                      <div
                        className={`h-full ${
                          goal.completionCount >= goal.desiredWeeklyFrequency
                            ? "bg-green-500"
                            : "bg-orange-400"
                        }`}
                        style={{
                          width: `${
                            (goal.completionCount /
                              goal.desiredWeeklyFrequency) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    {!isGoalCompleted && (
                      <div className="flex items-center gap-1">
                        <Button
                          className="w-10 h-8 p-0 bg-inherit hover:bg-slate-500 hover:bg-opacity-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGoal({
                              id: goal.id,
                              title: goal.title,
                              frequency: goal.desiredWeeklyFrequency,
                            });
                          }}
                        >
                          <PencilLine className="text-white" width={20} />
                        </Button>
                        <Button
                          className="w-10 h-8 p-0 bg-inherit hover:bg-slate-500 hover:bg-opacity-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goal.id);
                          }}
                        >
                          <Trash2 className="text-red-800" width={20} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </OutlineButton>
          );
        })}

      {/* Diálogo de edição */}
      {selectedGoal && (
        <Dialog
          open={!!selectedGoal}
          onOpenChange={() => setSelectedGoal(null)}
        >
          <UpdateGoal
            goalId={selectedGoal.id}
            currentTitle={selectedGoal.title}
            currentFrequency={selectedGoal.frequency}
            onClose={() => setSelectedGoal(null)}
          />
        </Dialog>
      )}
    </div>
  );
}
