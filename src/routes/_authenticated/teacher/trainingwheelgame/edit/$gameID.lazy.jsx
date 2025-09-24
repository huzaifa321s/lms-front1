
import { useCallback, useState } from 'react';
import axios from 'axios';
import {
  QueryClient,
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  useNavigate,
  useParams,
  createLazyFileRoute,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/header';
import ErrorText from '../../../../../shared/components/typography/errorText';
import { createNewSentenceArray } from '../../../../../shared/utils/helperFunction';
import { ArrowLeft, MessageSquare, Target, Tag, CheckCircle, Save, Layers, GamepadIcon, AlertTriangle } from 'lucide-react';

const queryClient = new QueryClient();

const editGameQueryOption = (params) =>
  queryOptions({
    queryKey: ['game', 'training-wheel-game', 'get-game', params.gameID],
    queryFn: async () => {
      try {
        console.log('params ===>', params);
        let gameDetailsResponse = await axios.get(
          `/teacher/game/training-wheel-game/get-game/${params.gameID}`
        );
        gameDetailsResponse = gameDetailsResponse.data;

        let game = gameDetailsResponse.data;

        const cArr = game.answer_in_chunks;
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
        };

        let gameCategoriesResponse = await axios.get('/teacher/game-category/getAll');
        gameCategoriesResponse = gameCategoriesResponse.data;
        return {
          gameDetails: gameDetailsResponse.success ? game : null,
          gameCategories: gameCategoriesResponse.success
            ? gameCategoriesResponse.data
            : [],
        };
      } catch (error) {
        console.log('error', error);
        return { gameDetails: null, gameCategories: [] };
      }
    },
  });

export const Route = createLazyFileRoute('/_authenticated/teacher/trainingwheelgame/edit/$gameID')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(editGameQueryOption(params)),
});

