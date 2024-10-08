"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useCallback, useMemo, useState } from "react";
import styles from "./Calendar.module.scss";

import { useCalendarDocument } from "@/hooks/use-calendar-document";
import { CalendarDay } from "./CalendarDay";

interface CalendarProps {
  initialContent?: string;
  onChange: (value: string) => void;
}
const MakeCalendar = ({ initialContent, onChange }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showButton, setShowButton] = useState<number>();
  const [clickedButton, setClickedButton] = useState<boolean>(false);

  //const createCalendarDocument = useMutation(api.calendars.update);
  const editor = useCalendarDocument({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onCalendarChanged: (calendar) => {
      onChange(JSON.stringify(calendar, null, 2));
    },
  });

  const handleCalendarDocument = (index: number) => {
    if (!clickedButton) {
      setClickedButton(true);
      editor.onNewElement(index, getMonth(currentDate) + 1);
    } else {
      editor.onNewElement(index, getMonth(currentDate) + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    setShowButton(index);
  };

  const handleMouseLeave = () => {
    setShowButton(undefined);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  //const weekMock = ["일", "월", "화", "수", "목", "금", "토"];

  const [weekMock, setWeekMock] = useState([
    "일",
    "월",
    "화",
    "수",
    "목",
    "금",
    "토",
  ]);
  const nextMonthHandler = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1));
  }, [currentDate]);

  const prevMonthHandler = useCallback(() => {
    setCurrentDate(subMonths(currentDate, 1));
  }, [currentDate]);

  const createMonth = useMemo(() => {
    const monthArray = [];
    let day = startDate;
    while (differenceInCalendarDays(endDate, day) >= 0) {
      monthArray.push(day);
      day = addDays(day, 1);
    }
    return monthArray;
  }, [startDate, endDate]);

  return (
    <section className={styles.calendar}>
      <div className={styles.yearTitle}>{format(currentDate, "yyyy년")}</div>
      <div className={styles.monthTitle}>
        <button className={styles.prevButton} onClick={prevMonthHandler}>
          <ChevronLeftIcon />
        </button>
        <div className={styles.month}>{format(currentDate, "M월")}</div>
        <button className={styles.nextButton} onClick={nextMonthHandler}>
          <ChevronRightIcon />
        </button>
      </div>
      <div className={styles.dayContainer}>
        {weekMock.map((v, i) => {
          let style;
          if (i === 0) {
            style = {
              color: "red",
            };
          } else if (i === 6) {
            style = {
              color: "blue",
            };
          }
          return (
            <div key={`day${i}`} style={style}>
              {v}
            </div>
          );
        })}
      </div>
      <div className={styles.dateContainer}>
        {createMonth.map((v, i) => {
          const content = editor.content && editor.content.filter((v) => v._id);
          return (
            <CalendarDay
              day={v}
              today={currentDate}
              initialContent={initialContent}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              highlighted={showButton === i}
              addDocument={() => handleCalendarDocument(i)}
              index={i}
              editor={editor}
              content={content}
            />
          );
        })}
      </div>
    </section>
  );
};
export default MakeCalendar;
