import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import QuestionBox from './QuestionBox';
import Timer from './Timer';
import { Show } from '@/shared/utils/Show';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShieldQuestion, Stars, Trophy, X, Target, Zap, Clock, Award, Sparkles } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const Game = ({ handleScoreCard, selectedLevel }) => {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [ques, setQues] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);
  const [rNo1, setRno1] = useState(null);
  const [rNo2, setRno2] = useState(null);
  const [rNo3, setRno3] = useState(null);
  const [rNo4, setRno4] = useState(null);
  const [rNo5, setRno5] = useState(null);
  const [rNo6, setRno6] = useState(null);

  const getThemeColors = () => {
    if (selectedLevel === "admin") {
      return {
        gradient: "from-[#10b981] to-[#059669]", // Admin: Green gradient
        icon: "text-[#10b981]", // Admin: Green icon
      };
    } else if (selectedLevel === "teacher") {
      return {
        gradient: "from-[#ef4444] to-[#dc2626]", // Teacher: Red gradient
        icon: "text-[#ef4444]", // Teacher: Red icon
      };
    } else {
      return {
        gradient: "from-[#f59e0b] to-[#d97706]", // Student: Yellow gradient
        icon: "text-[#f59e0b]", // Student: Yellow icon
      };
    }
  };

  const themeColors = getThemeColors();

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex < ques.length) {
      setIndex(nextIndex);
      setCurrentQuestion(ques[nextIndex]);
      setIsTimerRunning(true);
    } else {
      setShowSubmitBtn(true);
    }
  };

  const handleCloseIncorrectModal = () => {
    setShowIncorrectModal(false);
    next();
  };

  const validate = useCallback(
    ({ timeup = false }) => {
      const answeredChunksArr = [rNo1, rNo2, rNo3, rNo4, rNo5, rNo6];
      const chunkedAnswerStr = answeredChunksArr
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      const normalizedAnswer = currentQuestion?.answer
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (chunkedAnswerStr === normalizedAnswer && !timeup) {
        setIsTimerRunning(false);
        toast.success('Correct answer!', {
          description: "You've earned a point!",
          icon: <Sparkles size={24} className={themeColors.icon} />,
        });
        setScore(prev => prev + 1);
        if (index === ques.length - 1) {
          setShowSubmitBtn(true);
        } else {
          next();
        }
      } else {
        setIsTimerRunning(false);
        setShowIncorrectModal(true);
      }
    },
    [rNo1, rNo2, rNo3, rNo4, rNo5, rNo6, currentQuestion, index, ques]
  );

  const getQuestions = useCallback(async () => {
    try {
      const response = await axios.get(
        `/student/game/training-wheel-game/get?level=${selectedLevel}`,
        { skipInterceptors: true }
      );
      const data = response.data;
      if (data.success) {
        setQues(data.data);
        setCurrentQuestion(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch questions. Please try again later.");
    }
  }, [selectedLevel]);

  const submit = useCallback(async () => {
    try {
      const response = await axios.post("/student/game/training-wheel-game/submit", {
        score,
        difficultyLevel: selectedLevel
      });
      if (response.data.success) {
        handleScoreCard(ques.length, score);
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error(error.response?.data?.message || "Failed to submit score.");
    }
  }, [score, selectedLevel, ques, handleScoreCard]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage = 'Are you sure you want to leave this page? Your progress will be lost.';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const progressValue = ques.length > 0 ? ((index + 1) / ques.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6 ">
      <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] overflow-hidden max-w-7xl mx-auto'>
        <Show>
          <Show.When isTrue={currentQuestion !== null}>
            <div className="bg-[#ffffff] p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
                  <div className='p-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-[12px] shadow-lg'>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  Training Wheel Challenge
                </h1>
                <p className='text-[#64748b] text-lg'>Test your knowledge and earn points!</p>
                <div className='w-24 h-1 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mx-auto mt-4'></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-4 hover:shadow-lg transition-all duration-300 group'>
                  <div className='flex items-center justify-center gap-3'>
                    <div className='p-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-[8px] group-hover:shadow-lg transition-all duration-300'>
                      <Stars className="w-5 h-5 text-white" />
                    </div>
                    <div className='text-center'>
                      <p className="text-sm text-[#64748b] font-medium">Level</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                        {selectedLevel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-4 hover:shadow-lg transition-all duration-300 group'>
                  <div className='flex items-center justify-center gap-3'>
                    <div className='p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-[8px] group-hover:shadow-lg transition-all duration-300'>
                      <ShieldQuestion className="w-5 h-5 text-white" />
                    </div>
                    <div className='text-center'>
                      <p className="text-sm text-[#64748b] font-medium">Question</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                        {index + 1} / {ques.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-4 hover:shadow-lg transition-all duration-300 group'>
                  <div className='flex items-center justify-center gap-3'>
                    <div className='p-2 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-[8px] group-hover:shadow-lg transition-all duration-300'>
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className='text-center'>
                      <p className="text-sm text-[#64748b] font-medium">Score</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
                        {score} pts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-8 mb-8'>
                <div className='text-center mb-8'>
                  <div className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-[8px] shadow-lg mb-6'>
                    <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>{index + 1}</span>
                    </div>
                    <span className='text-white font-semibold'>Current Question</span>
                  </div>
                  <h2 className='text-3xl md:text-4xl font-bold text-[#1e293b] leading-relaxed max-w-4xl mx-auto'>
                    {currentQuestion?.question}
                  </h2>
                </div>

                <div className='w-full h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent mb-8'></div>

                <div className="min-h-[300px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center items-center">
                  <QuestionBox words={currentQuestion?.answer_in_chunks} handleSelection={setRno1} />
                  <QuestionBox words={currentQuestion?.answer_in_chunks} handleSelection={setRno2} />
                  <QuestionBox words={currentQuestion?.answer_in_chunks} handleSelection={setRno3} />
                  <QuestionBox words={currentQuestion?.answer_in_chunks} handleSelection={setRno4} />
                  <QuestionBox words={currentQuestion?.answer_in_chunks} handleSelection={setRno5} />
                  <QuestionBox words={currentQuestion?.answer_in_chunks} handleSelection={setRno6} />
                </div>
              </div>

              <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-6'>
                <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
                  <div className="flex items-center gap-4 flex-1">
                    <div className='p-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-[8px] shadow-lg'>
                      <Progress className="w-5 h-5 text-white" />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className="font-semibold text-[#1e293b]">Progress</span>
                        <span className="text-sm font-medium text-[#64748b]">{Math.round(progressValue)}%</span>
                      </div>
                      <Progress
                        value={progressValue}
                        className="h-3 rounded-full bg-[#f1f5f9] [&>div]:bg-gradient-to-r [&>div]:from-[#2563eb] [&>div]:to-[#1d4ed8] [&>div]:shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className='p-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-[8px] shadow-lg'>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <Timer
                      level={selectedLevel}
                      validate={validate}
                      index={index}
                      isRunning={isTimerRunning}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Show>
                      <Show.When isTrue={showSubmitBtn}>
                        <Button
                          onClick={submit}
                        >
                          <Award className="w-5 h-5 mr-2" />
                          Submit Result
                        </Button>
                      </Show.When>
                      <Show.Else>
                        <Button
                          onClick={validate}
                          variant="secondary"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Next Question
                        </Button>
                      </Show.Else>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </Show.When>

          <Show.Else>
            <div className='min-h-[80vh] w-full flex flex-col justify-center items-center p-8'>
              <div className='bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-12 text-center max-w-2xl'>
                <div className='p-6 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-[12px] mb-8 mx-auto w-fit'>
                  <Target className="w-16 h-16 text-white" />
                </div>
                <img
                  src="/question-animation.gif"
                  className="h-[200px] w-[200px] md:h-[300px] md:w-[300px] rounded-[12px] shadow-lg mx-auto mb-8"
                  alt="Loading animation"
                  loading="lazy"
                />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-4">
                  Loading Your Challenge
                </h3>
                <p className="text-[#64748b] text-lg">
                  Preparing questions for Level {selectedLevel}...
                </p>
                <div className="mt-6">
                  <Progress
                    value={75}
                    className="h-2 rounded-full bg-[#f1f5f9] [&>div]:bg-gradient-to-r [&>div]:from-[#2563eb] [&>div]:to-[#1d4ed8]"
                  />
                </div>
              </div>
            </div>
          </Show.Else>
        </Show>
      </div>

      {showIncorrectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-8 text-center max-w-md w-full transform animate-in zoom-in-95 duration-300">
            <div className='p-4 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-[12px] mb-6 mx-auto w-fit'>
              <X className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent mb-4">
              Incorrect Answer!
            </h3>
            <p className="text-[#64748b] text-lg font-medium mb-8">
              Don't worry! You'll get the next question to continue your challenge.
            </p>
            <Button
              onClick={handleCloseIncorrectModal}
            >
              <Zap className="w-5 h-5 mr-2" />
              Continue Challenge
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;