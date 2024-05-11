import { SignOutButton } from "@/components/auth/sign-out-button";
import { Navbar } from "@/components/shared/navbar";
import { TasksClient } from "@/components/tasks/tasks-client";
import { getTasks } from "@/data/task";
import { currentUser } from "@/lib/auth";
import Image from "next/image";

export default async function Home() {
  const tasks = await getTasks();
  const user = await currentUser();

  return (
    <div className="w-full h-full flex flex-col">

      <div className="w-full h-[9%]">
        <Navbar 
          //@ts-ignore
          user={user!}
        />
      </div>

      <div className="w-full h-[91%]  px-4 md:px-14 py-6">
        <TasksClient 
          tasks={tasks!} 
          //@ts-ignore
          user={user}
        />
      </div>
    </div>

  );
}
