import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  closeModal,
  openModal,
} from '../../../../shared/config/reducers/admin/DialogSlice'
import { courseCategoryQueryOptions } from '../settings/course-category'
import { gameCategoryQueryOptions } from '../settings/game-category'
import { gamesQueryOptions } from '../trainingwheelgame'
import {Table,TableHeader,TableBody,TableHead,TableRow,TableCell} from '@/components/ui/table'
import { AlertTriangle, CheckCircle2, Layers, MessageSquare, Puzzle, Target, Wifi, X } from 'lucide-react'
import { blogsQueryOptions } from '../blogs/index.lazy'
import { blogCategoryQueryOptions } from '../settings'

const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState(modalData?.inputValue)
  const queryClient = useQueryClient()
  const { router, dispatch ,navigate} = useAppUtils()
  const [dialogType, setDialogType] = useState(modalType)
useEffect(() => {
  if (modalData?.inputValue !== undefined) {
    setInputValue(modalData.inputValue)
  }
  setDialogType(modalType)
}, [modalData?.inputValue, modalType])
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
          `/admin/game/training-wheel-game/get-game/${modalData?.gameID}`
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


  const getCategoryIcon = () => {
    if (dialogType.includes('blog')) {
      return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      );
    } else if (dialogType.includes('course')) {
      return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    return (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    );
  };

  // Title and description based on dialog type
  const getCategoryTitle = () => {
    if (dialogType.includes('blog')) return 'Blog Category Overview';
    if (dialogType.includes('course')) return 'Course Category Overview';
    return 'Game Category Overview';
  };
  const {
    data: blogCategoryData,
    isFetching: blogCategoryIsFetching,
    fetchStatus: blogCategoryFetchStatus,
    isError: blogCategoryIsError,
    error: blogCategoryError,
  } = useQuery({
    queryKey: ['getBlogCategory', 'getCourseCategory', modalData?.categoryID],
    queryFn: async () => {
      try {

        console.log('dialogType ===>',dialogType)
        let response = await axios.get(
          `/admin/${dialogType === 'blog-category-view-modal' ? 'blog-category' : dialogType === 'course-category-view-modal' ? 'course-category' : dialogType === 'view-game-category-modal' ? 'game-category' : ''}/getCategory/${modalData?.categoryID}`
        )
        console.log('response ===>',response)
        response = response.data
        if (response.success) {
          const category = response.data
          return category
        }
      } catch (error) {
        console.log('error', error)
        const errorMessage = error?.response?.data.message
        console.error(errorMessage)
      }
    },
    enabled:
      isOpen &&
      (dialogType === 'blog-category-view-modal' ||
        dialogType === 'course-category-view-modal' ||
        dialogType === 'view-game-category-modal'),
  })

