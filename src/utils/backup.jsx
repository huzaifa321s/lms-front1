import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {  useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
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
import { gameQueryOptions } from '../trainingwheelgame'
import { useAppUtils } from '../../../../hooks/useAppUtils'

const DialogWrapper = ({ isOpen, onClose, modalType, modalData }) => {
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
        await queryClient.invalidateQueries(
          courseQueryOptions(modalData?.searchParams)
        )
        dispatch(closeModal())
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
        if(modalData?.redirect) navigate({to:modalData?.redirect})
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
        await queryClient.invalidateQueries(gameQueryOptions(modalData?.params));
        dispatch(closeModal())
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
  if (dialogType === 'game-view') {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>{gameData?.question}</DialogTitle>
            </DialogHeader>
            <form className='relative'>
              {gameIsError && <p>{gameFetchingError.message}</p>}
              {gameFetchStatus === 'paused' && (
                <p className='text-red-500'>No Internet connection</p>
              )}
              {(gameFetchStatus === 'fetching' ||
                gameIsFetching ||
                (!gameData && gameFetchStatus !== 'paused')) &&
              !gameIsError ? (
                <Skeleton className='my-1 h-[200px] w-full' />
              ) : (
                <>
                  {gameData && (
                    <div className='flex w-[150px] items-center'>
                      Difficulties:
                      {gameData &&
                        gameData?.difficulties?.length > 0 &&
                        gameData?.difficulties.map((item) => {
                          return (
                            <Badge
                              variant={
                                item === 'beginner'
                                  ? 'secondary'
                                  : item === 'intermediate'
                                    ? 'default'
                                    : item === 'expert'
                                      ? 'destructive'
                                      : 'default'
                              }
                            >
                              {' '}
                              {item}
                            </Badge>
                          )
                        })}
                    </div>
                  )}
                  <div>
                    {gameData && 'Answer:'} {gameData?.answer}
                  </div>
                  <ul className='list-disc px-5'>
                    {gameData?.answer_in_chunks?.map((option, i) => {
                      return <li key={i}>{option}</li>
                    })}
                  </ul>
                </>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    size='xs'
                    className='ml-auto w-fit'
                    variant='outline'
                    onClick={() => dispatch(closeModal())}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (dialogType === 'delete-course-modal') {
    const handleSubmit = async () => {
      await deleteCourse()
    }
    return (
      <>
        <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
          <form onSubmit={handleSubmit}>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Delete Course</DialogTitle>
               <DialogDescription>
  <span className="text-xl font-bold">
    Are you sure you want to delete this course?
  </span>
  <br />
  <span className="font-bold">Title</span>:{" "}
  <span className="line-clamp-1">{modalData?.courseDetails?.name}</span>
  <br />
  <span className="font-bold">Description</span>:{" "}
  <span className="line-clamp-2">{modalData?.courseDetails?.desc}</span>
</DialogDescription>



                {showInput && (
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='deleteInput'>
                      Please Type 'delete' here
                    </Label>
                    <Input
                      id='deleteInput'
                      type='text'
                      placeholder='delete'
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                )}
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    size='sm'
                    disabled={false}
                    variant='outline'
                    onClick={() => dispatch(closeModal())}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  size='sm'
                  type={inputValue === 'delete' ? 'submit' : ''}
                  loading={false}
                  variant='destructive'
                  disabled={showInput && inputValue !== 'delete'}
                  onClick={() => {
                    inputValue === 'delete'
                      ? handleSubmit()
                      : setShowInput((prev) => !prev)
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </>
    )
  }

  if(dialogType === 'delete-game-modal'){
    const handleSubmit = async () => {
    await deleteGame()
  }
return (
    <>
      <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
        <form onSubmit={handleSubmit}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Delete Game</DialogTitle>
              <DialogDescription>
                <span className='text-xl font-bold'>
                  Are you sure you want to delete this game?
                </span>
                <br />
                <span className='font-bold'>Question</span>:
                {modalData?.gameDetails?.question}
                
              </DialogDescription>
              
              {showInput && (
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='deleteInput'>Please Type 'delete' here</Label>
                  <Input
                    id='deleteInput'
                    type='text'
                    placeholder='delete'
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              )}
            </DialogHeader>

            <DialogFooter >
              <DialogClose asChild>
                <Button
                  size='sm'
                  disabled={false}
                  variant='outline'
                  onClick={() => dispatch(closeModal())}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                size='sm'
                type={inputValue === 'delete' ? 'submit' : '' }
                variant='destructive'
                disabled={showInput && inputValue !== 'delete'  }
                loading={false}
                onClick={() => {
                  inputValue === 'delete' ? handleSubmit() : setShowInput((prev) => !prev)
                }}
              >
                
                  Delete
                
              </Button>

            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
  }
}

export default DialogWrapper