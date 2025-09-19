import { useCallback, useState } from 'react'
import axios from 'axios'
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import ErrorText from '../../../../../shared/components/typography/errorText'
import { QueryClient, queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createNewSentenceArray } from '../../../../../shared/utils/helperFunction'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { 
  ArrowLeft, 
  GamepadIcon, 
  PenTool, 
  Target, 
  Tag, 
  CheckCircle,
  AlertTriangle,
  Save,
  Layers,
  MessageSquare
} from 'lucide-react'

const queryClient = new QueryClient();
const gameQueryOptions = (params) =>
  queryOptions({
    queryKey:['training-wheel-game',params.gameID,'admin/game-category/getAll'],
    queryFn:async () => {
    try {
      let gameDetailsResponse = await axios.get(
        `/admin/game/training-wheel-game/get-game/${params.gameID}`
      )
      gameDetailsResponse = gameDetailsResponse.data

      let game = gameDetailsResponse.data

      const cArr = game.answer_in_chunks
      game = {
        question: game.question,
        answer: game.answer,
        chunk_1: cArr[0],
        chunk_2: cArr[1],
        chunk_3: cArr[2],
        chunk_4: cArr[3],
        chunk_5: cArr[4],
        chunk_6: cArr[5],
        category: game.category,
        levels: game.difficulties,
      }

      let gameCategoriesResponse = await axios.get(
        '/admin/game-category/getAll'
      )
      gameCategoriesResponse = gameCategoriesResponse.data
      return {
        gameDetails: gameDetailsResponse.success ? game : null,
        gameCategories: gameCategoriesResponse.success
          ? gameCategoriesResponse.data
          : [],
      }
    } catch (error) {
      console.log('error', error)
      return { gameDetails: null, gameCategories: [] }
    }
  },
  })

export const Route = createFileRoute(
  '/_authenticated/admin/trainingwheelgame/edit/$gameID'
)({
  component: RouteComponent,
  loader:({params}) => queryClient.ensureQueryData(gameQueryOptions(params))
})

