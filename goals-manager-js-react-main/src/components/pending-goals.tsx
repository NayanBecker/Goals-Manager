import { Plus, Trash2 } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";
import { deleteGoal } from "../http/delete-goal";
import { Button } from "./ui/button";

export function PendingGoals() {
  const queryClient = useQueryClient();

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
                  <Plus className="size-4 text-purple-800" />
                  {goal.title}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">
                    {goal.completionCount}/{goal.desiredWeeklyFrequency}
                  </span>
                  {!isGoalCompleted && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(goal.id);
                      }}
                      className="w-12 h-8 bg-inherit hover:bg-slate-500 hover:bg-opacity-20"
                    >
                      <Trash2 className="text-red-800" />
                    </Button>
                  )}
                </div>
              </div>
            </OutlineButton>
          );
          
      })}
    </div>
  );
}