function RouteComponent() {
  const { gameID } = useParams({
    from: '/_authenticated/teacher/trainingwheelgame/edit/$gameID',
  });
  const { data } = useSuspenseQuery(editGameQueryOption({ gameID }));
  console.log('data ===>', data);
  const { gameDetails, gameCategories } = data;

  console.log('gameDetails ===>', gameDetails);

  const navigate = useNavigate();
  const [gameObj, setGameObj] = useState(gameDetails);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameObj({ ...gameObj, [name]: value });
    if (errorMessage) setErrorMessage('');
  };

  const handleCheckboxes = (e) => {
    const { name, checked } = e.target;
    let levelArr = [...gameObj.levels];
    if (!levelArr.includes(name) && checked) {
      levelArr.push(name);
    } else {
      levelArr = levelArr.filter((l) => l !== name);
    }
    console.log('Level Array: ', levelArr);
    setGameObj({ ...gameObj, levels: levelArr });
    if (errorMessage) setErrorMessage('');
  };

  const isSaveButtonDisabled = () => {
    return (
      !gameObj.question ||
      !gameObj.answer ||
      gameObj.levels?.length === 0 ||
      !gameObj.category ||
      isLoading
    );
  };

  const updateQuestion = useCallback(async () => {
    const { question, answer, category, levels } = gameObj;

    if (question.trim() === '') {
      setErrorMessage('Question is required!');
      return;
    } else if (answer.trim() === '') {
      setErrorMessage('Answer is required!');
      return;
    } else if (answer.split(' ').length < 6) {
      setErrorMessage("We'll break answer into 6 words, so sentence should have at least 6 words");
      return;
    } else if (category.trim() === '') {
      setErrorMessage('Category is required!');
      return;
    } else if (levels.length === 0) {
      setErrorMessage('At least provide one level!');
      return;
    }

    setIsLoading(true);
    let answerArr = answer.split(' ');
    if (answerArr.length !== 6) {
      answerArr = createNewSentenceArray(answerArr);
    }

    const reqBody = {
      question,
      answer,
      answer_in_chunks: answerArr,
      category,
      levels,
    };

    try {
      let response = await axios.put(
        `/teacher/game/training-wheel-game/update/${gameID}`,
        reqBody
      );
      response = response.data;
      if (response.success) {
        await queryClient.invalidateQueries(editGameQueryOption({ gameID }));
        await queryClient.invalidateQueries({ queryKey: ['teacher'] });
        toast.success(response.message);
        navigate({ to: '/teacher/trainingwheelgame' });
      }
    } catch (error) {
      console.log('error ===>', error);
      const errorResponse = error.response.data;
      toast.error(errorResponse.message);
      setErrorMessage(errorResponse.message || 'An error occurred while updating the question');
    } finally {
      setIsLoading(false);
    }
  }, [gameObj, gameID, queryClient, navigate, toast]);

  console.log('gameObj ===>', gameObj);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f1f5f9]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <Header >
        <div className="relative z-10 my-4 flex w-full items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
              Update Game Question
            </div>
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1]"></div>
            <div className="hidden sm:flex items-center gap-2 text-[#2563eb]">
              <GamepadIcon size={20} />
              <span className="text-sm font-medium">Training Wheel Game</span>
            </div>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#475569] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="ml-2 hidden sm:inline">Back</span>
          </Button>
        </div>
      </Header>

      <div className="relative z-10 mx-4 mb-8 max-w-4xl mx-auto">
        <Card className="group relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-8 space-y-8">
            {/* Question Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <Label className="text-xl font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  Question
                </Label>
              </div>
              <div className="relative">
                <Textarea
                  name="question"
                  value={gameObj?.question || ''}
                  onChange={handleChange}
                  placeholder="Enter your training wheel game question here..."
                  className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-[#94a3b8]">
                  {gameObj?.question?.length || 0} characters
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <Label className="text-xl font-semibold bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
                    Answer
                  </Label>
                  <p className="text-sm text-[#64748b] mt-1 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#f59e0b]" />
                    Answer will be broken into 6 words, so provide at least 6 words
                  </p>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  name="answer"
                  value={gameObj?.answer || ''}
                  onChange={handleChange}
                  placeholder="Enter the complete answer (minimum 6 words)..."
                  className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-[#94a3b8]">
                  {gameObj?.answer?.split(' ').length || 0} words
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-lg">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <Label className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                    Category
                  </Label>
                </div>
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
                  <SelectTrigger className="h-12 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e2e8f0] text-[#1e293b]">
                    <SelectGroup>
                      {gameCategories.length > 0 &&
                        gameCategories.map((category) => (
                          <SelectItem value={category._id} key={category._id} className="hover:bg-[#f1f5f9] text-[#1e293b]">
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Levels Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <Label className="text-lg font-semibold bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
                    Difficulty Levels
                  </Label>
                </div>
                <p className="text-sm text-[#64748b] mb-4">Select the difficulty levels where this question should appear:</p>
                <div className="space-y-3">
                  {[
                    { name: 'beginner', label: 'Beginner', color: 'from-[#10b981] to-[#059669]', borderColor: 'border-[#10b981]', textColor: 'text-[#10b981]' },
                    { name: 'intermediate', label: 'Intermediate', color: 'from-[#f59e0b] to-[#d97706]', borderColor: 'border-[#f59e0b]', textColor: 'text-[#f59e0b]' },
                    { name: 'expert', label: 'Expert', color: 'from-[#ef4444] to-[#dc2626]', borderColor: 'border-[#ef4444]', textColor: 'text-[#ef4444]' },
                  ].map((level) => (
                    <div key={level.name} className={`flex items-center gap-3 p-3 rounded-[8px] bg-gradient-to-r ${level.color} ${level.borderColor} border hover:shadow-sm transition-all duration-200`}>
                      <Input
                        type="checkbox"
                        id={level.name}
                        name={level.name}
                        className="h-5 w-5 rounded focus:ring-2 focus:ring-[#2563eb]"
                        checked={gameObj?.levels?.includes(level.name) || false}
                        onChange={handleCheckboxes}
                      />
                      <Label htmlFor={level.name} className={`font-medium cursor-pointer text-white flex-1`}>
                        {level.label}
                      </Label>
                      {gameObj?.levels?.includes(level.name) && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444] rounded-[8px] p-4 flex items-center gap-3">
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
                disabled={isSaveButtonDisabled()}
                className="rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
