import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MessageSquare,
  AlertTriangle,
  Wifi,
  Layers,
  Target,
  Puzzle,
  X,
} from "lucide-react"

export default function GameViewDialog({
  closeModal,
  gameData,
  gameIsError,
  gameIsFetching,
  gameFetchStatus,
  gameFetchingError,
}) {
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="w-[90vw] max-w-[90vw] overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white p-0 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-lg md:max-w-xl">
        {/* Header */}
        <DialogHeader className="m-3 sm:m-4 md:m-5">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-1.5 sm:p-2">
              <MessageSquare className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="line-clamp-2 text-base leading-tight font-bold text-[#1e293b] sm:text-lg md:text-xl">
                {gameData?.question || (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e2e8f0] border-t-[#64748b] sm:h-5 sm:w-5"></div>
                    Loading Question...
                  </div>
                )}
              </DialogTitle>
              <p className="mt-1 text-xs text-[#64748b] sm:mt-2 sm:text-sm">
                Training Wheel Game Question
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content area */}
        <div className="relative space-y-4 p-4 sm:space-y-5 sm:p-5 md:space-y-6">
          {/* Decorations */}
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 blur-2xl sm:h-28 sm:w-28 sm:translate-x-14 sm:-translate-y-14 md:h-32 md:w-32 md:translate-x-16 md:-translate-y-16"></div>
          <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-white to-[#2563eb]/10 blur-2xl sm:h-22 sm:w-22 sm:-translate-x-11 sm:translate-y-11 md:h-24 md:w-24 md:-translate-x-12 md:translate-y-12"></div>

          <form className="relative space-y-4 sm:space-y-5 md:space-y-6">
            {/* Error state */}
            {gameIsError && (
              <div className="flex items-center gap-2 rounded-[8px] border border-[#ef4444] bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 p-3 sm:gap-3 sm:p-4">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-[#ef4444] sm:h-5 sm:w-5" />
                <p className="text-xs font-medium text-[#ef4444] sm:text-sm">
                  {gameFetchingError?.message || "An error occurred"}
                </p>
              </div>
            )}

            {/* No internet */}
            {gameFetchStatus === "paused" && (
              <div className="flex items-center gap-2 rounded-[8px] border border-[#f59e0b] bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 p-3 sm:gap-3 sm:p-4">
                <Wifi className="h-4 w-4 flex-shrink-0 text-[#f59e0b] sm:h-5 sm:w-5" />
                <p className="text-xs font-medium text-[#f59e0b] sm:text-sm">
                  No Internet connection
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {(gameFetchStatus === "fetching" ||
              gameIsFetching ||
              (!gameData && gameFetchStatus !== "paused")) &&
            !gameIsError ? (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-4 w-20 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-5 sm:w-24" />
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-6 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-7"
                        style={{ width: `${14 + i * 6}%` }}
                      />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-28 md:h-32" />
              </div>
            ) : (
              gameData && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Difficulties */}
                  {gameData?.difficulties?.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#2563eb] sm:h-5 sm:w-5" />
                        <span className="text-sm font-semibold text-[#1e293b] sm:text-base">
                          Difficulty Levels
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {gameData.difficulties.map((item, i) => {
                          const difficultyStyles = {
                            beginner: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]",
                            intermediate: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]",
                            expert: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]",
                          }
                          return (
                            <Badge
                              key={i}
                              className={`${difficultyStyles[item] || difficultyStyles.intermediate} rounded-[8px] border px-2 py-0.5 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md sm:px-3 sm:py-1 sm:text-sm`}
                            >
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Answer */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-[#f59e0b] sm:h-5 sm:w-5" />
                      <span className="text-sm font-semibold text-[#1e293b] sm:text-base">
                        Complete Answer
                      </span>
                    </div>
                    <div className="relative rounded-[8px] border border-[#e2e8f0] bg-white p-4 shadow-sm sm:p-5 md:p-6">
                      <div className="absolute top-0 left-0 h-0.5 w-full rounded-t-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]"></div>
                      <p className="line-clamp-3 text-sm leading-relaxed font-medium text-[#1e293b] sm:text-base md:text-lg">
                        "{gameData.answer}"
                      </p>
                    </div>
                  </div>

                  {/* Answer chunks */}
                  {gameData?.answer_in_chunks?.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2">
                        <Puzzle className="h-4 w-4 text-[#2563eb] sm:h-5 sm:w-5" />
                        <span className="text-sm font-semibold text-[#1e293b] sm:text-base">
                          Answer Breakdown
                        </span>
                        <span className="text-xs text-[#64748b] sm:text-sm">
                          ({gameData.answer_in_chunks.length} parts)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                        {gameData.answer_in_chunks.map((chunk, i) => (
                          <div
                            key={i}
                            className="group flex items-center gap-2 rounded-[8px] border border-[#e2e8f0] bg-white p-3 transition-all duration-200 hover:shadow-sm sm:gap-3"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-xs font-semibold text-white transition-transform duration-200 group-hover:scale-105 sm:h-8 sm:w-8 sm:text-sm">
                              {i + 1}
                            </div>
                            <span className="line-clamp-2 text-xs font-medium text-[#1e293b] sm:text-sm">
                              {chunk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            {/* Footer */}
            <DialogFooter className="relative border-t border-[#e2e8f0] px-4 pt-4 sm:px-5 sm:pt-5 md:px-6 md:pt-6">
              <DialogClose asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={closeModal}
                >
                  <X className="mr-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-90 sm:mr-2 sm:h-4 sm:w-4" />
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
