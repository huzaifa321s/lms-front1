import React from 'react'
import {
  MessageSquare,
  AlertTriangle,
  Wifi,
  Layers,
  Target,
  Puzzle,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function GameViewDialog({
  closeModal,
  gameData,
  gameIsError,
  gameIsFetching,
  gameFetchStatus,
  gameFetchingError,
}) {
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        hideCloseButton
        className='border-border bg-background max-w-3xl rounded-2xl border p-0 shadow-xl'
      >
        <DialogHeader className='p-5'>
          <div className='flex items-start gap-3'>
            <div className='from-primary to-primary/80 rounded-lg bg-gradient-to-r p-2'>
              <MessageSquare className='h-6 w-6 text-white' />
            </div>
            <div className='min-w-0 flex-1'>
              <DialogTitle className='text-foreground line-clamp-2 text-lg font-semibold sm:text-xl'>
                {gameData?.question || (
                  <div className='flex items-center gap-2'>
                    <div className='border-muted border-t-primary h-5 w-5 animate-spin rounded-full border-2'></div>
                    Loading Question...
                  </div>
                )}
              </DialogTitle>
              <p className='text-muted-foreground mt-1 text-sm'>
                Training Wheel Game Question s
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className='max-h-[75vh] p-5'>
          <div className='relative space-y-6'>
            {/* Background glow accents */}
            <div className='bg-primary/10 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full blur-3xl'></div>
            <div className='bg-primary/10 absolute bottom-0 left-0 h-24 w-24 -translate-x-10 translate-y-10 rounded-full blur-3xl'></div>

            {/* Error state */}
            {gameIsError && (
              <Card className='border-destructive/30 bg-destructive/10'>
                <CardContent className='flex items-center gap-3 p-4'>
                  <AlertTriangle className='text-destructive h-5 w-5' />
                  <p className='text-destructive text-sm font-medium'>
                    {gameFetchingError?.message || 'An error occurred'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Offline state */}
            {gameFetchStatus === 'paused' && (
              <Card className='border-amber-400/30 bg-amber-100/20'>
                <CardContent className='flex items-center gap-3 p-4'>
                  <Wifi className='h-5 w-5 text-amber-500' />
                  <p className='text-sm font-medium text-amber-600'>
                    No internet connection
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Loading */}
            {(gameFetchStatus === 'fetching' ||
              gameIsFetching ||
              (!gameData && gameFetchStatus !== 'paused')) &&
            !gameIsError ? (
              <div className='space-y-4'>
                <Skeleton className='h-5 w-40 rounded-md' />
                <div className='flex flex-wrap gap-2'>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className='h-6 rounded-full'
                      style={{ width: `${14 + i * 6}%` }}
                    />
                  ))}
                </div>
                <Skeleton className='h-28 w-full rounded-md' />
              </div>
            ) : (
              gameData && (
                <div className='space-y-6'>
                  {/* Difficulty Levels */}
                  {gameData?.difficulties?.length > 0 && (
                    <div className='space-y-2'>
                      <h4 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                        <Layers className='text-primary h-5 w-5' />
                        Difficulty Levels
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {gameData.difficulties.map((item, i) => {
                          const colorMap = {
                            beginner:
                              'bg-emerald-100 text-emerald-600 border-emerald-400',
                            intermediate:
                              'bg-amber-100 text-amber-600 border-amber-400',
                            expert: 'bg-red-100 text-red-600 border-red-400',
                          }
                          return (
                            <Badge
                              key={i}
                              className={`border ${colorMap[item] || colorMap.intermediate}`}
                            >
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Complete Answer */}
                  <div className='space-y-2'>
                    <h4 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                      <Target className='h-5 w-5 text-amber-500' />
                      Complete Answer
                    </h4>
                    <Card className='border-border relative border'>
                      <div className='from-primary to-primary/70 absolute top-0 left-0 h-0.5 w-full rounded-t-md bg-gradient-to-r'></div>
                      <CardContent className='p-5'>
                        <p className='text-foreground text-sm leading-relaxed font-medium sm:text-base'>
                          “{gameData.answer}”
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Answer Breakdown */}
                  {gameData?.answer_in_chunks?.length > 0 && (
                    <div className='space-y-3'>
                      <h4 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                        <Puzzle className='text-primary h-5 w-5' />
                        Answer Breakdown
                        <span className='text-muted-foreground text-xs'>
                          ({gameData.answer_in_chunks.length} parts)
                        </span>
                      </h4>
                      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        {gameData.answer_in_chunks.map((chunk, i) => (
                          <Card
                            key={i}
                            className='border-border border transition-all duration-200 hover:shadow-sm'
                          >
                            <CardContent className='flex items-center gap-3 p-3'>
                              <div className='from-primary to-primary/80 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r text-xs font-semibold text-white'>
                                {i + 1}
                              </div>
                              <span className='text-foreground line-clamp-2 text-sm'>
                                {chunk}
                              </span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </ScrollArea>

        <DialogFooter className='border-border border-t p-4'>
          <DialogClose asChild>
            <Button variant='outline' onClick={closeModal}>
              <X className='mr-2 h-4 w-4' /> Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
