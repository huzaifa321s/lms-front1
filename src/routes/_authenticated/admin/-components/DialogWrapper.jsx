import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  Info,
  Layers,
  Loader2,
  MessageSquare,
  Newspaper,
  Plus,
  Puzzle,
  Tag,
  Target,
  Trash2,
  Wifi,
  X,
} from 'lucide-react'
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  closeModalAdmin,
  openModalAdmin,
} from '../../../../shared/config/reducers/admin/DialogSlice'
import { blogsQueryOptions } from '../blogs/index.lazy'
import { blogCategoryQueryOptions } from '../settings'
import { courseCategoryQueryOptions } from '../settings/course-category'
import { gameCategoryQueryOptions } from '../settings/game-category'
import { gamesQueryOptions } from '../trainingwheelgame'

const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState(modalData?.inputValue)
  const queryClient = useQueryClient()
  const { router, dispatch, navigate } = useAppUtils()
  const [dialogType, setDialogType] = useState(modalType)
  useEffect(() => {
    if (modalData?.inputValue !== undefined) {
      setInputValue(modalData.inputValue)
    }
    setDialogType(modalType)
  }, [modalData?.inputValue, modalType])
  
  const getCategoryIcon = () => {
    if (dialogType.includes('blog')) {
      return (
        <svg
          className='h-6 w-6 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
          />
        </svg>
      )
    } else if (dialogType.includes('course')) {
      return (
        <svg
          className='h-6 w-6 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
          />
        </svg>
      )
    }
    return (
      <svg
        className='h-6 w-6 text-white'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
        />
      </svg>
    )
  }

  // Title and description based on dialog type
  const getCategoryTitle = () => {
    if (dialogType.includes('blog')) return 'Blog Category Overview'
    if (dialogType.includes('course')) return 'Course Category Overview'
    return 'Game Category Overview'
  }
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
        console.log('dialogType ===>', dialogType)
        let response = await axios.get(
          `/admin/${dialogType === 'blog-category-view-modal' ? 'blog-category' : dialogType === 'course-category-view-modal' ? 'course-category' : dialogType === 'view-game-category-modal' ? 'game-category' : ''}/getCategory/${modalData?.categoryID}`
        )
        console.log('response ===>', response)
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

  console.log('blogCategoryData ===>', blogCategoryData)

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

          dispatch(closeModalAdmin())
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

        dispatch(closeModalAdmin())
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
          if (
            dialogType === 'delete-blog-category' ||
            dialogType === 'confirm-delete-blog-category'
          ) {
            await queryClient.invalidateQueries(
              blogCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
            )
          } else if (dialogType === 'course-category-delete-modal') {
            await queryClient.invalidateQueries(
              courseCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
            )
          } else if (
            dialogType === 'game-category-delete-modal' ||
            dialogType === 'confirm-game-delete-category'
          ) {
            await queryClient.invalidateQueries(
              gameCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
            )
          }

          dispatch(closeModalAdmin())
        } else {
          console.log('response?.message ===>', response?.message)
          if (
            response?.message === 'This category contains some blogs' ||
            response?.message ===
              'This category contains courses, so cannot be deleted!' ||
            response?.message === 'This category contains some games'
          ) {
            dispatch(
              openModalAdmin({
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
      openModalAdmin,

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
      let response = await axios.delete(
        `/admin/blog/delete/${modalData?.blogID}`
      )
      response = response.data
      if (response.success) {
        toast.success('Blog deleted successfully')
        await queryClient.invalidateQueries({
          ...blogsQueryOptions({ q: '', page: 1, suspense: false }),
        }).queryKey
        if (modalData?.redirect) {
          navigate({ to: modalData.redirect })
        }
        dispatch(closeModalAdmin())
      }
    } catch (error) {
      console.log('Registration Error -> ', error)
      toast.error('Internal server error')
    }
  }, [modalData?.blogID, toast, queryClient, blogsQueryOptions, axios])
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
            console.log('dialogType condition', dialogType)
            await queryClient.invalidateQueries(
              blogCategoryQueryOptions({ q: modalData?.searchInput }).queryKey
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
          dispatch(closeModalAdmin())
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
      closeModalAdmin,
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
    mutationFn: deleteBlog,
  })

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
        console.log('modalData?.studentID ===>', modalData?.studentID)
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
    enabled: dialogType === 'view-student-details',
  })

  return (
    <>
 

      {dialogType === 'delete-game' && (
        <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
          <form onSubmit={() => deleteGameMutation.mutate()}>
            <DialogContent className='bg-card text-card-foreground mx-4 overflow-hidden rounded-lg border shadow-lg sm:max-w-[500px]'>
              <DialogHeader className='border-b p-6'>
                <DialogTitle className='flex items-center gap-3 text-2xl font-bold'>
                  <div className='bg-destructive/10 text-destructive rounded-md p-3'>
                    <Trash2 className='h-6 w-6' />
                  </div>
                  Delete Game
                </DialogTitle>
              </DialogHeader>

              <div className='space-y-6 p-6'>
                {/* Warning Banner */}
                <div className='rounded-lg border border-yellow-300 bg-yellow-100 p-4 text-yellow-800'>
                  <div className='flex items-start gap-3'>
                    <AlertTriangle className='mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div>
                      <p className='mb-1 text-lg font-bold'>
                        Are you sure you want to delete this game?
                      </p>
                      <p className='text-sm'>
                        This action cannot be undone and will permanently remove
                        all game data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Game Details Card */}
                <div className='bg-muted/30 rounded-lg border p-4'>
                  <div className='flex items-start gap-3'>
                    <Info className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <p className='mb-2 font-semibold'>Game Question:</p>
                      <p className='bg-background rounded-lg border p-3 leading-relaxed break-words'>
                        "{modalData?.gameDetails?.question}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Input */}
                {showInput && (
                  <div className='animate-in slide-in-from-top-2 duration-300'>
                    <div className='bg-destructive/10 border-destructive rounded-lg border p-4'>
                      <Label
                        htmlFor='deleteInput'
                        className='text-destructive mb-3 block font-semibold'
                      >
                        Type{' '}
                        <span className='bg-destructive/20 text-destructive rounded px-2 py-1 font-mono'>
                          delete
                        </span>{' '}
                        to confirm
                      </Label>
                      <Input
                        id='deleteInput'
                        type='text'
                        placeholder="Type 'delete' here..."
                        onChange={(e) => setInputValue(e.target.value)}
                        className='w-full'
                      />
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className='bg-muted/30 border-t p-6'>
                <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end'>
                  <DialogClose asChild>
                    <Button
                      variant='outline'
                      onClick={() => dispatch(closeModalAdmin())}
                      className='order-2 w-full sm:order-1 sm:w-auto'
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type={inputValue === 'delete' ? 'submit' : 'button'}
                    variant='destructive'
                    disabled={
                      (showInput && inputValue !== 'delete') ||
                      deleteGameMutation.status === 'pending'
                    }
                    onClick={() => {
                      if (showInput && inputValue === 'delete') {
                        deleteGameMutation.mutate()
                      } else {
                        setShowInput((prev) => !prev)
                      }
                    }}
                    loading={deleteGameMutation.status === 'pending'}
                    className='order-1 w-full min-w-[140px] sm:order-2 sm:w-auto'
                  >
                    {deleteGameMutation.status === 'pending' ? (
                      <span className='flex items-center gap-2'>
                        Deleting...
                      </span>
                    ) : (
                      <>
                        {!showInput
                          ? 'Delete Game'
                          : inputValue === 'delete'
                            ? 'Confirm Delete'
                            : 'Delete Game'}
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      )}

      {(dialogType === 'confirm-delete-blog-category' ||
        dialogType === 'alert-course-category-delete' ||
        dialogType === 'confirm-game-delete-category') && (
        <Dialog
          open
          onOpenChange={() => {
            console.log('Dialog onOpenChange triggered')
            dispatch(closeModalAdmin())
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              console.log('Form submitted, calling handleSubmitDeleteCategory')
              if (typeof handleSubmitDeleteCategory === 'function') {
                handleSubmitDeleteCategory(e)
              } else {
                console.error('handleSubmitDeleteCategory is undefined')
              }
            }}
          >
            <DialogContent className='bg-card text-card-foreground overflow-hidden rounded-lg border shadow-lg sm:max-w-[425px]'>
              <DialogHeader className='border-b p-6'>
                <div className='flex items-center space-x-3'>
                  <div className='bg-destructive/10 text-destructive rounded-md p-2'>
                    <AlertTriangle className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <DialogTitle className='text-lg leading-tight font-semibold'>
                    Delete Category
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className='space-y-4 p-6'>
                {/* Warning icon */}
                <div className='text-center'>
                  <div className='bg-destructive/10 text-destructive border-destructive mx-auto flex h-16 w-16 items-center justify-center rounded-full border'>
                    <Trash2 className='h-8 w-8' />
                  </div>
                </div>

                {/* Warning text */}
                <div className='space-y-2 text-center'>
                  <span className='text-base font-semibold'>
                    Are you sure you want to delete this category?
                  </span>
                  <p className='text-muted-foreground text-sm'>
                    This action cannot be undone.
                  </p>
                </div>

                {/* Category details */}
                <div className='bg-muted/30 rounded-lg border p-4'>
                  <div className='space-y-3'>
                    <div>
                      <Badge className='mb-2'>Category</Badge>
                      <p className='line-clamp-2 text-sm font-medium'>
                        {modalData?.confirmQuestion ||
                          'No category question available'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input area */}
                {showInput && (
                  <div className='animate-in slide-in-from-top flex flex-col gap-3 duration-300'>
                    <Label
                      htmlFor='deleteInput'
                      className='text-sm font-semibold'
                    >
                      Please type{' '}
                      <span className='text-destructive font-bold'>delete</span>{' '}
                      to confirm
                    </Label>
                    <div className='relative'>
                      <Input
                        id='deleteInput'
                        type='text'
                        placeholder='delete'
                        value={inputValue || ''}
                        onChange={(e) => {
                          setInputValue(e.target.value)
                        }}
                        className='w-full'
                      />
                      {inputValue === 'delete' && (
                        <div className='absolute top-1/2 right-3 -translate-y-1/2 text-green-500'>
                          <CheckCircle2 className='h-5 w-5' />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className='flex flex-col gap-3 p-6 pt-0 sm:flex-row'>
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    disabled={deleteBlogCategoryMutation.status === 'pending'}
                    onClick={() => {
                      dispatch(closeModalAdmin())
                    }}
                    className='w-full sm:w-auto'
                  >
                    Cancel
                  </Button>
                </DialogClose>

                {(dialogType === 'confirm-delete-blog-category' ||
                  dialogType === 'confirm-game-delete-category') && (
                  <Button
                    type='button'
                    variant='destructive'
                    disabled={
                      deleteBlogCategoryMutation.status === 'pending' ||
                      (showInput && inputValue !== 'delete')
                    }
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!showInput) {
                        setShowInput(true)
                      } else if (inputValue === 'delete') {
                        handleSubmitDeleteCategory(e)
                      }
                    }}
                    className='flex w-full items-center justify-center space-x-2 sm:w-auto'
                  >
                    {deleteBlogCategoryMutation.status === 'pending' ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className='h-4 w-4' />
                        <span>Delete</span>
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      )}
      {(dialogType === 'add-blog-category-modal' ||
        dialogType === 'add-course-category' ||
        dialogType === 'add-game-category') && (
        <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
          <form onSubmit={handleSubmitAddCategory}>
            <DialogContent className='bg-card text-card-foreground w-full overflow-hidden rounded-lg border shadow-lg sm:max-w-[480px]'>
              <DialogHeader className='relative border-b p-6'>
                <div className='flex items-center gap-4'>
                  <div className='bg-primary/10 text-primary rounded-md p-3'>
                    {dialogType === 'add-blog-category-modal' ? (
                      <Newspaper className='h-7 w-7' />
                    ) : dialogType === 'add-course-category' ? (
                      <BookOpen className='h-7 w-7' />
                    ) : (
                      <Gamepad2 className='h-7 w-7' />
                    )}
                  </div>
                  <div>
                    <DialogTitle className='text-2xl font-bold'>
                      Add New Category
                    </DialogTitle>
                    <p className='text-muted-foreground mt-1 text-sm font-normal'>
                      {dialogType === 'add-blog-category-modal'
                        ? 'Blog Category'
                        : dialogType === 'add-course-category'
                          ? 'Course Category'
                          : 'Game Category'}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className='space-y-4 p-6'>
                <DialogDescription className='text-muted-foreground leading-relaxed'>
                  <div className='bg-muted/30 rounded-lg border p-4'>
                    <div className='flex items-start gap-3'>
                      <Info className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
                      <div>
                        <p className='text-foreground mb-1 font-semibold'>
                          Create a meaningful category name
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          Choose a clear, descriptive name that will help
                          organize your content effectively.
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogDescription>

                <div className='space-y-3'>
                  <Label
                    htmlFor='categoryName'
                    className='text-foreground mb-2 block text-sm font-semibold'
                  >
                    Category Name
                  </Label>
                  <div className='relative'>
                    <Input
                      id='categoryName'
                      type='text'
                      placeholder='Enter a descriptive category name...'
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className='h-12 w-full pr-12'
                    />
                    <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                      <Tag className='h-5 w-5' />
                    </div>
                  </div>
                  <div className='flex items-center justify-between text-xs'>
                    <span
                      className={`transition-colors duration-200 ${inputValue?.length > 0 ? 'text-green-500' : 'text-destructive'}`}
                    >
                      {inputValue?.length > 0
                        ? '✓ Category name provided'
                        : 'Category name is required'}
                    </span>
                    <span className='text-muted-foreground'>
                      {inputValue?.length}/50
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className='bg-muted/30 border-t px-6 py-5'>
                <div className='flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                  <DialogClose asChild>
                    <Button
                      variant='outline'
                      className='w-full sm:w-auto'
                      disabled={addCategoryMutation.status === 'pending'}
                      onClick={() => dispatch(closeModalAdmin())}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type='submit'
                    loading={addCategoryMutation.status === 'pending'}
                    className='w-full min-w-[140px] sm:w-auto'
                    onClick={(e) => {
                      handleSubmitAddCategory(e)
                    }}
                    disabled={
                      addCategoryMutation.status === 'pending' || !inputValue
                    }
                  >
                    {addCategoryMutation.status === 'pending' ? (
                      <span className='flex items-center gap-2'>
                        Creating...
                      </span>
                    ) : (
                      <span className='flex items-center gap-2'>
                        <Plus className='h-4 w-4' />
                        Add Category
                      </span>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      )}
      {[
        'blog-category-view-modal',
        'course-category-view-modal',
        'view-game-category-modal',
      ].includes(dialogType) && (
        <Dialog open onOpenChange={() => dispatch(closeModalAdmin())} modal>
          <DialogContent className='mx-2 w-full rounded-lg sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle className='mb-3 flex items-start gap-3'>
                <div className='rounded-lg p-3'>{getCategoryIcon()}</div>
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold'>
                    {blogCategoryData?.name || 'Category Details'}
                  </h2>
                  <p className='text-muted-foreground'>{getCategoryTitle()}</p>
                </div>
                {blogCategoryData && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                      blogCategoryData?.active
                        ? 'border-green-200 bg-green-100 text-green-800'
                        : 'border-red-200 bg-red-100 text-red-800'
                    }`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        blogCategoryData?.active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                    {blogCategoryData?.active ? 'Active' : 'Inactive'}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                View details and stats for this category
              </DialogDescription>
            </DialogHeader>

            <div>
              {blogCategoryIsError && (
                <div className='mb-4 rounded-lg border border-red-200 bg-red-100 p-3 text-red-800'>
                  <p className='font-semibold'>Error Loading Category</p>
                  <p className='mt-1 text-sm'>{blogCategoryError.message}</p>
                </div>
              )}

              {blogCategoryFetchStatus === 'paused' && (
                <div className='mb-4 rounded-lg border border-yellow-200 bg-yellow-100 p-3 text-yellow-800'>
                  <p className='font-semibold'>Connection Issue</p>
                  <p className='mt-1 text-sm'>
                    No internet connection available
                  </p>
                </div>
              )}

              {(blogCategoryFetchStatus === 'fetching' ||
                blogCategoryIsFetching ||
                (!blogCategoryData && blogCategoryFetchStatus !== 'paused')) &&
              !blogCategoryIsError ? (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4'>
                    <Skeleton className='h-5 w-24 rounded-md' />
                    <Skeleton className='h-20 w-full rounded-md' />
                  </div>
                </div>
              ) : (
                blogCategoryData && (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4'>
                      {/* Date Information Card */}
                      <div className='rounded-lg border p-4'>
                        <h3 className='text-base font-semibold'>
                          Timeline Information
                        </h3>
                        <div className='mt-2 space-y-1'>
                          <p className='text-muted-foreground text-sm'>
                            <span className='font-medium'>Created:</span>{' '}
                            {format(
                              new Date(blogCategoryData.createdAt),
                              'PPP HH:mm:ss'
                            )}
                          </p>
                          {blogCategoryData?.updatedAt && (
                            <p className='text-muted-foreground text-sm'>
                              <span className='font-medium'>Updated:</span>{' '}
                              {format(
                                new Date(blogCategoryData.updatedAt),
                                'PPP HH:mm:ss'
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Content Statistics Card */}
                      <div className='rounded-lg border p-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h3 className='text-base font-semibold'>
                              Content Statistics
                            </h3>
                            <p className='text-muted-foreground text-sm'>
                              Total{' '}
                              {dialogType.includes('game')
                                ? 'Games'
                                : dialogType.includes('course')
                                  ? 'Courses'
                                  : 'Blogs'}{' '}
                              in Category
                            </p>
                          </div>
                          <div className='text-right'>
                            <div className='text-3xl font-bold'>
                              {blogCategoryData?.total || 0}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              Items
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => dispatch(closeModalAdmin())}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {(dialogType === 'edit-category-modal' ||
        dialogType === 'course-category-edit-modal' ||
        dialogType === 'game-category-edit-modal') && (
        <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
          <form onSubmit={handleSubmitEditCategory}>
            <DialogContent className='w-full rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-md'>
              {/* Header */}
              <DialogHeader className='space-y-2'>
                <DialogTitle className='text-lg font-semibold text-[#1e293b]'>
                  Edit Category
                </DialogTitle>
                <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
                  Update the category name and save your changes.
                </DialogDescription>
              </DialogHeader>

              {/* Input */}
              <div className='mt-4 space-y-2'>
                <Label
                  htmlFor='category'
                  className='text-sm font-medium text-[#1e293b]'
                >
                  Category Name
                </Label>
                <Input
                  id='category'
                  value={inputValue}
                  placeholder='Enter category name...'
                  onChange={(e) => setInputValue(e.target.value)}
                  className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20'
                />
              </div>

              {/* Footer */}
              <DialogFooter className='mt-6 flex justify-end space-x-3'>
                <DialogClose asChild>
                  <Button
                    size='sm'
                    variant='outline'
                    className='rounded-[8px] border border-[#e2e8f0] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]'
                    disabled={editCategoryMutation.status === 'pending'}
                    onClick={() => dispatch(closeModalAdmin())}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  size='sm'
                  type='submit'
                  className='transform rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1d4ed8] hover:to-[#1e40af] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b]'
                  onClick={handleSubmitEditCategory}
                  disabled={
                    editCategoryMutation.status === 'pending' || !inputValue
                  }
                >
                  {editCategoryMutation.status === 'pending' ? (
                    <span className='flex items-center gap-2'>
                      <svg
                        className='h-4 w-4 animate-spin'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      )}

{ (dialogType === 'delete-blog-category' ||
            dialogType === 'course-category-delete-modal' ||
            dialogType === 'game-category-delete-modal') &&  <Dialog
        open
        onOpenChange={() => dispatch(closeModalAdmin())}
      >
        <form onSubmit={handleSubmitCategory}>
          <DialogContent className='w-full rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-md'>
            {/* Header */}
            <DialogHeader className='space-y-2'>
              <DialogTitle className='text-lg font-semibold text-[#dc2626]'>
                Delete Category
              </DialogTitle>
              <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
                <span className='font-semibold text-[#1e293b]'>
                  Are you sure you want to delete this{' '}
                  {dialogType === 'delete-blog-category'
                    ? 'blog'
                    : dialogType === 'course-category-delete-modal'
                      ? 'course'
                      : dialogType === 'game-category-delete-modal'
                        ? 'game'
                        : ''}{' '}
                  category?
                </span>
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {/* Input confirmation */}
            {showInput && (
              <div className='mt-4 space-y-2'>
                <Label
                  htmlFor='deleteInput'
                  className='text-sm font-medium text-[#1e293b]'
                >
                  Please type{' '}
                  <span className='font-bold text-[#dc2626]'>delete</span> to
                  confirm
                </Label>
                <div className='relative'>
                  <Input
                    id='deleteInput'
                    type='text'
                    placeholder='delete'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20'
                  />
                  {inputValue === 'delete' && (
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 transform'>
                      <CheckCircle2 className='h-4 w-4 text-[#059669]' />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <DialogFooter className='mt-6 flex justify-end space-x-3'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  className='rounded-[8px] border border-[#e2e8f0] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]'
                  disabled={
                    deleteBlogCategoryFirstMutation.status === 'pending'
                  }
                  onClick={() => dispatch(closeModalAdmin())}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                size='sm'
                type={inputValue === 'delete' ? 'submit' : 'button'}
                variant='destructive'
                className='transform rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#dc2626] hover:to-[#b91c1c] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b]'
                disabled={
                  deleteBlogCategoryFirstMutation.status === 'pending' ||
                  (showInput && inputValue !== 'delete')
                }
                onClick={(e) => {
                  if (inputValue === 'delete') {
                    handleSubmitCategory(e)
                  } else {
                    setShowInput(true)
                  }
                }}
              >
                {deleteBlogCategoryFirstMutation.status === 'pending' ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='h-4 w-4 animate-spin'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>}
     
{dialogType === 'view-student-details' &&    <Dialog
        open
        onOpenChange={() => dispatch(closeModalAdmin())}
      >
        <DialogContent className='max-w-3xl rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold text-[#1e293b]'>
              {studentFetchStatus === 'fetching' ? (
                <Skeleton className='h-6 w-48 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              ) : (
                `Student Details: ${studentData?.firstName + ' ' + studentData?.lastName}`
              )}
            </DialogTitle>
          </DialogHeader>

          {studentFetchStatus === 'fetching' ? (
            // Skeleton Loader
            <div className='space-y-6'>
              {/* Student Info Skeleton */}
              <div className='space-y-2'>
                <Skeleton className='h-4 w-64 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <Skeleton className='h-4 w-52 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <Skeleton className='h-4 w-72 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              </div>

              {/* Enrolled Courses Skeleton */}
              <div className='space-y-2'>
                <Skeleton className='h-5 w-40 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <div className='space-y-2'>
                  <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                  <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                  <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                </div>
              </div>

              {/* Subscription Info Skeleton */}
              <div className='space-y-2'>
                <Skeleton className='h-4 w-60 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <Skeleton className='h-4 w-40 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <Skeleton className='h-4 w-52 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              </div>
            </div>
          ) : (
            // Actual Student Data
            <>
              {/* Student Info */}
              <div className='mb-4 space-y-2'>
                <p className='text-sm text-[#1e293b]'>
                  <strong className='font-semibold'>Email:</strong>{' '}
                  {studentData?.email}
                </p>
                <p className='text-sm text-[#1e293b]'>
                  <strong className='font-semibold'>Phone:</strong>{' '}
                  {studentData?.phone}
                </p>
                <p className='text-sm text-[#1e293b]'>
                  <strong className='font-semibold'>Bio:</strong>{' '}
                  {studentData?.bio}
                </p>
              </div>

              {/* Enrolled Courses Table */}
              <div className='mb-4 max-h-64 overflow-y-auto'>
                <div className='flex justify-between'>
                  <h3 className='mb-2 font-semibold text-[#1e293b]'>
                    Existing Enrolled Courses{' '}
                    {studentData?.enrolledCourses?.length ?? 0}
                  </h3>
                  <h3 className='mb-2 text-[#1e293b]'>
                    Total Enrolled Courses {studentData?.totalEnrolled ?? 0}
                  </h3>
                </div>
                {studentData?.enrolledCourses &&
                studentData?.enrolledCourses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className='border-[#e2e8f0]'>
                        <TableHead className='font-semibold text-[#1e293b]'>
                          Course Name
                        </TableHead>
                        <TableHead className='font-semibold text-[#1e293b]'>
                          Enrolled At
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentData?.enrolledCourses.map((course, idx) => (
                        <TableRow
                          key={idx}
                          className='border-[#e2e8f0] hover:bg-[#f1f5f9]'
                        >
                          <TableCell className='text-[#1e293b]'>
                            {course.name}
                          </TableCell>
                          <TableCell className='text-[#64748b]'>
                            {course.updatedAt}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className='text-sm text-[#64748b]'>
                    No existing courses enrolled yet
                  </p>
                )}
              </div>

              {/* Subscription Info */}
              <div className='mb-4 space-y-2'>
                <p className='text-sm text-[#1e293b]'>
                  <strong className='font-semibold'>
                    Subscription PriceID:
                  </strong>{' '}
                  {studentData?.subscriptionPriceId}
                </p>
                <p className='text-sm text-[#1e293b]'>
                  <strong className='font-semibold'>Status:</strong>{' '}
                  {studentData?.subscriptionStatus}
                </p>
                <p className='text-sm text-[#1e293b]'>
                  <strong className='font-semibold'>Plan Active:</strong>{' '}
                  {studentData?.planActive ? 'Yes' : 'No'}
                </p>
              </div>
            </>
          )}
          <DialogFooter className='mt-6 flex justify-end'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                className='rounded-[8px] border border-[#e2e8f0] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]'
                onClick={() => dispatch(closeModalAdmin())}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>}
   
{dialogType === 'delete-blog' &&      <Dialog
        open
        onOpenChange={() => dispatch(closeModalAdmin())}
      >
        <form onSubmit={handleSubmitBlogDeletion}>
          <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold text-[#dc2626]'>
                Delete Blog
              </DialogTitle>
              <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
                <span className='text-xl font-bold text-[#1e293b]'>
                  Are you sure you want to delete this blog?
                </span>
                <br />
                This action cannot be undone.
              </DialogDescription>

              {showInput && (
                <div className='mt-4 space-y-2'>
                  <Label
                    htmlFor='deleteInput'
                    className='text-sm font-medium text-[#1e293b]'
                  >
                    Please type{' '}
                    <span className='font-bold text-[#dc2626]'>delete</span> to
                    confirm
                  </Label>
                  <div className='relative'>
                    <Input
                      id='deleteInput'
                      type='text'
                      placeholder='delete'
                      onChange={(e) => setInputValue(e.target.value)}
                      className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20'
                    />
                    {inputValue === 'delete' && (
                      <div className='absolute top-1/2 right-2 -translate-y-1/2 transform'>
                        <CheckCircle2 className='h-4 w-4 text-[#059669]' />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogHeader>

            <DialogFooter className='mt-6 flex justify-end space-x-3'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  className='rounded-[8px] border border-[#e2e8f0] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]'
                  disabled={deleteBlogMutation.isPending}
                  onClick={() => dispatch(closeModalAdmin())}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                size='sm'
                type={inputValue === 'delete' ? 'submit' : 'button'}
                variant='destructive'
                className='transform rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#dc2626] hover:to-[#b91c1c] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b]'
                disabled={
                  deleteBlogMutation.isPending ||
                  (showInput && inputValue !== 'delete')
                }
                onClick={(e) => {
                  if (inputValue === 'delete') {
                    handleSubmitBlogDeletion(e)
                  } else {
                    setShowInput((prev) => !prev)
                  }
                }}
              >
                {deleteBlogMutation.isPending ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='h-4 w-4 animate-spin'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>}
 
    </>
  )
}

export default DialogWrapper