console.log('blogCategoryData ===>',blogCategoryData)

  const editCategory = useCallback(
    async (obj, inputValue) => {
      console.log('inputValue ===>', inputValue)
      if (inputValue === '') {
        return
      }
      console.log('obj before ===>', obj)
      const postObj = {
        name: inputValue,
        ...obj,
      }

      const route =
        dialogType === 'edit-category-modal'
          ? 'blog-category'
          : dialogType === 'course-category-edit-modal'
            ? 'course-category'
            : dialogType === 'game-category-edit-modal'
              ? 'game-category'
              : ''

      try {
        let response = await axios.put(
          `/admin/${route}/edit/${postObj._id}`,
          postObj
        )
        response = response.data
        if (response.success) {
          toast.success('Category edited successfully')

         if (dialogType === 'edit-category-modal') {
  await queryClient.invalidateQueries(
    blogCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
  )
} else if (dialogType === 'course-category-edit-modal') {
  await queryClient.invalidateQueries(
    courseCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
  )
} else if (dialogType === 'game-category-edit-modal') {
  await queryClient.invalidateQueries(
    gameCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
  )
}

          dispatch(closeModal())
        }
      } catch (error) {
        console.log('edit Category err data-> ', error)
        toast.error('Internal server error')
      }
    },
    [axios, toast, router, queryClient, modalData?.searchInput, dialogType]
  )
  const editCategoryMutation = useMutation({
    mutationFn: editCategory,
  })

  const deleteGame = useCallback(async () => {
    try {
      let response = await axios.delete(
        `/admin/game/training-wheel-game/delete/${modalData?.gameDetails?._id}`
      )
      response = response.data
      if (response.success) {
        await queryClient.invalidateQueries(
          gamesQueryOptions(modalData.searchParams)
        ).queryKey
        toast.success('Game deleted successfully')

        dispatch(closeModal())
        setShowInput(false)
        setInputValue('')
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }, [
    axios,
    dispatch,
    
    router,
    toast,
    queryClient,
    gamesQueryOptions,
    modalData?.searchParams,
  ])
  const deleteGameMutation = useMutation({
    mutationFn: deleteGame,
  })
  const deleteCategory = useCallback(
    async (obj) => {
      try {
        const route =
          dialogType === 'delete-blog-category' ||
          dialogType === 'confirm-delete-blog-category'
            ? 'blog-category'
            : dialogType === 'course-category-delete-modal'
              ? 'course-category'
              : dialogType === 'game-category-delete-modal' ||
                  dialogType === 'confirm-game-delete-category'
                ? 'game-category'
                : null
        console.log('route ===>', route)
        let response = await axios.delete(`/admin/${route}/delete/${obj._id}`, {
          data: obj,
        })
        response = response.data
        console.log('response 1 ===>', response)
        if (response.success) {
          if (dialogType === 'course-category-delete-modal') {
            console.log('condition true')
          }
          toast.success('Category deleted successfully')
         if (dialogType === 'delete-blog-category' || dialogType === 'confirm-delete-blog-category') {
  await queryClient.invalidateQueries(
    blogCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
  )
} else if (dialogType === 'course-category-delete-modal') {
  await queryClient.invalidateQueries(
    courseCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
  )
} else if (dialogType === 'game-category-delete-modal' || dialogType === 'confirm-game-delete-category') {
  await queryClient.invalidateQueries(
    gameCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
  )
}

          dispatch(closeModal())
        } else {
          console.log('response?.message ===>', response?.message)
          if (
            response?.message === 'This category contains some blogs' ||
            response?.message ===
              'This category contains courses, so cannot be deleted!' ||
            response?.message === 'This category contains some games'
          ) {
            dispatch(
              openModal({
                type:
                  response?.message === 'This category contains some blogs'
                    ? 'confirm-delete-blog-category'
                    : response?.message ===
                        'This category contains courses, so cannot be deleted!'
                      ? 'alert-course-category-delete'
                      : response?.message ===
                          'This category contains some games'
                        ? 'confirm-game-delete-category'
                        : '',
                props: {
                  confirmQuestion:
                    dialogType === 'delete-blog-category'
                      ? 'This blog category contain some blog, if you delete this category all blogs with this category will be deleted!'
                      : dialogType === 'course-category-delete-modal'
                        ? 'This course category contain some course, so cannot be deleted!'
                        : dialogType === 'game-category-delete-modal'
                          ? 'This game category contain some game, if you delete this category all games with this category will be deleted!'
                          : '',

                  category: modalData?.category,
                  searchInput: modalData?.searchInput,
                },
              })
            )
          }
        }
      } catch (error) {
        console.log('error', error)
        const errorResponse = error.response.data
      }
    },
    [
      axios,
      router,
      queryClient,
      modalData?.searchInput,
      blogCategoryQueryOptions,
      dispatch,
      openModal,
      
      dialogType,
    ]
  )
  const deleteBlogCategoryMutation = useMutation({
    mutationFn: deleteCategory,
  })
  const deleteBlogCategoryFirstMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      setShowInput(false)
      setInputValue('')
    },
  })
const deleteBlog = useCallback(async () => {
    try {
      let response = await axios.delete(`/admin/blog/delete/${modalData?.blogID}`)
      response = response.data
      if (response.success) {
        toast.success('Blog deleted successfully')
       await queryClient.invalidateQueries({...blogsQueryOptions({q:"",page:1,suspense:false})}).queryKey
       if(modalData?.redirect){
        navigate({to:modalData.redirect})
       }
        dispatch(closeModal())
      }
    } catch (error) {
      console.log('Registration Error -> ', error)
      toast.error('Internal server error')
    }
  }, [modalData?.blogID, toast,queryClient,blogsQueryOptions,axios])
  // API methods:
  const addCategory = useCallback(
    async (obj) => {
      try {
        const route =
          dialogType === 'add-blog-category-modal'
            ? 'blog-category'
            : dialogType === 'add-course-category'
              ? 'course-category'
              : dialogType === 'add-game-category'
                ? 'game-category'
                : ''
        console.log('route ===>', route)
        let response = await axios.post(`/admin/${route}/add`, obj)
        response = response.data
        if (response.success) {
          toast.success('Category added successfully')
          router.invalidate()
          if (dialogType === 'add-blog-category-modal') {
            console.log('dialogType condition',dialogType)
           await queryClient.invalidateQueries(
  blogCategoryQueryOptions({ q: modalData?.searchInput}).queryKey
)

          } else if (dialogType === 'add-course-category') {
            await queryClient.invalidateQueries(
              courseCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
            )
          } else if (dialogType === 'add-game-category') {
            await queryClient.invalidateQueries(
              gameCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
            )
          }
          dispatch(closeModal())
          setInputValue('')
        }
      } catch (error) {
        console.log('Add Category Error -> ', error)
        toast.error('Internal server error')
      }
    },
    [
      axios,
      toast,
      router,
      queryClient,
      modalData?.searchInput,
      blogCategoryQueryOptions,
      dispatch,
      closeModal,
      dialogType,
      gameCategoryQueryOptions,
    ]
  )
  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
  })

  const handleSubmitDeleteCategory = (e) => {
    e.preventDefault()
    deleteBlogCategoryMutation.mutate({
      ...modalData.category,
      deleteConfirmed: 'Yes',
    })
  }

  const handleSubmitAddCategory = async (e) => {
    e.preventDefault()
    addCategoryMutation.mutate({ name: inputValue })
  }

  const handleSubmitEditCategory = (e) => {
    e.preventDefault()
    editCategoryMutation.mutate(
      { ...modalData?.category, name: inputValue },
      inputValue
    )
  }
  const handleSubmitCategory = (e) => {
    e.preventDefault()
    deleteBlogCategoryFirstMutation.mutate(modalData?.category)
  }

