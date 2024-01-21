import { Id } from "@/convex/_generated/dataModel"

export type KanbanBoard = {
  _id: string,
  name: string,
  content: Id<"documents">[],
}[];
