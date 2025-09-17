import { useCallback, useState } from 'react';
import axios from 'axios';
import {
  QueryClient,
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  createFileRoute,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { Main } from '@/components/layout/main';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorText from '../../../../../shared/components/typography/errorText';
import { createNewSentenceArray } from '../../../../../shared/utils/helperFunction';
import { useAppUtils } from '../../../../../hooks/useAppUtils';
import { Layers, Tag, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const queryClient = new QueryClient();

const createGameQueryOptions = () =>
  queryOptions({
    queryKey: ['game-category'],
    queryFn: async () => {
      try {
        let gameCategoriesResponse = await axios.get('/teacher/game-category/getAll');
        gameCategoriesResponse = gameCategoriesResponse.data;
        return {
          gameCategories: gameCategoriesResponse.success
            ? gameCategoriesResponse.data
            : [],
        };
      } catch (error) {
        console.log('error', error);
        return { gameCategories: [] };
      }
    },
  });

export const Route = createFileRoute('/_authenticated/teacher/trainingwheelgame/create/')({
  loader: () => queryClient.ensureQueryData(createGameQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data, fetchStatus } = useSuspenseQuery(createGameQueryOptions());
  const { gameCategories } = data;
  const [isLoading, setIsLoading] = useState(false);
  const [isAddNewButtonLoading, setIsAddNewButtonLoading] = useState(false);
  const { navigate } = useAppUtils();
  const queryClient = useQueryClient();

  const TEMPLATE_OBJ = {
    question: '',
    answer: '',
    category: '',
    levels: ['beginner'],
  };

  const [gameObj, setGameObj] = useState(TEMPLATE_OBJ);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setGameObj((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  }, [errorMessage]);

  const handleCheckboxes = useCallback((e) => {
    const { name, checked } = e.target;
    let levelArr = [...gameObj.levels];

    if (!levelArr.includes(name) && checked) {
      levelArr.push(name);
    } else {
      levelArr = levelArr.filter((l) => l !== name);
    }
    console.log('Level Array: ', levelArr);
    setGameObj((prev) => ({ ...prev, levels: levelArr }));
    if (errorMessage) setErrorMessage('');
  }, [gameObj.levels, errorMessage]);

  const isAddButtonDisabled = useCallback(() => {
    return (
      !gameObj.question ||
      !gameObj.answer ||
      !gameObj.category ||
      gameObj.levels.length === 0
    );
  }, [gameObj]);

  const addQuestion = useCallback(
    async (action = 'add') => {
      const { question, answer, category, levels } = gameObj;

      if (question.trim() === '') {
        return setErrorMessage('Question is required!');
      } else if (answer.trim() === '') {
        return setErrorMessage('Answer is required!');
      } else if (answer.split(' ').length < 6) {
        return setErrorMessage(
          "We'll break answer into 6 words, so sentence should have at least 6 words"
        );
      } else if (category.trim() === '') {
        return setErrorMessage('Category is required!');
      } else if (levels.length === 0) {
        return setErrorMessage('At least provide one level!');
      }

      action === 'add' ? setIsLoading(true) : action === 'add-and-new' ? setIsAddNewButtonLoading(true) : null;

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
        let response = await axios.post('/teacher/game/training-wheel-game/create', reqBody);
        response = response.data;
        if (response.success) {
          await queryClient.invalidateQueries(createGameQueryOptions());
          toast.success(response.message);
          if (action === 'add') {
            navigate({ to: '/teacher/trainingwheelgame' });
          }
          if (action === 'add-and-new') {
            setGameObj(TEMPLATE_OBJ);
            setErrorMessage('');
          }
        }
      } catch (error) {
        console.log('error', error);
        const errorResponse = error.response.data;
        toast.error(errorResponse.message);
        setErrorMessage(errorResponse.message);
      } finally {
        setIsLoading(false);
        setIsAddNewButtonLoading(false);
      }
    },
    [gameObj, TEMPLATE_OBJ, navigate, queryClient]
  );

  return (
  <div className="min-h-screen font-sans bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f1f5f9] relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <Header className="bg-white border-b border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="relative z-10 my-4 flex w-full items-center justify-between max-w-7xl mx-auto px-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
            Add Game Question
          </div>
          <Button
            size="lg"
            variant="outline"
            className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#475569] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </Header>

      <Main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-500 p-6">
          <CardContent className="relative z-10 space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold flex items-center gap-2 text-[#1e293b]">
                <Tag className="w-5 h-5 text-[#2563eb]" /> Question
              </Label>
              <Textarea
                name="question"
                value={gameObj.question}
                onChange={handleChange}
                placeholder="Enter your training wheel game question here..."
                className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold flex items-center gap-2 text-[#1e293b]">
                <Tag className="w-5 h-5 text-[#f59e0b]" /> Answer
              </Label>
              <p className="text-sm text-[#64748b] flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                Answer will be broken into 6 words (minimum 6 words required)
              </p>
              <Textarea
                name="answer"
                value={gameObj.answer}
                onChange={handleChange}
                placeholder="Enter the complete answer (minimum 6 words)..."
                className="min-h-[120px] rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Category & Levels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-lg font-semibold flex items-center gap-2 text-[#1e293b]">
                  <Tag className="w-5 h-5 text-[#2563eb]" /> Category
                </Label>
                <Select
                  value={gameObj.category}
                  onValueChange={(value) => setGameObj((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-12 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e2e8f0] text-[#1e293b]">
                    <SelectGroup>
                      {fetchStatus === 'fetching' ? (
                        <Skeleton className="w-full h-8 bg-[#f1f5f9]" />
                      ) : (
                        gameCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id} className="hover:bg-[#f1f5f9] text-[#1e293b]">
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold flex items-center gap-2 text-[#1e293b]">
                  <Layers className="w-5 h-5 text-[#f59e0b]" /> Difficulty Levels
                </Label>
                <div className="flex gap-4">
                  {[
                    { name: 'beginner', label: 'Beginner', color: 'from-[#10b981] to-[#059669]', borderColor: 'border-[#10b981]', textColor: 'text-[#10b981]' },
                    { name: 'intermediate', label: 'Intermediate', color: 'from-[#f59e0b] to-[#d97706]', borderColor: 'border-[#f59e0b]', textColor: 'text-[#f59e0b]' },
                    { name: 'expert', label: 'Expert', color: 'from-[#ef4444] to-[#dc2626]', borderColor: 'border-[#ef4444]', textColor: 'text-[#ef4444]' },
                  ].map((lvl) => (
                    <Label key={lvl.name} className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        checked={gameObj.levels.includes(lvl.name)}
                        name={lvl.name}
                        onChange={handleCheckboxes}
                        className="h-4 w-4 rounded focus:ring-2 focus:ring-[#2563eb]"
                      />
                      <span className={`font-medium ${lvl.textColor}`}>{lvl.label}</span>
                      {gameObj.levels.includes(lvl.name) && <CheckCircle className="w-4 h-4 text-[#10b981]" />}
                    </Label>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444] rounded-[8px] p-3 flex items-center gap-2">
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
                  className="rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => addQuestion('add')}
                  disabled={isAddButtonDisabled() || isLoading}
                >
                  {isLoading ? 'Saving...' : 'Add'}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#475569] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => addQuestion('add-and-new')}
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
  );
}
