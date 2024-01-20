import { Id } from "@/convex/_generated/dataModel"

export type KanbanBoard = {
  name: string,
  content: Id<"documents">[],
}[];
