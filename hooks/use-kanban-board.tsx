import { KanbanBoard, generateId, newKanbanBoard } from "@/types/kanbanboard"
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

  useEffect(() => {
    if (content !== undefined) {
      onBoardChanged(content);
    }
  }, [content, onBoardChanged]);

  const onNewElement = () => {
    if (content !== undefined) {
      setContent([
        ...content,
        {
          _id: generateId(),
          name: "untitled",
          content: []
        }
      ])
    }
  }

  return {
    content,
    onNewElement,
  }
}