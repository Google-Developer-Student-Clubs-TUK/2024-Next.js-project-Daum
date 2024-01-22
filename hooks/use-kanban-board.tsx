import { Id } from "@/convex/_generated/dataModel";
import { KanbanBoard, generateId, newKanbanBoard } from "@/types/kanbanboard"
import { useEffect, useState } from "react"

export interface KanbanBoardProps {
  content: KanbanBoard | undefined;
  onNewElement: () => void;
  onRemoveElement: (id: string) => void;
  onRenameElement: (id: string, name: string) => void;
  onAddDocument: (id: string, document: Id<"documents">) => void;
  onAddDocumentIndex: (id: string, document: Id<"documents">, forward: Id<"documents">) => void,
}

export const useKanbanBoard = ({
  initialContent,
  onBoardChanged
}: {
  initialContent?: KanbanBoard | undefined
  onBoardChanged: (value: KanbanBoard) => void
}): KanbanBoardProps => {
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

  const onRemoveElement = (id: string) => {
    setContent(
      content?.filter(a => a._id !== id)
    );
  }

  const onRenameElement = (id: string, name: string) => {
    setContent(
      content?.map(a => a._id === id ? {...a, name} : a)
    )
  }

  const onAddDocument = (id: string, document: Id<"documents">) => {
    setContent(prev =>
      prev?.map(a => a.content.includes(document) ? {...a, content: a.content.filter( b => b !== document )} : a)
    )
    setContent(prev =>
      prev?.map(a => a._id === id ? {...a, content: [...a.content, document]} : a)
    )
  }
  
  const onAddDocumentIndex = (id: string, document: Id<"documents">, forward: Id<"documents">) => {
    const newContent = content?.map(a => a.content.includes(document) ? {...a, content: a.content.filter( b => b !== document )} : a);
    if (!!newContent) {
      const index = newContent.filter(a => a._id === id)[0].content.indexOf(forward);

      setContent( 
        newContent?.map(a => a._id === id ? {...a, content: [
          ...a.content.slice(0, index),
          document,
          ...a.content.slice(index)
        ]} : a));
    }
  }

  return {
    content,
    onNewElement,
    onRemoveElement,
    onRenameElement,
    onAddDocument,
    onAddDocumentIndex,
  }
}