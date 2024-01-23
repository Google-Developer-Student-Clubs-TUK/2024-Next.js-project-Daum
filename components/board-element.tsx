"use client";

import { ElementRef, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { KanbanBoardProps } from "@/hooks/use-kanban-board";
import TextareaAutoSize from "react-textarea-autosize";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Plus, Search, Settings, Trash } from "lucide-react";
import { BoardDocument } from "./board-document";
import { Input } from "./ui/input";
import { KanbanBoardDocument, KanbanBoardElement } from "@/types/kanbanboard";
import { useTheme } from "next-themes";

export const BoardElement = ({
  editor,
  element: {
    name,
    _id,
    content,
    color
  },
  editable,
  documents,
}: {
  editor: KanbanBoardProps,
  element: KanbanBoardElement,
  editable?: boolean,
  documents?: Doc<"documents">[] | undefined,
}) => {
  const { resolvedTheme } = useTheme();
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  })

  const contentDocuments = content.map(c =>
    documents !== undefined ? { board: c, doc: documents.filter(d => d._id === c._id)[0]} : undefined
  ).filter((c): c is { board: KanbanBoardDocument, doc:  Doc<"documents">} => !!c);

  const {
    onRenameElement,
    onRemoveElement,
    onMoveElement,
    onElementSetColor,

    onAddDocument,
  } = editor;

  const colors = [
    { light: "#f5f5f5", dark: "#262626"},
    { light: "#fee2e2", dark: "#7f1d1d"},
    { light: "#ffedd5", dark: "#7c2d12"},
    { light: "#fef9c3", dark: "#713f12"},
    { light: "#dcfce7", dark: "#14532d"},
    { light: "#e0f2fe", dark: "#0c4a6e"},
    { light: "#dbeafe", dark: "#1e3a8a"},
    { light: "#f3e8ff", dark: "#581c87"},
  ];

  const enableInput = () => {
    if (!editable) return;

    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }


  const disableInput = () => setIsEditing(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  }

  const onInput = (id: string, value: string) => {
    onRenameElement(id, value);
  }

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("elementid", _id);
    e.stopPropagation();
  }

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "documentid") {
      e.preventDefault();
    }
    if (e.dataTransfer.types[0] === "elementid") {
      e.preventDefault();
    }
  }

  const onDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "documentid") {
      const documentId = e.dataTransfer.getData("documentid") as Id<"documents">;
      onAddDocument(_id, documentId);

      e.stopPropagation();
    }

    if (e.dataTransfer.types[0] === "elementid") {
      const elementId = e.dataTransfer.getData("elementid");
      onMoveElement(elementId, _id);

      e.stopPropagation();
    }
  }

  return (
    <div
      className="flex flex-col h-min w-64 min-w-48 ml-2 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-[0.5]"
      style={!!color ? {
          backgroundColor: resolvedTheme === "dark" ? color.dark : color.light
        }
      : {}
      }
      onDragOver={onDragOver}
      onDrop={onDrop}

      draggable={editable}
      onDragStart={onDragStart}
    >
      <div className="mb-8 flex justify-between items-center">
        { isEditing && editable ? (
          <TextareaAutoSize
            ref={inputRef}
            onBlur={() => { disableInput(); }}
            onKeyDown={(e) => { onKeyDown(e); }}
            value={name}
            onChange={(e) => onInput(_id, e.target.value)}
            className="text-xl text-nowrap resize-none overflow-hidden"
            maxRows={1}
          />
        ) : (
          <div
            onClick={() => enableInput()}
            className="text-xl text-nowrap text-ellipsis overflow-hidden"
          >
            {name}
          </div>
        )}

        <div className={cn(
          "hidden",
          editable && "flex",
        )}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='sm'
                variant="ghost"
                className="hover:bg-neutral-200 dark:hover:bg-neutral-600 flex-1"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-48"
              side="bottom"
            >
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full flex justify-start"
                  onClick={() => onRemoveElement(_id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <div className="p-1 flex justify-around">
                {colors.map(c => (
                  <div
                    key={c.light}
                    role="button"
                    className={cn(
                      "h-4 w-4 rounded-sm",
                      color?.light === c.light && "border-2 border-neutral-500 dark:border-neutral-400"
                    )}
                    style={{
                      backgroundColor: resolvedTheme === "dark" ? c.dark : c.light
                    }}
                    onClick={() => onElementSetColor(_id, c)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='sm'
                variant="ghost"
                className="hover:bg-neutral-200 dark:hover:bg-neutral-600 flex-1"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-48"
              side="bottom"
            >
              <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                  placeholder="Filter by title..."
                />
              </div>
              <div className="m-2">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                  No documents found.
                </p>
                {filteredDocuments?.map((document) => (
                  <div
                    role="button"
                    className="flex text-sm rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-nowrap text-ellipsis overflow-hidden"
                    key={document._id}
                    onClick={() => onAddDocument(_id, document._id)}
                  >
                      {document.icon && (
                        <div className="shrink-0 mr-2 text-[18px]">{document.icon}</div>
                      )}
                      {document.title}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col min-h-64 space-y-2">
        {contentDocuments.length > 0 ? contentDocuments.map(document => (
          <BoardDocument
            key={document.board._id}
            boardDocument={document.board}
            _id={_id}
            document={document.doc}
            editable={editable}
            editor={editor}
          />
        )) : (
          <div className="flex flex-col items-center justify-center w-full text-muted-foreground">
            No documents.
          </div>
        )}
      </div>
    </div>
  )
}
