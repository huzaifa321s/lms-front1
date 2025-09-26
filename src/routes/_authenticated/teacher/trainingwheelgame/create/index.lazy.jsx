import { useCallback, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import {
  Layers,
  Tag,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
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
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import ErrorText from '../../../../../shared/components/typography/errorText'
import { createNewSentenceArray } from '../../../../../shared/utils/helperFunction'

const queryClient = new QueryClient()

const createGameQueryOptions = () =>
  queryOptions({
    queryKey: ['game-category'],
    queryFn: async () => {
      try {
        let gameCategoriesResponse = await axios.get(
          '/teacher/game-category/getAll'
        )
        gameCategoriesResponse = gameCategoriesResponse.data
        return {
          gameCategories: gameCategoriesResponse.success
            ? gameCategoriesResponse.data
            : [],
        }
      } catch (error) {
        console.log('error', error)
        return { gameCategories: [] }
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/teacher/trainingwheelgame/create/'
)({
  loader: () => queryClient.ensureQueryData(createGameQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const { data, fetchStatus } = useSuspenseQuery(createGameQueryOptions())
  const { gameCategories } = data
  const [isLoading, setIsLoading] = useState(false)
  const [isAddNewButtonLoading, setIsAddNewButtonLoading] = useState(false)
  const { navigate } = useAppUtils()
  const queryClient = useQueryClient()

  const TEMPLATE_OBJ = {
    question: '',
    answer: '',
    category: '',
    levels: ['beginner'],
  }

  const [gameObj, setGameObj] = useState(TEMPLATE_OBJ)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setGameObj((prev) => ({ ...prev, [name]: value }))
      if (errorMessage) setErrorMessage('')
    },
    [errorMessage]
  )

  const handleCheckboxes = useCallback(
    (e) => {
      const { name, checked } = e.target
      let levelArr = [...gameObj.levels]

      if (!levelArr.includes(name) && checked) {
        levelArr.push(name)
      } else {
        levelArr = levelArr.filter((l) => l !== name)
      }
      console.log('Level Array: ', levelArr)
      setGameObj((prev) => ({ ...prev, levels: levelArr }))
      if (errorMessage) setErrorMessage('')
    },
    [gameObj.levels, errorMessage]
  )

  const isAddButtonDisabled = useCallback(() => {
    return (
      !gameObj.question ||
      !gameObj.answer ||
      !gameObj.category ||
      gameObj.levels.length === 0
    )
  }, [gameObj])

  const addQuestion = useCallback(
    async (action = 'add') => {
      const { question, answer, category, levels } = gameObj

      if (question.trim() === '') {
        return setErrorMessage('Question is required!')
      } else if (answer.trim() === '') {
        return setErrorMessage('Answer is required!')
      } else if (answer.split(' ').length < 6) {
        return setErrorMessage(
          "We'll break answer into 6 words, so sentence should have at least 6 words"
        )
      } else if (category.trim() === '') {
        return setErrorMessage('Category is required!')
      } else if (levels.length === 0) {
        return setErrorMessage('At least provide one level!')
      }

      action === 'add'
        ? setIsLoading(true)
        : action === 'add-and-new'
          ? setIsAddNewButtonLoading(true)
          : null

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
        let response = await axios.post(
          '/teacher/game/training-wheel-game/create',
          reqBody
        )
        response = response.data
        if (response.success) {
          await queryClient.invalidateQueries(createGameQueryOptions())
          toast.success(response.message)
          if (action === 'add') {
            navigate({ to: '/teacher/trainingwheelgame' })
          }
          if (action === 'add-and-new') {
            setGameObj(TEMPLATE_OBJ)
            setErrorMessage('')
          }
        }
      } catch (error) {
        console.log('error', error)
        const errorResponse = error.response.data
        toast.error(errorResponse.message)
        setErrorMessage(errorResponse.message)
      } finally {
        setIsLoading(false)
        setIsAddNewButtonLoading(false)
      }
    },
    [gameObj, TEMPLATE_OBJ, navigate, queryClient]
  )

  return (
   <>
   
        <Header >
        <div className='relative z-10  my-4 flex w-full  items-center justify-between px-4'>
          <div className='bg-clip-text text-2xl font-bold '>
            Add Game Question
          </div>
          <Button
            variant='outline'
            className='rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] shadow-lg transition-all duration-300 hover:bg-[#e2e8f0] hover:text-[#475569] hover:shadow-[#cbd5e1]/50 focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
            onClick={() => window.history.back()}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        </div>
      </Header>
       <div className='relative min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f1f5f9] font-sans'>
      {/* Background Glow */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] opacity-20 mix-blend-multiply blur-xl filter delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] opacity-10 mix-blend-multiply blur-xl filter delay-500'></div>
      </div>

    

      <Main className='px-4 py-8'>
        <Card className='relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
          <CardContent className='relative z-10 space-y-6'>
            {/* Question */}
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-lg font-semibold text-[#1e293b]'>
                <Tag className='h-5 w-5 text-[#2563eb]' /> Question
              </Label>
              <Textarea
                name='question'
                value={gameObj.question}
                onChange={handleChange}
                placeholder='Enter your training wheel game question here...'
                className='min-h-[120px] resize-none rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
              />
            </div>

            {/* Answer */}
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-lg font-semibold text-[#1e293b]'>
                <Tag className='h-5 w-5 text-[#f59e0b]' /> Answer
              </Label>
              <p className='mb-1 flex items-center gap-2 text-sm text-[#64748b]'>
                <AlertTriangle className='h-4 w-4 text-[#f59e0b]' />
                Answer will be broken into 6 words (minimum 6 words required)
              </p>
              <Textarea
                name='answer'
                value={gameObj.answer}
                onChange={handleChange}
                placeholder='Enter the complete answer (minimum 6 words)...'
                className='min-h-[120px] resize-none rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
              />
            </div>

            {/* Category & Levels */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <div className='space-y-2'>
                <Label className='flex items-center gap-2 text-lg font-semibold text-[#1e293b]'>
                  <Tag className='h-5 w-5 text-[#2563eb]' /> Category
                </Label>
                <Select
                  value={gameObj.category}
                  onValueChange={(value) =>
                    setGameObj((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className='h-12 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent className='border-[#e2e8f0] bg-white text-[#1e293b]'>
                    <SelectGroup>
                      {fetchStatus === 'fetching' ? (
                        <Skeleton className='h-8 w-full bg-[#f1f5f9]' />
                      ) : (
                        gameCategories.map((cat) => (
                          <SelectItem
                            key={cat._id}
                            value={cat._id}
                            className='text-[#1e293b] hover:bg-[#f1f5f9]'
                          >
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label className='flex items-center gap-2 text-lg font-semibold text-[#1e293b]'>
                  <Layers className='h-5 w-5 text-[#f59e0b]' /> Difficulty
                  Levels
                </Label>
                <div className='flex gap-4'>
                  {[
                    {
                      name: 'beginner',
                      label: 'Beginner',
                      color: 'from-[#10b981] to-[#059669]',
                      borderColor: 'border-[#10b981]',
                      textColor: 'text-[#10b981]',
                    },
                    {
                      name: 'intermediate',
                      label: 'Intermediate',
                      color: 'from-[#f59e0b] to-[#d97706]',
                      borderColor: 'border-[#f59e0b]',
                      textColor: 'text-[#f59e0b]',
                    },
                    {
                      name: 'expert',
                      label: 'Expert',
                      color: 'from-[#ef4444] to-[#dc2626]',
                      borderColor: 'border-[#ef4444]',
                      textColor: 'text-[#ef4444]',
                    },
                  ].map((lvl) => (
                    <Label key={lvl.name} className='flex items-center gap-2'>
                      <Input
                        type='checkbox'
                        checked={gameObj.levels.includes(lvl.name)}
                        name={lvl.name}
                        onChange={handleCheckboxes}
                        className='h-4 w-4 rounded focus:ring-2 focus:ring-[#2563eb]'
                      />
                      <span className={`font-medium ${lvl.textColor}`}>
                        {lvl.label}
                      </span>
                      {gameObj.levels.includes(lvl.name) && (
                        <CheckCircle className='h-4 w-4 text-[#10b981]' />
                      )}
                    </Label>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className='flex items-center gap-2 rounded-[8px] border border-[#ef4444] bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 p-3'>
                <AlertTriangle className='h-5 w-5 text-[#ef4444]' />
                <ErrorText className='text-[#ef4444]'>{errorMessage}</ErrorText>
              </div>
            )}

            {/* Actions */}
            <div className='flex flex-col items-center justify-between gap-4 border-t border-[#e2e8f0] pt-4 sm:flex-row'>
              <div className='text-sm text-[#64748b]'>
                Fill all required fields before saving
              </div>
              <div className='flex gap-2'>
                <Button
                  size='lg'
                  className='rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#1e40af] hover:shadow-[#cbd5e1]/50 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => addQuestion('add')}
                  loading={isLoading}
                  disabled={isAddButtonDisabled() || isLoading}
                >
                  {isLoading ? 'Saving...' : 'Add'}
                </Button>
                <Button
                  size='lg'
                  variant='secondary'
                  className='rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] shadow-lg transition-all duration-300 hover:bg-[#e2e8f0] hover:text-[#475569] hover:shadow-[#cbd5e1]/50 focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => addQuestion('add-and-new')}
                  loading={isAddNewButtonLoading}
                  disabled={isAddButtonDisabled() || isAddNewButtonLoading}
                >
                  {isAddNewButtonLoading ? 'Saving...' : 'Add & New'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </div>
    </>
  )
}
