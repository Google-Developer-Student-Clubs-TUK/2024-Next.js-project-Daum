import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { Skeleton } from "./ui/skeleton"

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
      className="w-full h-16 bg-green-200 dark:bg-green-700 rounded-md" 
      draggable={editable}
    >
      <div className="m-2 text-foreground">
        {document?.title}
      </div>
    </div>
  )
}