"use client";

import styles from "./Calendar.module.scss";

import { CalendarDocumentProps } from "@/hooks/use-calendar-document";
import { CalendarDocumentElement } from "@/types/calendar";
import { format, getMonth, isSaturday, isSunday } from "date-fns";
import { PlusCircle, Trash2 } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import TextareaAutoSize from "react-textarea-autosize";

export const CalendarDay = ({
  day: v,
  today: currentDate,
  index,
  onMouseEnter,
  onMouseLeave,
  highlighted,
  addDocument,
  content,
  editor,
}: {
  day: Date;
  today: Date;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  highlighted?: boolean;
  addDocument: () => void;
  initialContent?: string;
  content?: CalendarDocumentElement[];
  editor: CalendarDocumentProps;
}) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  let style;
  const validation = getMonth(currentDate) === getMonth(v);
  const today = format(new Date(), "yyyyMMdd") === format(v, "yyyyMMdd");
  //const [newValue, newSetValue] = useState<string>("");
  const [isEditing, setEditing] = useState<boolean>(false);

  const { onRenameElement, onDeleteElement } = editor;

  const onInput = (id: string, value: string) => {
    onRenameElement(id, value);
  };

  const disableInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.blur();
    setEditing(false);
  };

  const documentclick = (calendarId: string, calendarName: string) => {
    content?.map((v) => {
      if (calendarId === v._id) {
        onInput(v._id, calendarName);
      }
    });
  };

  const documentDeleteclick = (calendarDocId: string) => {
    content?.map((v) => {
      if (calendarDocId === v._id) {
        onDeleteElement(v._id);
      }
    });
  };

  if (validation && isSaturday(v)) {
    style = {
      color: "blue",
    };
  } else if (validation && isSunday(v)) {
    style = {
      color: "red",
    };
  }

  return (
    <div
      className={validation ? styles.currentMonth : styles.diffMonth}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.topLine}>
        <span className={styles.day}>{format(v, "d")}</span>
        {today && <span className={styles.today}>(오늘)</span>}
        {highlighted && (
          <div className="flex flex-row justify-end">
            <PlusCircle
              className="w-4 h-4 cursor-pointer"
              onClick={addDocument}
            />
          </div>
        )}
      </div>
      {content &&
        content.map(
          (v) =>
            index === v.calendarIndex &&
            v.calendarMonth === Number(format(currentDate, "M")) && (
              <div
                key={v._id}
                className="w-80% h-auto p-1 text-sm border-blue-500 border-1 bg-[#DDE5FF] rounded-md flex flex-row justify-center items-center mt-1 mx-5"
              >
                <TextareaAutoSize
                  onClick={(e) => {
                    setEditing(true);
                    if (isEditing) {
                      e.currentTarget.focus();
                    }
                  }}
                  onBlur={(e) => {
                    setEditing(false);
                    e.target?.blur();
                  }}
                  value={v.name}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      disableInput(e);
                    }
                  }}
                  className="w-full h-full bg-[#DDE5FF] text-center rounded-md outline-none"
                  onChange={(e) => documentclick(v._id, e.target.value)}
                  style={{
                    transition: "background-color 0.3s ease-in-out",
                  }}
                >
                  {v.name}
                </TextareaAutoSize>
                <Trash2
                  className="w-5 h-full cursor-pointer"
                  onClick={() => documentDeleteclick(v._id)}
                />
              </div>
            )
        )}
    </div>
  );
};
