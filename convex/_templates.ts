import { Id } from "./_generated/dataModel";

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
      _id: crypto.getRandomValues(new Uint8Array(16)).toString(),
      name: v,
      content: []
    }
  });
}
