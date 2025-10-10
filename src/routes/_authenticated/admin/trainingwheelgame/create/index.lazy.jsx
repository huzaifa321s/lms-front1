import { useCallback, useState } from 'react'
import axios from 'axios'
import { useNavigate, createLazyFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import ErrorText from '../../../../../shared/components/typography/errorText'
import { Skeleton } from '@/components/ui/skeleton'
import { createNewSentenceArray } from '../../../../../shared/utils/helperFunction'
import { Main } from '@/components/layout/main'
import { QueryClient, queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Layers, Tag, CheckCircle, AlertTriangle, Target, Plus, Loader } from 'lucide-react'

const queryClient = new QueryClient()
const gameCategoryQueryOptions = () =>
  queryOptions({
    queryKey: ['game-category'],
    queryFn: async () => {
      try {
        const res = await axios.get('/admin/game-category/getAll')
        const data = res.data
        return { gameCategories: data.success ? data.data : [] }
      } catch (error) {
        console.error(error)
        return { gameCategories: [] }
      }
    },
  })

export const Route = createLazyFileRoute('/_authenticated/admin/trainingwheelgame/create/')({
  loader: () => queryClient.ensureQueryData(gameCategoryQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data, fetchStatus } = useSuspenseQuery(gameCategoryQueryOptions())
  const gameCategories = data.gameCategories

  const navigate = useNavigate()
  const TEMPLATE_OBJ = { question: '', answer: '', category: '', levels: ['beginner'] }
  const [gameObj, setGameObj] = useState(TEMPLATE_OBJ)
  const [errorMessage, setErrorMessage] = useState('')
  const [addBtnLoading, setAddBtnLoading] = useState(false)
  const [addNewBtnLoading, setAddNewBtnLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setGameObj({ ...gameObj, [name]: value })
    if (errorMessage) setErrorMessage('')
  }

  const handleCheckboxes = (e) => {
    const { name, checked } = e.target
    let levels = [...gameObj.levels]
    if (checked && !levels.includes(name)) levels.push(name)
    else levels = levels.filter((l) => l !== name)
    setGameObj({ ...gameObj, levels })
    if (errorMessage) setErrorMessage('')
  }

  const isAddButtonDisabled = () => !gameObj.question || !gameObj.answer || !gameObj.category || gameObj.levels.length === 0

  const addQuestion = useCallback(
    async (action = 'add') => {
      const { question, answer, category, levels } = gameObj

      if (!question.trim()) return setErrorMessage('Question is required!')
      if (!answer.trim()) return setErrorMessage('Answer is required!')
      if (answer.split(' ').length < 6)
        return setErrorMessage("We'll break answer into 6 words, so sentence should have atleast 6 words")
      if (!category.trim()) return setErrorMessage('Category is required!')
      if (!levels.length) return setErrorMessage('At least provide one level!')

      let answerArr = answer.split(' ')
      if (answerArr.length !== 6) answerArr = createNewSentenceArray(answerArr)

      const reqBody = { question, answer, answer_in_chunks: answerArr, category, levels }
      action === 'add' ? setAddBtnLoading(true) : setAddNewBtnLoading(true)

      try {
        const res = await axios.post('/admin/game/training-wheel-game/create', reqBody)
        const response = res.data
        if (response.success) {
          await queryClient.invalidateQueries(gameCategoryQueryOptions)
          toast.success(response.message)
          if (action === 'add') navigate({ to: '/admin/trainingwheelgame' })
          if (action === 'add-and-new') setGameObj(TEMPLATE_OBJ)
        }
      } catch (error) {
        const errMsg = error?.response?.data?.message || 'An error occurred'
        toast.error(errMsg)
        setErrorMessage(errMsg)
      } finally {
        setAddBtnLoading(false)
        setAddNewBtnLoading(false)
      }
    },
    [gameObj, TEMPLATE_OBJ, navigate, queryClient]
  )

  return (
      <>
      

           <Header >
        <div className="relative z-10 my-4 flex w-full items-center justify-between">
          <div className="text-2xl font-bold text-white bg-clip-text text-transparent">
            Add Game Question
          </div>
          <Button
            className="text-black"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>
      </Header>
      
 <div className="min-h-screen bg-[#f8fafc]">

   

      <Main className=" px-4 py-8">
        <Card className="relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <CardContent className="relative z-10 p-8 space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#2563eb]" />
                Question
              </Label>
              <div className="relative group">
                <Textarea
                  name="question"
                  value={gameObj?.question || ''}
                  onChange={handleChange}
                  placeholder="Enter question"
                  className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
              </div>
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-2">
                <Target className="w-5 h-5 text-[#2563eb]" />
                Answer
              </Label>
              <p className="text-sm text-[#64748b] flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                Answer will be broken into 6 words (minimum 6 words required)
              </p>
              <div className="relative group">
                <Textarea
                  name="answer"
                  value={gameObj?.answer || ''}
                  onChange={handleChange}
                  placeholder="Enter answer"
                  className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
              </div>
            </div>

            {/* Category & Levels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#2563eb]" />
                  Category
                </Label>
                <div className="relative group">
                  <Select
                    value={gameObj?.category || ''}
                    onValueChange={(value) => setGameObj((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-12 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#e2e8f0] shadow-sm rounded-[8px]">
                      <SelectGroup>
                        {fetchStatus === 'fetching' ? (
                          <Skeleton className="w-full h-8" />
                        ) : (
                          gameCategories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id} className="text-[#1e293b] hover:bg-[#f8fafc] rounded-lg">
                              {cat.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2563eb]" />
                  Difficulty Levels
                </Label>
                <div className="flex flex-col gap-3">
                  {[
                    { name: 'beginner', label: 'Beginner', color: 'from-[#10b981]/10 to-[#059669]/10 border-[#10b981]/20', textColor: 'text-[#10b981]' },
                    { name: 'intermediate', label: 'Intermediate', color: 'from-[#f59e0b]/10 to-[#d97706]/10 border-[#f59e0b]/20', textColor: 'text-[#f59e0b]' },
                    { name: 'expert', label: 'Expert', color: 'from-[#ef4444]/10 to-[#dc2626]/10 border-[#ef4444]/20', textColor: 'text-[#ef4444]' }
                  ].map((lvl) => (
                    <div key={lvl.name} className={`flex items-center gap-3 p-3 rounded-[8px] bg-gradient-to-r ${lvl.color} border hover:shadow-sm transition-all duration-300`}>
                      <Input
                        type="checkbox"
                        name={lvl.name}
                        checked={gameObj?.levels?.includes(lvl.name) || false}
                        onChange={handleCheckboxes}
                        className="h-5 w-5 rounded focus:ring-2 focus:ring-[#2563eb]"
                      />
                      <Label htmlFor={lvl.name} className={`font-medium cursor-pointer ${lvl.textColor}`}>
                        {lvl.label}
                      </Label>
                      {gameObj?.levels?.includes(lvl.name) && (
                        <CheckCircle className="w-5 h-5 text-[#10b981]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="bg-[#fef2f2] border border-[#ef4444]/20 rounded-[8px] p-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                <ErrorText className="text-[#ef4444]">{errorMessage}</ErrorText>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#e2e8f0]">
              <div className="text-sm text-[#64748b]">Fill all required fields before saving</div>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  onClick={() => addQuestion('add')}
                  disabled={isAddButtonDisabled() || addBtnLoading}
                >
                  {addBtnLoading ? 'Saving...' : 'Add'}    {addBtnLoading ? <Loader className="animate animate-spin"/> : <Plus/>}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => addQuestion('add-and-new')}
                  disabled={isAddButtonDisabled() || addNewBtnLoading}
                >
                  {addNewBtnLoading ? 'Saving...' : 'Add & New'}
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
