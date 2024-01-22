import { Id } from "@/convex/_generated/dataModel";
import { KanbanBoard, generateId, newKanbanBoard } from "@/types/kanbanboard"
import { useEffect, useState } from "react"

export interface KanbanBoardProps {
  content: KanbanBoard | undefined;
  onNewElement: () => void;
  onRemoveElement: (id: string) => void;
  onRenameElement: (id: string, name: string) => void;
  onMoveElement: (id: string, forward?: string) => void;
  onElementSetColor: (id: string, color: {light: string, dark: string}) => void;

  onAddDocument: (id: string, document: Id<"documents">) => void;
  onAddDocumentIndex: (id: string, document: Id<"documents">, forward: Id<"documents">) => void,
  onRemoveDocument: (document: Id<"documents">) => void;
  onDocumentSetColor: (Document: Id<"documents">, color: {light: string, dark: string} | undefined) => void;
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
    if (content === undefined) return;
    setContent([
      ...content,
      {
        _id: generateId(),
        name: "untitled",
        content: []
      }
    ]);
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

  const onMoveElement = (id: string, forward?: string) => {
    if (content === undefined) return;
    if (id === forward) return;

    const element = content.filter(a => a._id === id)[0];
    const newContent = content.filter(a => a._id !== id);
    if (forward !== undefined) {
      const fwdElement = content.filter(a => a._id === forward)[0];
      const index = newContent.indexOf(fwdElement);

      setContent([
        ...newContent.slice(0, index),
        element,
        ...newContent.slice(index)
      ]);
    }
    else {
      setContent([
        ...newContent,
        element
      ]);
    }
  }

  const onElementSetColor = (id: string, color: {light: string, dark: string}) => {
    if (content === undefined) return;

    setContent(
      content.map(a => a._id === id ? {...a, color} : a)
    );
  }

  const onAddDocument = (id: string, document: Id<"documents">) => {
    if (content === undefined) return;

    const doc = getDocument(content, document);
    if (doc === undefined) {
      setContent(
        content.map(a => a._id === id ? {...a, content: [...a.content, { _id: document}]} : a)
      );
    }
    else {
      const newContent = content.map(a => a.content.includes(doc) ? { ...a, content: a.content.filter( b => b !== doc )} : a);
      setContent(
        newContent.map(a => a._id === id ? {...a, content: [...a.content, doc]} : a)
      );
    }
  }
  
  const onAddDocumentIndex = (id: string, document: Id<"documents">, forward: Id<"documents">) => {
    if (content === undefined) return;
    if (document === forward) return;

    const doc = getDocument(content, document);
    if (doc === undefined) return;

    const newContent = content.map(a => a.content.includes(doc) ? {...a, content: a.content.filter( b => b !== doc )} : a);

    const fwd = getDocument(content, forward);
    if (fwd === undefined) return;

    const index = newContent.filter(a => a._id === id)[0].content.indexOf(fwd);

    setContent( 
      newContent?.map(a => a._id === id ? {...a, content: [
        ...a.content.slice(0, index),
        doc,
        ...a.content.slice(index)
      ]} : a));
  }

  const onRemoveDocument = (document: Id<"documents">) => {
    if (content === undefined) return;

    const doc = getDocument(content, document);
    if (doc === undefined) return;

    setContent(prev =>
      prev?.map(a => a.content.includes(doc) ? {...a, content: a.content.filter( b => b !== doc )} : a)
    )
  }

  const onDocumentSetColor = (document: Id<"documents">, color: {light: string, dark: string} | undefined) => {
    if (content === undefined) return;

    const doc = getDocument(content, document);
    if (doc === undefined) return;

    setContent(prev =>
      prev?.map(a => a.content.includes(doc) ? {...a, content: a.content.map( b => b === doc ? { ...b, color } : b)} : a)
    );
  }

  return {
    content,
    onNewElement,
    onRemoveElement,
    onRenameElement,
    onMoveElement,
    onElementSetColor,

    onAddDocument,
    onAddDocumentIndex,
    onRemoveDocument,
    onDocumentSetColor,
  }
}

const getDocument = (content: KanbanBoard, document: Id<"documents">) => {
  console.log(content, document);
  for (let e of content) {
    for (let d of e.content) {
      if (d._id === document) {
        return d;
      }
    }
  }
  return undefined;
}