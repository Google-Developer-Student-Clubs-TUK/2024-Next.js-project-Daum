import { KanbanBoard, newKanbanBoard } from "@/types/kanbanboard"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    if (content === undefined) {
      setContent(newKanbanBoard());
    }
  }, [content]);
  
  return {
    content
  }
}