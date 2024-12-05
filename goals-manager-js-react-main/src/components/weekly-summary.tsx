import { CheckCircle2, Plus, ChartNoAxesCombined } from "lucide-react";
import BackgroundEmptyGoals from "../assets/EmptyGoalsBG.svg";

import newIcon from "@/assets/Goal-Manager-Logo.png";
import { useState, useEffect } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ptBR from "dayjs/locale/pt-BR";
import dayjs from "dayjs";
import {
  getDailyGoals,
  type GetDailyGoalsResponse,
} from "@/http/get-daily-goals";
import type { GetSummaryResponse } from "@/http/get-summary";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DailyGoals } from "./daily-goals";
import { PendingGoals } from "./pending-goals";
import { toDate, fromDate } from "./ui/weekdate";
import UserProfile from "./user-profile";
import FlameIcon from "./ui/FlameIcon";

dayjs.locale(ptBR);

interface WeeklySummaryProps {
  summary: GetSummaryResponse["summary"];
}

export function WeeklySummary({ summary }: WeeklySummaryProps) {
  const totalCompletedGoals = summary.completed;
  const [showGraph, setShowGraph] = useState(false);
  const [dailyGoals, setDailyGoals] = useState<GetDailyGoalsResponse | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (showGraph) {
        try {
          const data = await getDailyGoals();
          console.log("Dados retornados por getDailyGoals:", data); // Debug
          setDailyGoals(data);
        } catch (error) {
          console.error("Erro ao buscar daily goals:", error); // Debug
        }
      }
    };
    fetchData();
  }, [showGraph]);

  const completedPercentage = Math.round(
    (summary.completed * 100) / summary.total
  );
  const handleShowGraph = () => {
    setShowGraph(!showGraph);
  };

  return (
    <main
      className="max-w-[640px] min-h-[900px] py-5 px-5 mx-auto flex flex-col gap-5
      bg-slate-900
      ring-2 ring-offset-2 ring-offset-blue-300 hover:ring-offset-blue-500
      "
    >
      <div className="pb-4">
        <div
          className="bg-slate-950 rounded-xl px-4 py-3 shadow-shape flex items-center justify-between mb-5"
          style={{
            backgroundImage: `url(${BackgroundEmptyGoals})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <UserProfile />
          <div className="flex align-middle justify-center">
            <span className="text-xxs text-zinc-400">
              {totalCompletedGoals}
            </span>
            <FlameIcon />
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img src={newIcon} alt="Descrição do Ícone" width={60} />
            <span className="text-lg font-semibold">
              {fromDate} - {toDate}
            </span>
          </div>

          <DialogTrigger asChild className="w-[25%]">
            <Button size="default">
              <Plus className="size-4 hover:animate-spin rotate-90" />
              <span className="hidden md:inline">Cadastrar Meta</span>
            </Button>
          </DialogTrigger>
        </div>

        <div className="flex flex-col gap-3">
          <Progress value={summary.completed} max={summary.total}>
            <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
          </Progress>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Você completou{" "}
              <span className="text-zinc-100">{summary.completed}</span> de{" "}
              <span className="text-zinc-100">{summary.total}</span> metas nessa
              semana.
            </span>
            <span>{completedPercentage}%</span>
          </div>
        </div>
      </div>
      <Separator />

      <PendingGoals />

      <div className="space-y-6 ">
        <div className="flex flex-row mx-auto justify-between">
          <h2 className="text-3xl font-medium ">Sua semana </h2>

          <Button
            variant="secondary"
            onClick={handleShowGraph}
            className="w-20 hover:bg-zinc-800 bg-slate-950 opacity-80"
          >
            <ChartNoAxesCombined className="size-5" color="white" />
          </Button>
        </div>

        {showGraph && dailyGoals === null && (
          <div className="text-white text-center">Loading...</div> // Show loading message
        )}

        {showGraph && dailyGoals && (
          <div>
            <DailyGoals dailyChart={dailyGoals.dailyChart} />
          </div>
        )}

        {!showGraph &&
          summary.goalsPerDay &&
          Object.entries(summary.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format("dddd");
            const parsedDate = dayjs(date).format("D[ de ]MMM");

            return (
              <div className="space-y-4" key={date}>
                <h3 className="font-medium capitalize">
                  {weekDay}{" "}
                  <span className="text-zinc-400 text-xs">({parsedDate})</span>
                </h3>

                <ul className="space-y-3">
                  {goals.map((goal) => {
                    const parsedTime = dayjs(goal.completedAt).format(
                      "HH:mm[h]"
                    );

                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-green-500" />
                        <span className="text-base text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{parsedTime}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </div>
    </main>
  );
}
