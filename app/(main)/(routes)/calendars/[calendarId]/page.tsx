"use client";

import { useMutation, useQuery } from "convex/react";

import styles from "@/components/Calendar.module.scss";
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
      <section className={styles.calendar}>
        {/* 스켈레톤으로 연도 */}
        <div className={styles.yearTitle}>
          <Skeleton className="h-5 w-24" />
        </div>
        <div className={styles.monthTitle}>
          {/* 좌우 버튼 대신 그냥 네모 스켈레톤 */}
          <Skeleton className="h-6 w-6 mr-2 inline-block" />
          <Skeleton className="h-6 w-8 inline-block" />
          <Skeleton className="h-6 w-6 ml-2 inline-block" />
        </div>

        {/* 날짜칸(한 달 최대 5~6주 -> 35~42칸 정도) */}
        <div className={styles.dateContainer}>
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className={styles.currentMonth}
              style={{ minHeight: "80px", padding: "4px" }}
            >
              <Skeleton className="h-4 w-6 mb-2" />
              <Skeleton className="h-4 w-[70%] mb-1" />
              <Skeleton className="h-4 w-[50%] mb-1" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (calendar === null) {
    return <div>Not found</div>;
  }

  return <MakeCalendar initialContent={calendar.content} onChange={onUpdate} />;
};

export default CalendarIdPage;