function RouteComponent() {
  const searchParams = useParams({from:'/_authenticated/admin/trainingwheelgame/edit/$gameID'});
  console.log('searchParams ===>',searchParams)
  const params = {gameID:searchParams.gameID};
  const { data } = useSuspenseQuery(gameQueryOptions(params))
  const {gameDetails,gameCategories} = data;
  console.log('gameDetails ===>',gameDetails);
  const { gameID } = useParams({
    from: '/_authenticated/admin/trainingwheelgame/edit/$gameID',
  })
  const queryClient = useQueryClient();
 const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate()
  const [gameObj, setGameObj] = useState(gameDetails)
  const [errorMessage, setErrorMessage] = useState('')
  const {router} = useAppUtils()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setGameObj({ ...gameObj, [name]: value })
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage('')
  }
  
  const handleCheckboxes = (e) => {
    const { name, checked } = e.target
    let levelArr = [...gameObj.levels]
    if (!levelArr.includes(name) && checked) {
      levelArr.push(name)
    } else {
      levelArr = levelArr.filter((l) => l !== name)
    }
    console.log('Level Array: ', levelArr)
    setGameObj({ ...gameObj, levels: levelArr })
    // Clear error message when user interacts with levels
    if (errorMessage) setErrorMessage('')
  }

  const isSaveButtonDisabled = () => {
    if (!gameObj.question || !gameObj.answer || gameObj.levels?.length == 0 || !gameObj.category) {
      return true
    } else {
      return false
    }
  }

  const updateQuestion = useCallback(async () => {
    const { question, answer, category, levels } = gameObj
    setIsLoading(true)
    setErrorMessage('') // Clear previous errors
    
    // Validate
    if (question.trim() === '') {
      setErrorMessage('Question is required!')
      setIsLoading(false)
      return
    } else if (answer.trim() === '') {
      setErrorMessage('Answer is required!')
      setIsLoading(false)
      return
    } else if (answer.split(' ').length < 6) {
      setErrorMessage(
        "We'll break answer into 6 words, so sentence should have atleast 6 words"
      )
      setIsLoading(false)
      return
    } else if (category.trim() === '') {
      setErrorMessage('Category is required!')
      setIsLoading(false)
      return
    } else if (levels.length === 0) {
      setErrorMessage('At least provide one level!')
      setIsLoading(false)
      return
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
      let response = await axios.put(
        `/admin/game/training-wheel-game/update/${gameID}`,
        reqBody
      )
      response = response.data
      if (response.success) {
        router.invalidate();
        await queryClient.invalidateQueries(gameQueryOptions(params))
        toast.success(response.message);
        navigate({ to: '/admin/trainingwheelgame' });
      }
    } catch (error) {
      console.log('error ===>', error)
      const errorResponse = error.response.data
      toast.error(errorResponse.message)
      setErrorMessage(errorResponse.message || 'An error occurred while updating the question')
    }finally{
      router.invalidate();
      setIsLoading(false);
    }
  }, [gameObj, axios, gameID, toast,router,queryClient,gameQueryOptions,params])

  console.log('gameObj ===>', gameObj)
  
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <Header className="bg-white border-b border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="relative z-10 my-4 flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
              Update Game Question
            </div>
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-[#2563eb]/20 to-[#1d4ed8]/20"></div>
            <div className="hidden sm:flex items-center gap-2 text-[#2563eb]">
              <GamepadIcon size={20} />
              <span className="text-sm font-medium">Training Wheel Game</span>
            </div>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 text-[#2563eb] group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="ml-2 hidden sm:inline">Back</span>
          </Button>
        </div>
      </Header>

      <div className="relative z-10 mx-4 mb-8 max-w-4xl mx-auto">
        <Card className="group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <CardContent className="relative z-10 p-8 space-y-8">
            {/* Question Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-[#2563eb]" />
                </div>
                <Label className="text-xl font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  Question
                </Label>
              </div>
              <div className="relative group">
                <Textarea
                  name="question"
                  value={gameObj?.question || ''}
                  onChange={handleChange}
                  placeholder="Enter your training wheel game question here..."
                  className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
                <div className="absolute bottom-3 right-3 text-xs text-[#64748b]">
                  {gameObj?.question?.length || 0} characters
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-lg">
                  <Target className="w-6 h-6 text-[#2563eb]" />
                </div>
                <div className="flex-1">
                  <Label className="text-xl font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                    Answer
                  </Label>
                  <p className="text-sm text-[#64748b] mt-1 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#f59e0b]" />
                    Answer will be broken into 6 words, so provide at least 6 words
                  </p>
                </div>
              </div>
              <div className="relative group">
                <Textarea
                  name="answer"
                  value={gameObj?.answer || ''}
                  onChange={handleChange}
                  placeholder="Enter the complete answer (minimum 6 words)..."
                  className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
                <div className="absolute bottom-3 right-3 text-xs text-[#64748b]">
                  {gameObj?.answer?.split(' ').length || 0} words
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-lg">
                    <Tag className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                    Category
                  </Label>
                </div>
                <div className="relative group">
                  <Select
                    value={gameObj?.category || ''}
                    onValueChange={(value) => {
                      setGameObj((prevState) => ({
                        ...prevState,
                        category: value,
                      }));
                      if (errorMessage) setErrorMessage('');
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#e2e8f0] shadow-sm rounded-[8px]">
                      <SelectGroup>
                        {gameCategories?.length > 0 &&
                          gameCategories.map((category) => (
                            <SelectItem value={category._id} key={category._id} className="text-[#1e293b] hover:bg-[#f8fafc] rounded-lg">
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
                </div>
              </div>

              {/* Difficulty Levels Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-lg">
                    <Layers className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                    Difficulty Levels
                  </Label>
                </div>
                <p className="text-sm text-[#64748b] mb-4">Select the difficulty levels where this question should appear:</p>
                
                <div className="space-y-3">
                  {[
                    { name: 'beginner', label: 'Beginner', color: 'from-[#10b981]/10 to-[#059669]/10 border-[#10b981]/20', textColor: 'text-[#10b981]' },
                    { name: 'intermediate', label: 'Intermediate', color: 'from-[#f59e0b]/10 to-[#d97706]/10 border-[#f59e0b]/20', textColor: 'text-[#f59e0b]' },
                    { name: 'expert', label: 'Expert', color: 'from-[#ef4444]/10 to-[#dc2626]/10 border-[#ef4444]/20', textColor: 'text-[#ef4444]' }
                  ].map((level) => (
                    <div key={level.name} className={`flex items-center gap-3 p-3 rounded-[8px] bg-gradient-to-r ${level.color} border hover:shadow-sm transition-all duration-300`}>
                      <Input
                        type="checkbox"
                        id={level.name}
                        name={level.name}
                        className="h-5 w-5 rounded focus:ring-2 focus:ring-[#2563eb]"
                        checked={gameObj?.levels?.includes(level.name) || false}
                        onChange={handleCheckboxes}
                      />
                      <Label htmlFor={level.name} className={`font-medium cursor-pointer ${level.textColor} flex-1`}>
                        {level.label}
                      </Label>
                      {gameObj?.levels?.includes(level.name) && (
                        <CheckCircle className="w-5 h-5 text-[#10b981]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-[#fef2f2] border border-[#ef4444]/20 rounded-[8px] p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ef4444] flex-shrink-0" />
                <ErrorText className="text-[#ef4444] m-0">{errorMessage}</ErrorText>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#e2e8f0]">
              <div className="text-sm text-[#64748b]">
                Make sure to fill all required fields before saving
              </div>
              <Button
                size="lg"
                onClick={updateQuestion}
                disabled={isSaveButtonDisabled() || isLoading}
                className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
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