import { Id } from "@/convex/_generated/dataModel"

export type KanbanBoard = {
  _id: string,
  name: string,
  content: Id<"documents">[],
}[];


export const newKanbanBoard = (
  ...names: string[]
): 
KanbanBoard => {
  return names.map(v => {
    return {
      _id: generateId(),
      name: v,
      content: []
    }
  });
}

function generateId() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (`${S4()}${S4()}${S4()}${S4()}`);
}