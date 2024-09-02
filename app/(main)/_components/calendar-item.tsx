"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "convex/react";
import { LucideIcon, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CalendarItemProps {
  //"boards" : 테이블 이름을 의미
  id?: Id<"calendars">;
  calendarIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

export const CalendarItem = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  calendarIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: CalendarItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const archive = useMutation(api.calendars.archive);
  const updateTitle = useMutation(api.calendars.update);
  const editableRef = useRef<HTMLDivElement>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => router.push("/calendars"));

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });
  };

  const onUpdate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // Focus on the editable element
    setIsEditable(true);
    if (editableRef.current) {
      editableRef.current.focus();
    }
  };

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 엔터 입력 시 줄바꿈 방지
      if (editableRef.current) {
        editableRef.current.blur(); // 포커스 제거
      }
    }
  };

  const handleBlur = async () => {
    if (editableRef.current && id) {
      const newTitle = editableRef.current.innerText;
      // Convex 서버에 새로운 제목을 업데이트
      await updateTitle({ id, title: newTitle });
      setIsEditable(false);
      toast.success("Title updated successfully!");
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {calendarIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{calendarIcon}</div>
      ) : (
        <Icon
          className="shrink-0 h-[18px] mr-2
       text-muted-foreground"
        />
      )}

      <div
        ref={editableRef}
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        className="truncate outline-none"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        {label}
      </div>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onUpdate}>
                <Trash className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

CalendarItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
