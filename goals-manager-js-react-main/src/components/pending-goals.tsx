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

  // Fetch de metas pendentes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
  });

  // Mutation para completar metas
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

  // Mutation para deletar metas
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
    return <p>Failed to load pending goals.</p>;
  }

  const handleCreateGoalCompletion = async (goalId: string) => {
    createCompletionMutation.mutate({ goalId });
  };

  const handleDeleteGoal = async (goalId: string) => {
    deleteGoalMutation.mutate({ goalId });
  };

  return (
    <div className="flex flex-col gap-3">
      {data.pendingGoals.map((goal) => {
        const isGoalCompleted =
          goal.completionCount >= goal.desiredWeeklyFrequency;

        return (
          <OutlineButton
            key={goal.id}
            onClick={() => handleCreateGoalCompletion(goal.id)}
            disabled={isGoalCompleted}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Plus className="size-4 text-zinc-600" />
                {goal.title}
              </div>
              {!isGoalCompleted && (
                <div className="flex items-center gap-3">
                  <Button
                    className="w-12 h-8 bg-inherit hover:bg-slate-500 hover:bg-opacity-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGoal({
                        id: goal.id,
                        title: goal.title,
                        frequency: goal.desiredWeeklyFrequency,
                      });
                    }}
                  >
                    <PencilLine className="text-white" />
                  </Button>
                  <Button
                    className="w-12 h-8 bg-inherit hover:bg-slate-500 hover:bg-opacity-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGoal(goal.id);
                    }}
                  >
                    <Trash2 className="text-red-800" />
                  </Button>
                </div>
              )}
            </div>
          </OutlineButton>
        );
      })}

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
