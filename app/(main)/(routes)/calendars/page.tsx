"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CalendarsPage = () => {
  //아이디 없는 메인화면 의미
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.calendars.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((calendarId) =>
      router.push(`/calendars/${calendarId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new calendar...",
      success: "New calendar a created",
      error: "Failed to create a new calendar",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      This is a protected CalendarsPage
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s tution
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a calendar
      </Button>
    </div>
  );
};

export default CalendarsPage;
