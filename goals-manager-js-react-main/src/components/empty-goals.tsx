import { Plus } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import imglogo from "@/assets/DALL_E-2024-09-27-21.10-removebg-preview (1) (1).png";

import BackgroundEmptyGoals from "../assets/EmptyGoalsBG.svg";
import { Button } from "./ui/button";

// const BackgroundEmptyGoals =  '../assets/EmptyGoalsBG.svg'

export function EmptyGoals() {
  return (
    <main
      className="h-screen flex flex-col items-center justify-center gap-8"
      style={{
        backgroundImage: `url(${BackgroundEmptyGoals})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img src={imglogo} alt="Goals-manager-logo" width={200} />
      <span className="text-lg  text-white text-center font-light mt-4 leading-relaxed drop-shadow-md animate-pulse shadow-lg">
        Parece que você não tem nenhuma Meta cadastrada.
      </span>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Minha nova Meta
        </Button>
      </DialogTrigger>
    </main>
  );
}
