export interface DailyGoal{
  date: string;  
  completed: number;  
  total: number; 
}

export interface GetDailyGoalsResponse {
  dailyChart: DailyGoal[];
}

  
  export async function getDailyGoals(): Promise<GetDailyGoalsResponse> {
    const response = await fetch('http://localhost:3333/daily-goals-chart')
    const data = await response.json()
  
    return data;
  }
  