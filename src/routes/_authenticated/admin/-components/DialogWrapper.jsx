import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  closeModalAdmin,
  openModalAdmin,
} from '../../../../shared/config/reducers/admin/DialogSlice'
import { DialogSkeleton } from '../../student/-components/modals/DialogSkeleton'
import { blogsQueryOptions } from '../blogs/index.lazy'
import { blogCategoryQueryOptions } from '../settings'
import { courseCategoryQueryOptions } from '../settings/course-category'
import { gameCategoryQueryOptions } from '../settings/game-category'
import { gamesQueryOptions } from '../trainingwheelgame'
// Lazy imports (sab default ke taur par)
const AddCategoryDialog = lazy(() => import('./modals/AddCategoryDialog'))
const DeleteBlogDialog = lazy(() => import('./modals/DeleteBlog'))
const DeleteCategoryDialog1 = lazy(() => import('./modals/DeleteCategoryDialog'))
const DeleteCategoryDialog = lazy(() => import('./modals/DeleteCategoryModal'))
const DeleteGameDialog = lazy(() => import('./modals/DeleteGameModal'))
const EditCategoryDialog = lazy(() => import('./modals/EditCategoryDialog'))
const ViewCategoryDialog = lazy(() => import('./modals/ViewCategoryDialog'))
const ViewStudentDialog = lazy(() => import('./modals/ViewStudentDetails'))

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


  // Title and description based on dialog type

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
    console.log('hi delte')
    deleteBlogCategoryMutation.mutate({
      ...modalData.category,
      deleteConfirmed: 'Yes',
    })
  }

  const handleSubmitAddCategory = async (e) => {
    e.preventDefault()
    console.log('handle submit add category')
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
  {/* Delete Game Dialog */}
  <Suspense
    fallback={
      <DialogSkeleton
        maxWidth='sm'
        h='sm'
        onClose={() => dispatch(closeModalAdmin())}
      />
    }
  >
    {dialogType === 'delete-game' && (
      <DeleteGameDialog
        dialogOpen={true}
        closeModalAdmin={() => dispatch(closeModalAdmin())}
        modalData={modalData}
        deleteGameMutation={deleteGameMutation}
      />
    )}
  </Suspense>

  {/* Delete Category Dialog */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='md' />}>
    {(dialogType === 'confirm-delete-blog-category' ||
      dialogType === 'alert-course-category-delete' ||
      dialogType === 'confirm-game-delete-category') && (
      <DeleteCategoryDialog
        dialogOpen={true}
        closeModalAdmin={() => dispatch(closeModalAdmin())}
        dialogType={dialogType}
        modalData={modalData}
        handleSubmitDeleteCategory={handleSubmitDeleteCategory}
        deleteBlogCategoryMutation={deleteBlogCategoryMutation}
      />
    )}
  </Suspense>

  {/* Add Category Dialog */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='md' />}>
    {(dialogType === 'add-blog-category-modal' ||
      dialogType === 'add-course-category' ||
      dialogType === 'add-game-category') && (
      <AddCategoryDialog
        dialogOpen={true}
        dialogType={dialogType}
        inputValue={inputValue}
        setInputValue={setInputValue}
        addCategoryMutation={addCategoryMutation}
        handleSubmitAddCategory={handleSubmitAddCategory}
        closeModalAdmin={() => dispatch(closeModalAdmin())}
      />
    )}
  </Suspense>

  {/* View Category Dialog */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='md' />}>
    {[
      'blog-category-view-modal',
      'course-category-view-modal',
      'view-game-category-modal',
    ].includes(dialogType) && (
      <ViewCategoryDialog
        dialogOpen={true}
        dialogType={dialogType}
        blogCategoryData={blogCategoryData}
        blogCategoryFetchStatus={blogCategoryFetchStatus}
        blogCategoryIsError={blogCategoryIsError}
        blogCategoryError={blogCategoryError}
        blogCategoryIsFetching={blogCategoryIsFetching}
        closeModalAdmin={() => dispatch(closeModalAdmin())}
      />
    )}
  </Suspense>

  {/* Edit Category Dialog */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='md' />}>
    {(dialogType === 'edit-category-modal' ||
      dialogType === 'course-category-edit-modal' ||
      dialogType === 'game-category-edit-modal') && (
      <EditCategoryDialog
        dialogType={dialogType}
        inputValue={inputValue}
        setInputValue={setInputValue}
        editCategoryMutation={editCategoryMutation}
        handleSubmitEditCategory={handleSubmitEditCategory}
        dispatch={dispatch}
        closeModalAdmin={closeModalAdmin}
      />
    )}
  </Suspense>

  {/* Delete Category Dialog 1 */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='sm' />}>
    {[
      'delete-blog-category',
      'course-category-delete-modal',
      'game-category-delete-modal',
    ].includes(dialogType) && (
      <DeleteCategoryDialog1
        dialogType={dialogType}
        showInput={showInput}
        setShowInput={setShowInput}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmitCategory={handleSubmitCategory}
        deleteBlogCategoryFirstMutation={deleteBlogCategoryFirstMutation}
        dispatch={dispatch}
        closeModalAdmin={closeModalAdmin}
      />
    )}
  </Suspense>

  {/* View Student Dialog */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='md' />}>
    {dialogType === 'view-student-details' && (
      <ViewStudentDialog
        dialogType={dialogType}
        studentData={studentData}
        studentFetchStatus={studentFetchStatus}
        dispatch={dispatch}
        closeModalAdmin={closeModalAdmin}
      />
    )}
  </Suspense>

  {/* Delete Blog Dialog */}
  <Suspense fallback={<DialogSkeleton maxWidth='sm' h='sm' />}>
    {dialogType === 'delete-blog' && (
      <DeleteBlogDialog
        dialogType={dialogType}
        showInput={showInput}
        setShowInput={setShowInput}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmitBlogDeletion={handleSubmitBlogDeletion}
        deleteBlogMutation={deleteBlogMutation}
        dispatch={dispatch}
        closeModalAdmin={closeModalAdmin}
      />
    )}
  </Suspense>
</>

  )
}

export default DialogWrapper
