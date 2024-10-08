"use client";

import { useMutation, useQuery } from "convex/react";

import { Cover } from "@/components/cover";
import MakeCalendar from "@/components/MakeCalendar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface CalendarIdPageProps {
  params: {
    calendarId: Id<"calendars">;
  };
}

const CalendarIdPage = ({ params }: CalendarIdPageProps) => {
  const update = useMutation(api.calendars.update);

  const onUpdate = (content: string) => {
    update({
      id: params.calendarId,
      content,
    });
  };

  //인자로 calendar.id 넘김 -> Query로 작성한 getById 호출
  const calendar = useQuery(api.calendars.getById, {
    calendarId: params.calendarId,
  });

  if (calendar === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (calendar === null) {
    return <div>Not found</div>;
  }

  return <MakeCalendar initialContent={calendar.content} onChange={onUpdate} />;
};

export default CalendarIdPage;
