import { Calendar, generateId, newCalendarDocument } from "@/types/calendar";
import { useEffect, useState } from "react";

export interface CalendarDocumentProps {
  onNewElement: (calendarId: number, calendarMonth: number) => void;
  onDeleteElement: (calendarDocId: string) => void;
  content: Calendar | undefined;
  onRenameElement: (calendarDocId: string, name: string) => void;
}

export const useCalendarDocument = ({
  initialContent,
  onCalendarChanged,
}: {
  initialContent?: Calendar | undefined;
  onCalendarChanged: (value: Calendar) => void;
}): CalendarDocumentProps => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (!content) {
      setContent(newCalendarDocument());
    }
  }, [content]);

  useEffect(() => {
    if (!!content) {
      onCalendarChanged(content);
    }
  }, [content, onCalendarChanged]);

  const onNewElement = (calendarId: number, calendarMonth: number) => {
    if (!content) return;
    if (calendarId) {
      setContent([
        ...content,
        {
          _id: generateId(),
          name: "untitled",
          calendarIndex: calendarId,
          calendarMonth: calendarMonth,
        },
      ]);
    }
  };

  const onDeleteElement = (calendarDocId: string) => {
    setContent(content?.filter((a) => a._id !== calendarDocId));
  };

  const onRenameElement = (calendarDocId: string, name: string) => {
    setContent(
      content?.map((a) => (a._id === calendarDocId ? { ...a, name } : a))
    );
  };

  return {
    content,
    onNewElement,
    onRenameElement,
    onDeleteElement,
  };
};
