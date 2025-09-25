import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { startTransition } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  useNavigate,
  useParams,
  createLazyFileRoute,
} from '@tanstack/react-router'
import {
  ArrowLeft,
  GamepadIcon,
  Target,
  Tag,
  CheckCircle,
  AlertTriangle,
  Save,
  Layers,
  MessageSquare,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import ErrorText from '../../../../../shared/components/typography/errorText'
import { createNewSentenceArray } from '../../../../../shared/utils/helperFunction'

const queryClient = new QueryClient()

const gameQueryOptions = (params) =>
  queryOptions({
    queryKey: [
      'training-wheel-game',
      params.gameID,
      'admin/game-category/getAll',
    ],
    queryFn: async () => {
      try {
        const gameDetailsResponse = await axios.get(
          `/admin/game/training-wheel-game/get-game/${params.gameID}`
        )
        const game = gameDetailsResponse.data.data
        const cArr = game.answer_in_chunks
        console.log('game', game)
        const formattedGame = {
          question: game?.question,
          answer: game?.answer,
          chunk_1: cArr?.[0] ?? null,
          chunk_2: cArr?.[1] ?? null,
          chunk_3: cArr?.[2] ?? null,
          chunk_4: cArr?.[3] ?? null,
          chunk_5: cArr?.[4] ?? null,
          chunk_6: cArr?.[5] ?? null, 
          category: game?.category,
          levels: game?.difficulties,
        }

         

        const gameCategoriesResponse = await axios.get(
          '/admin/game-category/getAll'
        ) 
        console.log('gameCategoriesResponse', gameCategoriesResponse)
        return {
          gameDetails: gameDetailsResponse.data.success ? formattedGame : null,
          gameCategories: gameCategoriesResponse.data.success
            ? gameCategoriesResponse.data.data
            : [],
        }
      } catch (error) {
        console.log('error',error)
        return { gameDetails: null, gameCategories: [] }
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/admin/trainingwheelgame/edit/$gameID'
)({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(gameQueryOptions(params)),
})

function RouteComponent() {
  const { gameID } = useParams({
    from: '/_authenticated/admin/trainingwheelgame/edit/$gameID',
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { router } = useAppUtils()
  const isFirstRender = useRef(true)

  const { data } = useQuery({
    ...gameQueryOptions({ gameID }),
    suspense: true,
  })

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const { gameDetails, gameCategories } = data
  const [gameObj, setGameObj] = useState(gameDetails || {})
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setGameObj((prev) => ({ ...prev, [name]: value }))
    setErrorMessage('')
  }, [])

  const handleCheckboxes = useCallback((e) => {
    const { name, checked } = e.target
    setGameObj((prev) => {
      let levelArr = [...(prev.levels || [])]
      if (checked && !levelArr.includes(name)) {
        levelArr.push(name)
      } else if (!checked) {
        levelArr = levelArr.filter((l) => l !== name)
      }
      return { ...prev, levels: levelArr }
    })
    setErrorMessage('')
  }, [])

  const isSaveButtonDisabled = useCallback(() => {
    return (
      !gameObj.question ||
      !gameObj.answer ||
      !gameObj.levels?.length ||
      !gameObj.category
    )
  }, [gameObj])

  const updateQuestion = useCallback(async () => {
    const { question, answer, category, levels } = gameObj
    setErrorMessage('')

    // Validation
    if (!question?.trim()) {
      setErrorMessage('Question is required!')
      return { success: false }
    }
    if (!answer?.trim()) {
      setErrorMessage('Answer is required!')
      return { success: false }
    }
    if (answer.split(' ').length < 6) {
      setErrorMessage(
        "We'll break answer into 6 words, so sentence should have at least 6 words"
      )
      return { success: false }
    }
    if (!category?.trim()) {
      setErrorMessage('Category is required!')
      return { success: false }
    }
    if (!levels?.length) {
      setErrorMessage('At least provide one level!')
      return { success: false }
    }

    let answerArr = answer.split(' ')
    if (answerArr.length !== 6) {
      answerArr = createNewSentenceArray(answerArr)
    }

    const reqBody = {
      question,
      answer,
      answer_in_chunks: answerArr,
      category,
      levels,
    }

    try {
      const response = await axios.put(
        `/admin/game/training-wheel-game/update/${gameID}`,
        reqBody
      )
      if (response.data.success) {
        router.invalidate()
        await queryClient.invalidateQueries({
          queryKey: ['training-wheel-game', gameID],
        })
        toast.success(response.data.message)
        return { success: true }
      }
      throw new Error(response.data.message || 'Update failed')
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while updating the question'
      toast.error(errorMessage)
      setErrorMessage(errorMessage)
      return { success: false }
    }
  }, [gameID, gameObj, router, queryClient])

  const submitAction = useCallback(async () => {
    let result
    startTransition(() => {
      result = updateQuestion()
    })
    return result
  }, [updateQuestion])

  const [state, formAction, isPending] = useActionState(submitAction, {
    success: null,
    error: null,
  })

  useEffect(() => {
    if (state?.success) {
      navigate({ to: '/admin/trainingwheelgame' })
    }
  }, [state?.success, navigate])

  return (
    <div className='min-h-screen bg-[#f8fafc]'>
        <Header>
        <div className='relative z-10 my-4 flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='text-white bg-clip-text text-3xl font-bold '>
              Update Game Question
            </div>
            <div className='hidden h-8 w-px bg-gradient-to-b from-[#2563eb]/20 to-[#1d4ed8]/20 sm:block'></div>
            <div className='hidden items-center gap-2 text-white sm:flex'>
              <GamepadIcon size={20} />
              <span className='text-sm font-medium'>Training Wheel Game</span>
            </div>
          </div>
          <Button
            variant='outline'
            className='rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] shadow-sm transition-all duration-300 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
            onClick={() => navigate({ to: '/admin/trainingwheelgame' })}
          >
            <ArrowLeft className='h-5 w-5 text-[#2563eb] transition-transform duration-200 group-hover:-translate-x-1 group-hover:transform' />
            <span className='ml-2 hidden sm:inline'>Back</span>
          </Button>
        </div>
      </Header>

      {/* Background glow effects */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 opacity-20 mix-blend-multiply blur-xl filter delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-10 mix-blend-multiply blur-xl filter delay-500'></div>
      </div>

    
      <div className='relative z-10  mb-8 '>
        <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

          <CardContent className='relative z-10 space-y-8 p-8'>
            {/* Question Section */}
            <div className='space-y-4'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-2'>
                  <MessageSquare className='h-6 w-6 text-[#2563eb]' />
                </div>
                <Label className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-xl font-semibold text-transparent'>
                  Question
                </Label>
              </div>
              <div className='group relative'>
                <Textarea
                  name='question'
                  value={gameObj?.question || ''}
                  onChange={handleChange}
                  placeholder='Enter your training wheel game question here...'
                  className='min-h-[120px] resize-none rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] shadow-sm transition-all duration-300 placeholder:text-[#94a3b8] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                  aria-label='Game Question'
                />
                <div className='absolute inset-0 -z-10 rounded-[8px] bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 transition-all duration-300 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10'></div>
                <div className='absolute right-3 bottom-3 text-xs text-[#64748b]'>
                  {gameObj?.question?.length || 0} characters
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className='space-y-4'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-2'>
                  <Target className='h-6 w-6 text-[#2563eb]' />
                </div>
                <div className='flex-1'>
                  <Label className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-xl font-semibold text-transparent'>
                    Answer
                  </Label>
                  <p className='mt-1 flex items-center gap-2 text-sm text-[#64748b]'>
                    <AlertTriangle size={14} className='text-[#f59e0b]' />
                    Answer will be broken into 6 words, so provide at least 6
                    words
                  </p>
                </div>
              </div>
              <div className='group relative'>
                <Textarea
                  name='answer'
                  value={gameObj?.answer || ''}
                  onChange={handleChange}
                  placeholder='Enter the complete answer (minimum 6 words)...'
                  className='min-h-[120px] resize-none rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] shadow-sm transition-all duration-300 placeholder:text-[#94a3b8] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                  aria-label='Game Answer'
                />
                <div className='absolute inset-0 -z-10 rounded-[8px] bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 transition-all duration-300 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10'></div>
                <div className='absolute right-3 bottom-3 text-xs text-[#64748b]'>
                  {gameObj?.answer?.split(' ').length || 0} words
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Category Section */}
              <div className='space-y-4'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='rounded-lg bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-2'>
                    <Tag className='h-6 w-6 text-[#2563eb]' />
                  </div>
                  <Label className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-semibold text-transparent'>
                    Category
                  </Label>
                </div>
                <div className='group relative'>
                  <Select
                    value={gameObj?.category || ''}
                    onValueChange={(value) => {
                      setGameObj((prev) => ({ ...prev, category: value }))
                      setErrorMessage('')
                    }}
                  >
                    <SelectTrigger
                      className='h-12 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] shadow-sm transition-all duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                      aria-label='Select Category'
                    >
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent className='rounded-[8px] border-[#e2e8f0] bg-white shadow-sm'>
                      <SelectGroup>
                        {gameCategories?.length > 0 &&
                          gameCategories.map((category) => (
                            <SelectItem
                              value={category._id}
                              key={category._id}
                              className='rounded-lg text-[#1e293b] hover:bg-[#f8fafc]'
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className='absolute inset-0 -z-10 rounded-[8px] bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 transition-all duration-300 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10'></div>
                </div>
              </div>

              {/* Difficulty Levels Section */}
              <div className='space-y-4'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='rounded-lg bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-2'>
                    <Layers className='h-6 w-6 text-[#2563eb]' />
                  </div>
                  <Label className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-semibold text-transparent'>
                    Difficulty Levels
                  </Label>
                </div>
                <p className='mb-4 text-sm text-[#64748b]'>
                  Select the difficulty levels where this question should
                  appear:
                </p>

                <div className='space-y-3'>
                  {[
                    {
                      name: 'beginner',
                      label: 'Beginner',
                      color:
                        'from-[#10b981]/10 to-[#059669]/10 border-[#10b981]/20',
                      textColor: 'text-[#10b981]',
                    },
                    {
                      name: 'intermediate',
                      label: 'Intermediate',
                      color:
                        'from-[#f59e0b]/10 to-[#d97706]/10 border-[#f59e0b]/20',
                      textColor: 'text-[#f59e0b]',
                    },
                    {
                      name: 'expert',
                      label: 'Expert',
                      color:
                        'from-[#ef4444]/10 to-[#dc2626]/10 border-[#ef4444]/20',
                      textColor: 'text-[#ef4444]',
                    },
                  ].map((level) => (
                    <div
                      key={level.name}
                      className={`flex items-center gap-3 rounded-[8px] bg-gradient-to-r p-3 ${level.color} border transition-all duration-300 hover:shadow-sm`}
                    >
                      <Input
                        type='checkbox'
                        id={level.name}
                        name={level.name}
                        className='h-5 w-5 rounded focus:ring-2 focus:ring-[#2563eb]'
                        checked={gameObj?.levels?.includes(level.name) || false}
                        onChange={handleCheckboxes}
                        aria-label={`Select ${level.label} difficulty`}
                      />
                      <Label
                        htmlFor={level.name}
                        className={`cursor-pointer font-medium ${level.textColor} flex-1`}
                      >
                        {level.label}
                      </Label>
                      {gameObj?.levels?.includes(level.name) && (
                        <CheckCircle className='h-5 w-5 text-[#10b981]' />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className='flex items-center gap-3 rounded-[8px] border border-[#ef4444]/20 bg-[#fef2f2] p-4'>
                <AlertTriangle className='h-5 w-5 flex-shrink-0 text-[#ef4444]' />
                <ErrorText className='m-0 text-[#ef4444]'>
                  {errorMessage}
                </ErrorText>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-col justify-between gap-4 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center'>
              <div className='text-sm text-[#64748b]'>
                Make sure to fill all required fields before saving
              </div>
              <Button
                size='lg'
                onClick={() => startTransition(() => formAction())}
                disabled={isSaveButtonDisabled() || isPending}
                className='rounded-[8px] bg-[#2563eb] text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                aria-label='Save Changes'
              >
                {isPending ? (
                  <>
                    <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white' />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-5 w-5' />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
