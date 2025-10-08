import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export function DialogSkeleton({ open = true, onClose, maxWidth = "sm" ,h = 'sm'}) {
  const maxWidthClass = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth]

  const heightClass = {
    xs:'h-[200px]',
    sm: "h-[300px]",
    md: "h-[400px]",
    lg: "h-[500px]",
    xl: "h-[600px]",
  }[h]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`
          mx-auto w-full ${maxWidthClass} rounded-xl bg-white p-6 shadow-lg
          animate-pulse ${heightClass}
        `}
      >
  
        <Skeleton className="h-full w-full rounded-md" />

  
 
      </DialogContent>
    </Dialog>
  )
}
