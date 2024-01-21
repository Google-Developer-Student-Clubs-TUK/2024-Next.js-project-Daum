import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { Skeleton } from "./ui/skeleton"
import { File } from "lucide-react"
import Link from "next/link"

export const BoardDocument = ({
  id,
  editable
}: {
  id: Id<"documents">,
  editable?: boolean,
}) => {
  const document = useQuery(api.documents.getById, {
    documentId: id
  });

  if (document === undefined) {
    return <Skeleton className="h-16 w-full"/>
  }

  if (document === null) {
    return null;
  }

  return (
    <div
      className="w-full h-16 bg-green-200 dark:bg-green-700 rounded-md flex" 
      draggable={editable}
      onDragStart={(e) => e.dataTransfer.setData("documentid", id)}
    >
      <div className="m-2 flex">
        <Link
          href={`/documents/${document._id}`}
          className="">
            {document.icon ? (
              <p className="mr-2 text-[18px]">{document.icon}</p>
            ) : (
              <File className="mr-2 h-4 w-4" />
            )}
        </Link>
        <div className="text-foreground">
          {document.title}
        </div>
      </div>
    </div>
  )
}