import type{ DailyGoalsProps } from "@/interfaces/dailychard";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");


function filterGoalsByWeek(dailyChart: DailyGoalsProps[], startOfWeek: dayjs.Dayjs, endOfWeek: dayjs.Dayjs) {
    return dailyChart.filter((goal) => {
      const goalDate = dayjs(goal.date);
      return goalDate.isAfter(startOfWeek) && goalDate.isBefore(endOfWeek);
    });
  }

  function getWeekRange(weekOffset: number) {
    const startOfWeek = dayjs().startOf('week').add(weekOffset, 'week'); // Início da semana
    const endOfWeek = dayjs().endOf('week').add(weekOffset, 'week'); // Fim da semana
  
    return { startOfWeek, endOfWeek };
  }
  function formatWeekRange(startOfWeek: dayjs.Dayjs, endOfWeek: dayjs.Dayjs) {
    const fromDate = startOfWeek.format("D[ de ]MMM");
    const toDate = endOfWeek.format("D[ de ]MMM"); 
    
    return `${fromDate} - ${toDate} `;
  }
  
  export {
    filterGoalsByWeek,
    getWeekRange,
    formatWeekRange,
  };
