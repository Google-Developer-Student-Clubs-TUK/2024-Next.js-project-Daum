import { KanbanBoard } from "@/types/kanbanboard"
import { useState } from "react"

export const useKanbanBoard = ({
  editable,
  initialContent,
  onBoardChanged
}: {
  editable?: boolean,
  initialContent?: KanbanBoard | undefined
  onBoardChanged: (value: KanbanBoard) => void
}) => {
  const [content, setContent] = useState(initialContent);

  return {
    content
  }
}