const deleteBlogMutation = useMutation({
  mutationFn:deleteBlog
});

  const handleSubmitBlogDeletion = (e) => {
    e.preventDefault()
       deleteBlogMutation.mutate()
  }

   const {
    data: studentData,
    isFetching: studentIsFetching,
    fetchStatus: studentFetchStatus,
    isError: studentFetchIsError,
    error: studentFetchingError,
  } = useQuery({
    queryKey: ['getStudentWithEnrolledCourses', modalData?.studentID],
    queryFn: async () => {
      try {
        console.log('modalData?.studentID ===>',modalData?.studentID)
        let response = await axios.get(
          `/admin/student/getStudentWithEnrolledCourses/${modalData?.studentID}`
        )
        response = response.data

        if (response.success) {
          const studentData = response.data
          return studentData
        }
      } catch (error) {
        console.log('error', error)
        const errorMessage = error.response.data.message
        console.error(errorMessage)
      }
    },
    enabled: isOpen && dialogType === 'view-student-details',
  })


  return (
    <>
<Dialog
  open={isOpen && dialogType === 'game-view'}
  onOpenChange={() => {
    console.log('Dialog onOpenChange triggered');
    dispatch(closeModal());
  }}
>
  <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-lg md:max-w-xl p-0 rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] bg-[#ffffff] border border-[#e2e8f0] overflow-hidden">
    {/* Header */}
    <DialogHeader className="m-3 sm:m-4 md:m-5">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-[12px]">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffffff]" />
        </div>
        <div className="flex-1 min-w-0">
          <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b] leading-tight line-clamp-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            {gameData?.question || (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#e2e8f0] border-t-[#64748b] rounded-full animate-spin"></div>
                Loading Question...
              </div>
            )}
          </DialogTitle>
          <p className="text-[#64748b] text-xs sm:text-sm mt-1 sm:mt-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            Training Wheel Game Question
          </p>
        </div>
      </div>
    </DialogHeader>

    {/* Content area */}
    <div className="relative p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-full -translate-y-12 sm:-translate-y-14 md:-translate-y-16 translate-x-12 sm:translate-x-14 md:translate-x-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-20 sm:w-22 md:w-24 h-20 sm:h-22 md:h-24 bg-gradient-to-tr from-[#ffffff] to-[#f1f5f9] rounded-full translate-y-10 sm:translate-y-11 md:translate-y-12 -translate-x-10 sm:-translate-x-11 md:-translate-x-12 blur-2xl"></div>

      <form className="relative space-y-4 sm:space-y-5 md:space-y-6">
        {/* Error states */}
        {gameIsError && (
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#ef4444] to-[#dc2626] border border-[#e2e8f0] rounded-[12px]">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff] flex-shrink-0" />
            <p className="text-[#ffffff] text-xs sm:text-sm font-medium font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              {gameFetchingError?.message || 'An error occurred'}
            </p>
          </div>
        )}

        {gameFetchStatus === 'paused' && (
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-[#f59e0b] to-[#d97706] border border-[#e2e8f0] rounded-[12px]">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff] flex-shrink-0" />
            <p className="text-[#ffffff] text-xs sm:text-sm font-medium font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              No Internet connection
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {(gameFetchStatus === 'fetching' || gameIsFetching || (!gameData && gameFetchStatus !== 'paused')) && !gameIsError ? (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Skeleton className="h-6 sm:h-7 w-16 sm:w-20 rounded-full bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
                <Skeleton className="h-6 sm:h-7 w-20 sm:w-24 rounded-full bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
                <Skeleton className="h-6 sm:h-7 w-14 sm:w-18 rounded-full bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
              </div>
            </div>
            <Skeleton className="h-24 sm:h-28 md:h-32 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
            <div className="space-y-2 sm:space-y-3">
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
              <div className="space-y-1 sm:space-y-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-3 sm:h-4 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]"
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
                    <span className="font-semibold text-[#1e293b] text-sm sm:text-base font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                      Difficulty Levels
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {gameData.difficulties.map((item, i) => {
                      const difficultyStyles = {
                        beginner: 'bg-gradient-to-r from-[#10b981] to-[#059669] text-[#ffffff] border-[#10b981]',
                        intermediate: 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-[#ffffff] border-[#2563eb]',
                        expert: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-[#ffffff] border-[#ef4444]',
                      };
                      return (
                        <Badge
                          key={i}
                          className={`${difficultyStyles[item] || difficultyStyles.intermediate} border font-medium px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 rounded-[8px]`}
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
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
                  <span className="font-semibold text-[#1e293b] text-sm sm:text-base font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                    Complete Answer
                  </span>
                </div>
                <div className="relative p-4 sm:p-5 md:p-6 bg-[#ffffff] rounded-[12px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-t-[12px]"></div>
                  <p className="text-[#1e293b] text-sm sm:text-base md:text-lg font-medium leading-relaxed line-clamp-3 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                    "{gameData.answer}"
                  </p>
                </div>
              </div>

              {/* Answer chunks section */}
              {gameData?.answer_in_chunks?.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
                    <span className="font-semibold text-[#1e293b] text-sm sm:text-base font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                      Answer Breakdown
                    </span>
                    <span className="text-xs sm:text-sm text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                      ({gameData.answer_in_chunks.length} parts)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {gameData.answer_in_chunks.map((chunk, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 p-3 bg-[#ffffff] rounded-[12px] border border-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 group"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-[#ffffff] rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold group-hover:scale-105 transition-transform duration-200">
                          {i + 1}
                        </div>
                        <span className="text-[#1e293b] font-medium text-xs sm:text-sm line-clamp-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
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
        <DialogFooter className="relative pt-4 sm:pt-5 md:pt-6 border-t border-[#e2e8f0] px-4 sm:px-5 md:px-6">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              className="group border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#e2e8f0] text-[#475569] w-full sm:w-auto transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] rounded-[8px] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
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


<Dialog
  open={isOpen && dialogType === 'delete-game'}
  onOpenChange={() => dispatch(closeModal())}
>
  <form onSubmit={() => deleteGameMutation.mutate()}>
    <DialogContent className="sm:max-w-[500px] mx-4 rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border-0 bg-[#ffffff] overflow-hidden">
      <DialogHeader className="p-6 pb-4">
        <DialogTitle className="text-2xl font-bold text-[#1e293b] flex items-center gap-3 mb-4 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          <div className="p-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-[12px]">
            <svg className="h-6 w-6 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          Delete Game
        </DialogTitle>

        <DialogDescription className="space-y-4">
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-l-4 border-[#f59e0b] rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-[#ffffff] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-lg font-bold text-[#ffffff] mb-1 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                  Are you sure you want to delete this game?
                </p>
                <p className="text-sm text-[#ffffff] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                  This action cannot be undone and will permanently remove all game data.
                </p>
              </div>
            </div>
          </div>

          {/* Game Details Card */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[12px] p-4 shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-[#2563eb] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1e293b] mb-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                  Game Question:
                </p>
                <p className="text-[#1e293b] break-words leading-relaxed bg-[#ffffff] p-3 rounded-[12px] border border-[#e2e8f0] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                  "{modalData?.gameDetails?.question}"
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          {showInput && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] border-2 border-[#ef4444] rounded-[12px] p-4">
                <Label
                  htmlFor="deleteInput"
                  className="text-[#ffffff] font-semibold mb-3 block font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
                >
                  Type <span className="font-mono bg-[#dc2626] px-2 py-1 rounded text-[#ffffff] font-bold">delete</span> to confirm
                </Label>
                <Input
                  id="deleteInput"
                  type="text"
                  placeholder="Type 'delete' here..."
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-[8px] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/20 transition-all duration-200 bg-[#ffffff] text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
                />
              </div>
            </div>
          )}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="px-6 py-4 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] border-t border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-end">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(closeModal())}
              className="order-2 sm:order-1 w-full sm:w-auto px-6 py-2.5 border-2 border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#e2e8f0] transition-all duration-200 rounded-[8px] font-semibold text-[#475569] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            type={inputValue === 'delete' ? 'submit' : ''}
            variant="destructive"
            disabled={
              (showInput && inputValue !== 'delete') ||
              deleteGameMutation.status === 'pending'
            }
            onClick={() => {
              inputValue === 'delete'
                ? deleteGameMutation.mutate()
                : setShowInput((prev) => !prev)
            }}
            className="order-1 sm:order-2 w-full sm:w-auto min-w-[140px] px-6 py-2.5 bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-[#ffffff] font-semibold rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-[0_4px_6px_rgba(0,0,0,0.05)] disabled:bg-[#e2e8f0] disabled:text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          >
            {deleteGameMutation.status === 'pending' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            ) : (
              <>
                {showInput && inputValue !== 'delete' ? 'Delete Game' : 
                 !showInput ? 'Delete Game' : 'Confirm Delete'}
              </>
            )}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>

<Dialog
  open={
    isOpen &&
    (dialogType === 'confirm-delete-blog-category' ||
      dialogType === 'alert-course-category-delete' ||
      dialogType === 'confirm-game-delete-category')
  }
  onOpenChange={() => {
    console.log('Dialog onOpenChange triggered');
    dispatch(closeModal());
  }}
>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      console.log('Form submitted, calling handleSubmitDeleteCategory');
      if (typeof handleSubmitDeleteCategory === 'function') {
        handleSubmitDeleteCategory(e);
      } else {
        console.error('handleSubmitDeleteCategory is undefined');
      }
    }}
  >
    <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[425px] relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      {/* Glow effect wrapper */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-[12px] blur-lg opacity-30 animate-pulse pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative bg-[#ffffff] border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <DialogHeader className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              Delete Category
            </DialogTitle>
          </div>

          <DialogDescription className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {/* Warning icon */}
            <div className="text-center">
              <div className="mx-auto w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* Warning text */}
            <div className="text-center space-y-1 sm:space-y-2">
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                Are you sure you want to delete this category?
              </span>
              <p className="text-[#64748b] text-xs sm:text-sm font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                This action cannot be undone.
              </p>
            </div>

            {/* Category details */}
            <div className="bg-[#ffffff] rounded-[12px] p-3 sm:p-4 border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="inline-block px-2 py-1 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-[#ffffff] text-xs sm:text-sm font-semibold rounded-full mb-1">
                    Category
                  </span>
                  <p className="text-[#1e293b] text-xs sm:text-sm font-medium line-clamp-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                    {modalData?.confirmQuestion || 'No category question available'}
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
                className="text-xs sm:text-sm font-semibold text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
              >
                Please type <span className="text-[#ef4444] font-bold">delete</span> to confirm
              </Label>
              <div className="relative">
                <Input
                  id="deleteInput"
                  type="text"
                  placeholder="delete"
                  value={inputValue || ''}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  className="border border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 bg-[#ffffff] rounded-[8px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
                />
                {inputValue === 'delete' && (
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
                  </div>
                )}
                <div className="text-xs text-[#64748b] mt-1 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
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
              disabled={deleteBlogCategoryMutation.status === 'pending'}
              onClick={() => {
                dispatch(closeModal());
              }}
              className="w-full sm:w-auto border border-[#e2e8f0] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            >
              Cancel
            </Button>
          </DialogClose>

          {(dialogType === 'confirm-delete-blog-category' || dialogType === 'confirm-game-delete-category') && (
            <Button
              size="sm"
              type="button"
              variant="destructive"
              disabled={deleteBlogCategoryMutation.status === 'pending' || (showInput && inputValue !== 'delete')}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!showInput) {
                  setShowInput(true);
                } else if (inputValue === 'delete') {
                  handleSubmitDeleteCategory(e);
                }
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-[#ffffff] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-[#ef4444]/20 transition-all duration-200 disabled:bg-[#e2e8f0] disabled:text-[#64748b] disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </Button>
          )}
        </DialogFooter>
      </div>
    </DialogContent>
  </form>
</Dialog>

<Dialog
  open={
    isOpen &&
    (dialogType === "add-blog-category-modal" ||
      dialogType === "add-course-category" ||
      dialogType === "add-game-category")
  }
  onOpenChange={() => dispatch(closeModal())}
>
  <form onSubmit={handleSubmitAddCategory}>
    <DialogContent className="sm:max-w-[480px] w-full mx-4 rounded-[12px] overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.05)] border-0 bg-[#ffffff]">
      {/* Decorative Header Background */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] opacity-10"></div>

      <DialogHeader className="relative pt-8 pb-6 px-6">
        <DialogTitle className="flex items-center gap-4 text-2xl font-bold text-[#1e293b] mb-3 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          <div className="p-3 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[12px]">
            {dialogType === "add-blog-category-modal" ? (
              <svg className="h-7 w-7 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            ) : dialogType === "add-course-category" ? (
              <svg className="h-7 w-7 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ) : (
              <svg className="h-7 w-7 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1e293b] to-[#64748b] bg-clip-text text-transparent">
              Add New Category
            </h2>
            <p className="text-sm font-normal text-[#64748b] mt-1 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              {dialogType === "add-blog-category-modal" ? "Blog Category" : 
               dialogType === "add-course-category" ? "Course Category" : "Game Category"}
            </p>
          </div>
        </DialogTitle>

        <DialogDescription className="text-[#64748b] leading-relaxed font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-[12px] p-4 border border-[#e2e8f0]">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-[#2563eb] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-[#1e293b] mb-1 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                  Create a meaningful category name
                </p>
                <p className="text-sm text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                  Choose a clear, descriptive name that will help organize your content effectively.
                </p>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 pb-6">
        <div className="space-y-3">
          <label
            htmlFor="categoryName"
            className="block text-sm font-semibold text-[#1e293b] mb-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          >
            Category Name
          </label>
          <div className="relative">
            <Input
              id="categoryName"
              type="text"
              placeholder="Enter a descriptive category name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-[8px] border-2 border-[#e2e8f0] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/20 transition-all duration-200 bg-[#f1f5f9] focus:bg-[#ffffff] text-[#1e293b] placeholder-[#94a3b8] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <span className={`transition-colors duration-200 ${inputValue?.length > 0 ? 'text-[#10b981]' : 'text-[#94a3b8]'}`}>
              {inputValue?.length > 0 ? '✓ Category name provided' : 'Category name is required'}
            </span>
            <span className="text-[#64748b]">
              {inputValue?.length}/50
            </span>
          </div>
        </div>
      </div>

      <DialogFooter className="px-6 py-5 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] border-t border-[#e2e8f0]">
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:justify-end">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto px-6 py-2.5 border-2 border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#e2e8f0] transition-all duration-200 rounded-[8px] font-semibold text-[#475569] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
              disabled={addCategoryMutation.status === "pending"}
              onClick={() => dispatch(closeModal())}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            type="submit"
            className="w-full sm:w-auto min-w-[140px] px-6 py-2.5 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-[#ffffff] font-semibold rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-[0_4px_6px_rgba(0,0,0,0.05)] disabled:from-[#e2e8f0] disabled:to-[#e2e8f0] disabled:text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            onClick={(e) => { handleSubmitAddCategory(e) }}
            disabled={addCategoryMutation.status === "pending" || !inputValue}
          >
            {addCategoryMutation.status === "pending" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </span>
            )}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>

<Dialog
      open={isOpen && ['blog-category-view-modal', 'course-category-view-modal', 'view-game-category-modal'].includes(dialogType)}
      onOpenChange={() => dispatch(closeModal())}
      modal
    >
      <DialogContent className="sm:max-w-lg w-full mx-2 rounded-lg overflow-hidden shadow-sm border-0 bg-white">
        <DialogHeader className="pt-6 pb-4 px-6">
          <DialogTitle className="flex items-start gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-sm">
              {getCategoryIcon()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-sans">
                {blogCategoryData?.name || 'Category Details'}
              </h2>
              <p className="text-slate-600 text-base font-sans">{getCategoryTitle()}</p>
            </div>
            {blogCategoryData && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full shadow-sm border transition-all duration-200 ${
                  blogCategoryData?.active
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-500'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${blogCategoryData?.active ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                {blogCategoryData?.active ? 'Active' : 'Inactive'}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-sans">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
              <div className="flex items-start gap-2">
                <svg className="h-4 w-4 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-slate-800 font-medium font-sans">View details and stats for this category</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {blogCategoryIsError && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 border border-slate-200">
              <div className="flex items-start gap-2">
                <svg className="h-4 w-4 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-white font-sans">Error Loading Category</p>
                  <p className="text-white text-sm mt-1 font-sans">{blogCategoryError.message}</p>
                </div>
              </div>
            </div>
          )}

          {blogCategoryFetchStatus === 'paused' && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 border border-slate-200">
              <div className="flex items-start gap-2">
                <svg className="h-4 w-4 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-semibold text-white font-sans">Connection Issue</p>
                  <p className="text-white text-sm mt-1 font-sans">No internet connection available</p>
                </div>
              </div>
            </div>
          )}

          {(blogCategoryFetchStatus === 'fetching' || blogCategoryIsFetching || (!blogCategoryData && blogCategoryFetchStatus !== 'paused')) && !blogCategoryIsError ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Skeleton className="h-5 w-24 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
                <Skeleton className="h-20 w-full rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              </div>
            </div>
          ) : (
            blogCategoryData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Date Information Card */}
                  <div className="group p-4 rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-base font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300 font-sans">
                          Timeline Information
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <p className="text-sm text-slate-600 font-sans">
                              <span className="font-medium text-slate-800">Created:</span>{' '}
                              {format(new Date(blogCategoryData.createdAt), 'PPP HH:mm:ss')}
                            </p>
                          </div>
                          {blogCategoryData?.updatedAt && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              <p className="text-sm text-slate-600 font-sans">
                                <span className="font-medium text-slate-800">Updated:</span>{' '}
                                {format(new Date(blogCategoryData.updatedAt), 'PPP HH:mm:ss')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Statistics Card */}
                  <div className="group p-4 rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg group-hover:from-blue-700 group-hover:to-blue-900 transition-all duration-300">
                          {getCategoryIcon()}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 font-sans">
                            Content Statistics
                          </h3>
                          <p className="text-sm text-slate-600 font-sans">
                            <span className="font-medium text-slate-800">
                              Total {dialogType.includes('game') ? 'Games' : dialogType.includes('course') ? 'Courses' : 'Blogs'} in Category
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-sans">
                          {blogCategoryData?.total || 0}
                        </div>
                        <div className="text-sm text-slate-600 font-sans">Items</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(closeModal())}
              className="px-6 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 font-sans"
              aria-label="Close modal"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>


<Dialog
  open={
    isOpen &&
    (dialogType === "edit-category-modal" ||
      dialogType === "course-category-edit-modal" ||
      dialogType === "game-category-edit-modal")
  }
  onOpenChange={() => dispatch(closeModal())}
>
  <form onSubmit={handleSubmitEditCategory}>
    <DialogContent className="sm:max-w-md w-full rounded-[12px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] bg-[#ffffff] border border-[#e2e8f0]">
      {/* Header */}
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-lg font-semibold text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          Edit Category
        </DialogTitle>
        <DialogDescription className="text-sm text-[#64748b] leading-relaxed font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          Update the category name and save your changes.
        </DialogDescription>
      </DialogHeader>

      {/* Input */}
      <div className="mt-4 space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          Category Name
        </Label>
        <Input
          id="category"
          value={inputValue}
          placeholder="Enter category name..."
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full rounded-[8px] border border-[#e2e8f0] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20 bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
        />
      </div>

      {/* Footer */}
      <DialogFooter className="mt-6 flex justify-end space-x-3">
        <DialogClose asChild>
          <Button
            size="sm"
            variant="outline"
            className="rounded-[8px] border border-[#e2e8f0] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            disabled={editCategoryMutation.status === "pending"}
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          size="sm"
          type="submit"
          className="rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          onClick={handleSubmitEditCategory}
          disabled={editCategoryMutation.status === "pending" || !inputValue}
        >
          {editCategoryMutation.status === "pending" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>

<Dialog
  open={
    isOpen &&
    (dialogType === "delete-blog-category" ||
      dialogType === "course-category-delete-modal" ||
      dialogType === "game-category-delete-modal")
  }
  onOpenChange={() => dispatch(closeModal())}
>
  <form onSubmit={handleSubmitCategory}>
    <DialogContent className="sm:max-w-md w-full rounded-[12px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] bg-[#ffffff] border border-[#e2e8f0]">
      {/* Header */}
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-lg font-semibold text-[#dc2626] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          Delete Category
        </DialogTitle>
        <DialogDescription className="text-sm text-[#64748b] leading-relaxed font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          <span className="font-semibold text-[#1e293b]">
            Are you sure you want to delete this{" "}
            {dialogType === "delete-blog-category"
              ? "blog"
              : dialogType === "course-category-delete-modal"
              ? "course"
              : dialogType === "game-category-delete-modal"
              ? "game"
              : ""}{" "}
            category?
          </span>
          <br />
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      {/* Input confirmation */}
      {showInput && (
        <div className="mt-4 space-y-2">
          <Label
            htmlFor="deleteInput"
            className="text-sm font-medium text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          >
            Please type <span className="font-bold text-[#dc2626]">delete</span> to confirm
          </Label>
          <div className="relative">
            <Input
              id="deleteInput"
              type="text"
              placeholder="delete"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-[8px] border border-[#e2e8f0] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20 bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            />
            {inputValue === "delete" && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <DialogFooter className="mt-6 flex justify-end space-x-3">
        <DialogClose asChild>
          <Button
            size="sm"
            variant="outline"
            className="rounded-[8px] border border-[#e2e8f0] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            disabled={deleteBlogCategoryFirstMutation.status === "pending"}
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          size="sm"
          type={inputValue === "delete" ? "submit" : "button"}
          variant="destructive"
          className="rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          disabled={
            deleteBlogCategoryFirstMutation.status === "pending" ||
            (showInput && inputValue !== "delete")
          }
          onClick={(e) => {
            if (inputValue === "delete") {
              handleSubmitCategory(e);
            } else {
              setShowInput(true);
            }
          }}
        >
          {deleteBlogCategoryFirstMutation.status === "pending" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>

<Dialog
  open={isOpen && dialogType === "view-student-details"}
  onOpenChange={() => dispatch(closeModal())}
>
  <DialogContent className="max-w-3xl rounded-[12px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] bg-[#ffffff] border border-[#e2e8f0]">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
        {studentFetchStatus === "fetching" ? (
          <Skeleton className="h-6 w-48 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
        ) : (
          `Student Details: ${studentData?.firstName + " " + studentData?.lastName}`
        )}
      </DialogTitle>
    </DialogHeader>

    {studentFetchStatus === "fetching" ? (
      // Skeleton Loader
      <div className="space-y-6">
        {/* Student Info Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-64 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
          <Skeleton className="h-4 w-52 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
          <Skeleton className="h-4 w-72 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
        </div>

        {/* Enrolled Courses Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
            <Skeleton className="h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
            <Skeleton className="h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
          </div>
        </div>

        {/* Subscription Info Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-60 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
          <Skeleton className="h-4 w-40 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
          <Skeleton className="h-4 w-52 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]" />
        </div>
      </div>
    ) : (
      // Actual Student Data
      <>
        {/* Student Info */}
        <div className="mb-4 space-y-2">
          <p className="text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <strong className="font-semibold">Email:</strong> {studentData?.email}
          </p>
          <p className="text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <strong className="font-semibold">Phone:</strong> {studentData?.phone}
          </p>
          <p className="text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <strong className="font-semibold">Bio:</strong> {studentData?.bio}
          </p>
        </div>

        {/* Enrolled Courses Table */}
        <div className="mb-4 max-h-64 overflow-y-auto">
          <div className="flex justify-between">
            <h3 className="font-semibold text-[#1e293b] mb-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              Existing Enrolled Courses {studentData?.enrolledCourses?.length ?? 0}
            </h3>
            <h3 className="text-[#1e293b] mb-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              Total Enrolled Courses {studentData?.totalEnrolled ?? 0}
            </h3>
          </div>
          {studentData?.enrolledCourses && studentData?.enrolledCourses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#e2e8f0]">
                  <TableHead className="text-[#1e293b] font-semibold font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                    Course Name
                  </TableHead>
                  <TableHead className="text-[#1e293b] font-semibold font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                    Enrolled At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData?.enrolledCourses.map((course, idx) => (
                  <TableRow key={idx} className="border-[#e2e8f0] hover:bg-[#f1f5f9]">
                    <TableCell className="text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                      {course.name}
                    </TableCell>
                    <TableCell className="text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
                      {course.updatedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
              No existing courses enrolled yet
            </p>
          )}
        </div>

        {/* Subscription Info */}
        <div className="mb-4 space-y-2">
          <p className="text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <strong className="font-semibold">Subscription PriceID:</strong>{" "}
            {studentData?.subscriptionPriceId}
          </p>
          <p className="text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <strong className="font-semibold">Status:</strong>{" "}
            {studentData?.subscriptionStatus}
          </p>
          <p className="text-sm text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <strong className="font-semibold">Plan Active:</strong>{" "}
            {studentData?.planActive ? "Yes" : "No"}
          </p>
        </div>
      </>
    )}
    <DialogFooter className="mt-6 flex justify-end">
      <DialogClose asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-[8px] border border-[#e2e8f0] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          onClick={() => dispatch(closeModal())}
        >
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={isOpen && dialogType === "delete-blog"} onOpenChange={() => dispatch(closeModal())}>
  <form onSubmit={handleSubmitBlogDeletion}>
    <DialogContent className="sm:max-w-[425px] rounded-[12px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] bg-[#ffffff] border border-[#e2e8f0]">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-[#dc2626] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          Delete Blog
        </DialogTitle>
        <DialogDescription className="text-sm text-[#64748b] leading-relaxed font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
          <span className="text-xl font-bold text-[#1e293b]">
            Are you sure you want to delete this blog?
          </span>
          <br />
          This action cannot be undone.
        </DialogDescription>

        {showInput && (
          <div className="mt-4 space-y-2">
            <Label
              htmlFor="deleteInput"
              className="text-sm font-medium text-[#1e293b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            >
              Please type <span className="font-bold text-[#dc2626]">delete</span> to confirm
            </Label>
            <div className="relative">
              <Input
                id="deleteInput"
                type="text"
                placeholder="delete"
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-[8px] border border-[#e2e8f0] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20 bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
              />
              {inputValue === "delete" && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                </div>
              )}
            </div>
          </div>
        )}
      </DialogHeader>

      <DialogFooter className="mt-6 flex justify-end space-x-3">
        <DialogClose asChild>
          <Button
            size="sm"
            variant="outline"
            className="rounded-[8px] border border-[#e2e8f0] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transition-all duration-200 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
            disabled={deleteBlogMutation.isPending}
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          size="sm"
          type={inputValue === "delete" ? "submit" : "button"}
          variant="destructive"
          className="rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          disabled={deleteBlogMutation.isPending || (showInput && inputValue !== "delete")}
          onClick={(e) => {
            if (inputValue === "delete") {
              handleSubmitBlogDeletion(e);
            } else {
              setShowInput((prev) => !prev);
            }
          }}
        >
          {deleteBlogMutation.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>
    </>
  )
}

export default DialogWrapper
