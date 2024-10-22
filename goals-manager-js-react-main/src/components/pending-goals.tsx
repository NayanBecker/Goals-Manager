import { Plus, Trash2, } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingGoals } from '../http/get-pending-goals'
import { createGoalCompletion } from '../http/create-goal-completion'
import { Button } from './ui/button'

export function PendingGoals() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
  })

  if (isLoading || !data) {
    return null
  }

  async function handleCreateGoalCompletion(goalId: string) {
    await createGoalCompletion({ goalId })

    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    queryClient.invalidateQueries({ queryKey: ['summary'] })
  }

  return (
    <div className="flex flex-col gap-3">
      {data.pendingGoals.map(goal => {
        const isGoalCompleted = goal.completionCount >= goal.desiredWeeklyFrequency;

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

                  <Button /*onClick={}*/ className='w-12 h-8 bg-inherit hover:bg-slate-500 hover:bg-opacity-20'>
                  <Trash2 className="text-red-800 " />
                  </Button>
                </div>
              )}
            </div>
              </OutlineButton>
        );
      })}
    </div>


  )
}