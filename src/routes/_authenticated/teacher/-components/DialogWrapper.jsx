import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {  useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { closeModal } from '../../../../shared/config/reducers/teacher/teacherDialogSlice'
import { courseQueryOptions } from '../courses'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import { gameQueryOptions } from '../trainingwheelgame/index.lazy'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { MessageSquare, Layers, Target, Puzzle, AlertTriangle, Wifi, X, CheckCircle2 } from 'lucide-react';

const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [dialogType, setDialogType] = useState(modalType)
  const dispatch = useDispatch()
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const queryClient = useQueryClient()
  const {router} = useAppUtils()
  const navigate = useNavigate()
  const deleteCourse = useCallback(async () => {
    try {
      let response = await axios.delete(
        `/teacher/course/delete/${modalData?.courseId}`
      )
      response = response.data
      if (response.success) {
        toast.success(response.message)
        dispatch(closeModal())
        await queryClient.invalidateQueries(
          courseQueryOptions({page:modalData?.page,input:modalData?.query})
        )
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      console.log('modalData ===>',modalData)
        if(modalData?.redirect) navigate({to:modalData?.redirect,search: { input: modalData?.query, page: modalData?.page },})
        if (modalData?.index == 0) {
        navigate({
          href: `/teacher/courses`,
          search: { input: modalData?.query, page: modalData?.page },
          reloadDocument: true,
        })
      }
    }
  }, [
    axios,
    toast,
    modalData?.courseId,
    router,
    queryClient,
    modalData?.index,
    modalData?.query,
    courseQueryOptions,
    modalData?.searchParams,
    modalData?.redirect,
  ])
  
  const deleteGame = useCallback(async () => {
    try {
      let response = await axios.delete(
        `/teacher/game/training-wheel-game/delete/${modalData?.gameID}`
      )
      response = response.data
      if (response.success) {
          toast.success('Game deleted successfully')
          dispatch(closeModal())
        await queryClient.invalidateQueries(gameQueryOptions(modalData?.params));
      }
    } catch (error) {
      console.log('Error: ', error);
      toast.error("Internal server error");
    }
  }, [axios, modalData?.gameID, router, toast,queryClient,gameQueryOptions,modalData?.params,dispatch,closeModal]);

  // setting dialog type
  useEffect(() => {
    setDialogType(modalType)
  }, [modalData, modalType])

  const {
    data: gameData,
    isFetching: gameIsFetching,
    fetchStatus: gameFetchStatus,
    isError: gameIsError,
    error: gameFetchingError,
  } = useQuery({
    queryKey: ['game', modalData?.gameID],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/teacher/game/training-wheel-game/get-game/${modalData?.gameID}`
        )
        response = response.data

        if (response.success) {
          const game = response.data
          return game
        }
      } catch (error) {
        console.log('error', error)
        const errorMessage = error.response.data.message
        console.error(errorMessage)
      }
    },
    enabled: isOpen && dialogType === 'game-view',
  })
   const handleSubmitDeletion = async () => {
      await deleteCourse()
    }

     const handleSubmitDeleteGame = async () => {
    await deleteGame()
  }
return (
<>
<Dialog open={isOpen && dialogType === 'game-view'} onOpenChange={() => {
  console.log('Dialog onOpenChange triggered');
  dispatch(closeModal());
}}>
  <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-lg md:max-w-xl p-0 rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] bg-white border border-[#e2e8f0] overflow-hidden">
    {/* Header */}
    <DialogHeader className="m-3 sm:m-4 md:m-5">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-[8px]">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b] leading-tight line-clamp-2">
            {gameData?.question || (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#e2e8f0] border-t-[#64748b] rounded-full animate-spin"></div>
                Loading Question...
              </div>
            )}
          </DialogTitle>
          <p className="text-[#64748b] text-xs sm:text-sm mt-1 sm:mt-2">Training Wheel Game Question</p>
        </div>
      </div>
    </DialogHeader>

    {/* Content area */}
    <div className="relative p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full -translate-y-12 sm:-translate-y-14 md:-translate-y-16 translate-x-12 sm:translate-x-14 md:translate-x-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-20 sm:w-22 md:w-24 h-20 sm:h-22 md:h-24 bg-gradient-to-tr from-white to-[#2563eb]/10 rounded-full translate-y-10 sm:translate-y-11 md:translate-y-12 -translate-x-10 sm:-translate-x-11 md:-translate-x-12 blur-2xl"></div>

      <form className="relative space-y-4 sm:space-y-5 md:space-y-6">
        {/* Error states */}
        {gameIsError && (
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444] rounded-[8px]">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ef4444] flex-shrink-0" />
            <p className="text-[#ef4444] text-xs sm:text-sm font-medium">{gameFetchingError?.message || 'An error occurred'}</p>
          </div>
        )}

        {gameFetchStatus === 'paused' && (
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 border border-[#f59e0b] rounded-[8px]">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b] flex-shrink-0" />
            <p className="text-[#f59e0b] text-xs sm:text-sm font-medium">No Internet connection</p>
          </div>
        )}

        {/* Loading skeletons */}
        {(gameFetchStatus === 'fetching' || gameIsFetching || (!gameData && gameFetchStatus !== 'paused')) && !gameIsError ? (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Skeleton for difficulties badges */}
            <div className="space-y-2 sm:space-y-3">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]" />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Skeleton className="h-6 sm:h-7 w-16 sm:w-20 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]" />
                <Skeleton className="h-6 sm:h-7 w-20 sm:w-24 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]" />
                <Skeleton className="h-6 sm:h-7 w-14 sm:w-18 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]" />
              </div>
            </div>
            {/* Skeleton for answer box */}
            <Skeleton className="h-24 sm:h-28 md:h-32 w-full rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]" />
            {/* Skeleton for answer chunks */}
            <div className="space-y-2 sm:space-y-3">
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]" />
              <div className="space-y-1 sm:space-y-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-3 sm:h-4 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]"
                    style={{ width: `${75 + (i % 3) * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Actual content */
          gameData && (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Difficulties section */}
              {gameData?.difficulties?.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
                    <span className="font-semibold text-[#1e293b] text-sm sm:text-base">Difficulty Levels</span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {gameData.difficulties.map((item, i) => {
                      const difficultyStyles = {
                        beginner: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]',
                        intermediate: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]',
                        expert: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]',
                      };
                      return (
                        <Badge
                          key={i}
                          className={`${difficultyStyles[item] || difficultyStyles.intermediate} border font-medium px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-[8px] shadow-sm hover:shadow-md transition-all duration-200`}
                        >
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Answer section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />
                  <span className="font-semibold text-[#1e293b] text-sm sm:text-base">Complete Answer</span>
                </div>
                <div className="relative p-4 sm:p-5 md:p-6 bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-t-[8px]"></div>
                  <p className="text-[#1e293b] text-sm sm:text-base md:text-lg font-medium leading-relaxed line-clamp-3">
                    "{gameData.answer}"
                  </p>
                </div>
              </div>

              {/* Answer chunks section */}
              {gameData?.answer_in_chunks?.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
                    <span className="font-semibold text-[#1e293b] text-sm sm:text-base">Answer Breakdown</span>
                    <span className="text-xs sm:text-sm text-[#64748b]">({gameData.answer_in_chunks.length} parts)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {gameData.answer_in_chunks.map((chunk, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 p-3 bg-white rounded-[8px] border border-[#e2e8f0] hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold group-hover:scale-105 transition-transform duration-200">
                          {i + 1}
                        </div>
                        <span className="text-[#1e293b] font-medium text-xs sm:text-sm line-clamp-2">{chunk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* Footer */}
        <DialogFooter className="relative pt-4 sm:pt-5 md:pt-6 border-t border-[#e2e8f0] px-4 sm:px-5 md:px-6">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              className="group border-[#e2e8f0] bg-[#f1f5f9] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] w-full sm:w-auto rounded-[8px] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
              onClick={() => {
                console.log('Close button clicked');
                if (typeof dispatch === 'function') {
                  dispatch(closeModal());
                } else {
                  console.error('dispatch is undefined');
                }
              }}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={isOpen && dialogType === 'delete-course-modal'} onOpenChange={() => {
  console.log('Dialog onOpenChange triggered');
  dispatch(closeModal());
}}>
  <form onSubmit={(e) => {
    e.preventDefault();
    console.log('Form submitted, calling handleSubmitDeletion');
    if (typeof handleSubmitDeletion === 'function') {
      handleSubmitDeletion();
    } else {
      console.error('handleSubmitDeletion is undefined');
    }
  }}>
    <DialogContent className="sm:max-w-[425px] relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      {/* Glow effect wrapper */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-[12px] blur-lg opacity-30 animate-pulse pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        
        <DialogHeader className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b]">Delete Course</DialogTitle>
          </div>
          
          <DialogDescription className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {/* Warning icon */}
            <div className="text-center">
              <div className="mx-auto w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 rounded-full flex items-center justify-center shadow-md border border-[#e2e8f0]">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            
            {/* Warning text */}
            <div className="text-center space-y-1 sm:space-y-2">
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b]">
                Are you sure you want to delete this course?
              </span>
              <p className="text-[#64748b] text-xs sm:text-sm">This action cannot be undone.</p>
            </div>
            
            {/* Course details */}
            <div className="bg-white rounded-[8px] p-3 sm:p-4 border border-[#e2e8f0] shadow-sm">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="inline-block px-2 py-1 bg-[#2563eb]/10 text-[#2563eb] text-xs sm:text-sm font-semibold rounded-full mb-1">
                    Title
                  </span>
                  <p className="text-[#1e293b] text-xs sm:text-sm font-medium line-clamp-2">
                    {modalData?.courseDetails?.name || 'No title available'}...
                  </p>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] text-xs sm:text-sm font-semibold rounded-full mb-1">
                    Description
                  </span>
                  <p className="text-[#64748b] text-xs sm:text-sm line-clamp-2">
                    {modalData?.courseDetails?.desc || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Input area */}
        <div className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
          {showInput && (
            <div className="flex flex-col gap-2 sm:gap-3 animate-in slide-in-from-top duration-300">
              <Label 
                htmlFor="deleteInput"
                className="text-xs sm:text-sm font-semibold text-[#1e293b]"
              >
                Please type <span className="text-[#ef4444] font-bold">'delete'</span> to confirm
              </Label>
              <div className="relative">
                <Input
                  id="deleteInput"
                  type="text"
                  placeholder="delete"
                  value={inputValue || ''}
                  onChange={(e) => {
                    console.log('Input changed:', e.target.value);
                    if (typeof setInputValue === 'function') {
                      setInputValue(e.target.value);
                    } else {
                      console.error('setInputValue is undefined');
                    }
                  }}
                  className="border border-[#e2e8f0] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 bg-white rounded-[8px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm placeholder:text-[#94a3b8]"
                />
                {inputValue === 'delete' && (
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
                  </div>
                )}
                <div className="text-xs text-[#94a3b8] mt-1">
                  {inputValue?.length || 0}/6 characters
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                console.log('Cancel button clicked');
                if (typeof dispatch === 'function') {
                  dispatch(closeModal());
                } else {
                  console.error('dispatch is undefined');
                }
              }}
              className="w-full sm:w-auto border border-[#e2e8f0] bg-[#f1f5f9] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] rounded-[8px] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            type="button"
            variant="destructive"
            disabled={showInput && inputValue !== 'delete'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Delete button clicked, showInput:', showInput, 'inputValue:', inputValue);
              if (typeof setShowInput !== 'function') {
                console.error('setShowInput is undefined');
                return;
              }
              if (!showInput) {
                console.log('Toggling showInput to true');
                setShowInput(true);
              } else if (inputValue === 'delete') {
                console.log('Submitting form via handleSubmitDeletion');
                if (typeof handleSubmitDeletion === 'function') {
                  handleSubmitDeletion();
                } else {
                  console.error('handleSubmitDeletion is undefined');
                }
              }
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 hover:from-[#ef4444]/20 hover:to-[#dc2626]/20 text-[#ef4444] rounded-[8px] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#ef4444] transition-all duration-200 disabled:bg-[#e2e8f0] disabled:text-[#64748b] disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </form>
</Dialog>

<Dialog open={isOpen && dialogType === 'delete-game-modal'} onOpenChange={() => {
  dispatch(closeModal());
}}>
  <form onSubmit={(e) => {
    e.preventDefault();
    console.log('Form submitted, calling handleSubmitDeleteGame');
    if (typeof handleSubmitDeleteGame === 'function') {
      handleSubmitDeleteGame();
    } else {
      console.error('handleSubmitDeleteGame is undefined');
    }
  }}>
    <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[425px] relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      {/* Glow effect wrapper */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-[12px] blur-lg opacity-30 animate-pulse pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        
        <DialogHeader className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b]">Delete Game</DialogTitle>
          </div>
          
          <DialogDescription className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {/* Warning icon */}
            <div className="text-center">
              <div className="mx-auto w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 rounded-full flex items-center justify-center shadow-md border border-[#e2e8f0]">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            
            {/* Warning text */}
            <div className="text-center space-y-1 sm:space-y-2">
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b]">
                Are you sure you want to delete this game?
              </span>
              <p className="text-[#64748b] text-xs sm:text-sm">This action cannot be undone.</p>
            </div>
            
            {/* Game details */}
            <div className="bg-white rounded-[8px] p-3 sm:p-4 border border-[#e2e8f0] shadow-sm">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="inline-block px-2 py-1 bg-[#2563eb]/10 text-[#2563eb] text-xs sm:text-sm font-semibold rounded-full mb-1">
                    Question
                  </span>
                  <p className="text-[#1e293b] text-xs sm:text-sm font-medium line-clamp-2">
                    {modalData?.gameDetails?.question}
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Input area */}
        <div className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
          {showInput && (
            <div className="flex flex-col gap-2 sm:gap-3 animate-in slide-in-from-top duration-300">
              <Label 
                htmlFor="deleteInput"
                className="text-xs sm:text-sm font-semibold text-[#1e293b]"
              >
                Please type <span className="text-[#ef4444] font-bold">'delete'</span> to confirm
              </Label>
              <div className="relative">
                <Input
                  id="deleteInput"
                  type="text"
                  placeholder="delete"
                  value={inputValue || ''}
                  onChange={(e) => {
                    console.log('Input changed:', e.target.value);
                    if (typeof setInputValue === 'function') {
                      setInputValue(e.target.value);
                    } else {
                      console.error('setInputValue is undefined');
                    }
                  }}
                  className="border border-[#e2e8f0] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 bg-white rounded-[8px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm placeholder:text-[#94a3b8]"
                />
                {inputValue === 'delete' && (
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
                  </div>
                )}
                <div className="text-xs text-[#94a3b8] mt-1">
                  {inputValue?.length || 0}/6 characters
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                console.log('Cancel button clicked');
                if (typeof dispatch === 'function') {
                  dispatch(closeModal());
                } else {
                  console.error('dispatch is undefined');
                }
              }}
              className="w-full sm:w-auto border border-[#e2e8f0] bg-[#f1f5f9] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] rounded-[8px] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            type="button"
            variant="destructive"
            disabled={showInput && inputValue !== 'delete'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Delete button clicked, showInput:', showInput, 'inputValue:', inputValue);
              if (typeof setShowInput !== 'function') {
                console.error('setShowInput is undefined');
                return;
              }
              if (!showInput) {
                console.log('Toggling showInput to true');
                setShowInput(true);
              } else if (inputValue === 'delete') {
                console.log('Submitting form via handleSubmitDeleteGame');
                if (typeof handleSubmitDeleteGame === 'function') {
                  handleSubmitDeleteGame();
                } else {
                  console.error('handleSubmitDeleteGame is undefined');
                }
              }
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 hover:from-[#ef4444]/20 hover:to-[#dc2626]/20 text-[#ef4444] rounded-[8px] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#ef4444] transition-all duration-200 disabled:bg-[#e2e8f0] disabled:text-[#64748b] disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </form>
</Dialog>
</>
)





}

export default DialogWrapper