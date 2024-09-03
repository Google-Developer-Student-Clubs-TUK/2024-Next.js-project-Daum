export type Calendar = CalendarDocumentElement[];

export type CalendarDocumentElement = {
  _id: string;
  name: string;
  calendarIndex: number;
  calendarMonth: number;
};

export const newCalendarDocument = (...names: string[]): Calendar => {
  return names.map((v) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 2}`;

    return {
      _id: generateId(),
      name: v,
      calendarIndex: +v,
      calendarMonth: +formattedDate,
    };
  });
};

export function generateId() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4()}${S4()}${S4()}${S4()}`;
}
