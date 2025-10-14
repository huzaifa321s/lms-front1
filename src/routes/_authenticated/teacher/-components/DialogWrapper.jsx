import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { closeModalTeacher } from '../../../../shared/config/reducers/teacher/teacherDialogSlice'
import { DialogSkeleton } from '../../student/-components/modals/DialogSkeleton'
import { courseQueryOptions } from '../courses'
import { gameQueryOptions } from '../trainingwheelgame/index.lazy'

const DeleteCourseDialog = lazy(() => import('./modals/DeleteCourseModal'))
const DeleteGameDialog = lazy(() => import('./modals/DeleteGameModal'))

const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [dialogType, setDialogType] = useState(modalType)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { router } = useAppUtils()
  const navigate = useNavigate()
  const deleteCourse = useCallback(async () => {
    try {
      let response = await axios.delete(
        `/teacher/course/delete/${modalData?.courseId}`
      )
      response = response.data
      if (response.success) {
        toast.success(response.message)
        dispatch(closeModalTeacher())
        await queryClient.invalidateQueries(
          courseQueryOptions({ page: modalData?.page, input: modalData?.query })
        )
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      console.log('modalData ===>', modalData)
      if (modalData?.redirect)
        navigate({
          to: modalData?.redirect,
          search: { input: modalData?.query, page: modalData?.page },
        })
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
        dispatch(closeModalTeacher())
        await queryClient.invalidateQueries(gameQueryOptions(modalData?.params))
      }
    } catch (error) {
      console.log('Error: ', error)
      toast.error('Internal server error')
    }
  }, [
    axios,
    modalData?.gameID,
    router,
    toast,
    queryClient,
    gameQueryOptions,
    modalData?.params,
    dispatch,
    closeModalTeacher,
  ])

  // setting dialog type
  useEffect(() => {
    setDialogType(modalType)
  }, [modalData, modalType])

  const deletecourseMutation = useMutation({mutationFn:deleteCourse});
  

  const handleSubmitDeletion =  () => {
     deletecourseMutation.mutate()
  }

  const handleSubmitDeleteGame = async () => {
    await deleteGame()
  }
  return (
    <>
      <Suspense
        fallback={
          <DialogSkeleton
            maxWidth='sm'
            h='md'
            onClose={() => dispatch(closeModalTeacher())}
          />
        }
      >
        <DeleteCourseDialog
          isOpen={isOpen && dialogType === 'delete-course-modal'}
          closeModalTeacher={() => dispatch(closeModalTeacher())}
          handleSubmitDeletion={handleSubmitDeletion}
          modalData={{
            courseDetails: modalData?.courseDetails,
            courseId: modalData?.courseId,
            query: modalData?.query,
            page: modalData?.page,
            index: modalData?.index,
          }}
          isLoading={deletecourseMutation.isPending}
        />
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            maxWidth='sm'
            h='md'
            onClose={() => dispatch(closeModalTeacher())}
          />
        }
      >
      <DeleteGameDialog
        isOpen={isOpen && dialogType === 'delete-game-modal'}
        closeModalTeacher={() => dispatch(closeModalTeacher())}
        handleSubmitDeleteGame={handleSubmitDeleteGame}
        modalData={{ gameDetails: modalData?.gameDetails }}
      />
      </Suspense>
    </>
  )
}

export default DialogWrapper
