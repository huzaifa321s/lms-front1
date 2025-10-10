import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Clock,
  Target,
  Award,
  Brain,
} from "lucide-react"
import dummyMcqs from "./dummyMcqs"

export const Quiz = () => {
  const [index, setIndex] = useState(0)
  const [mcq, setMcq] = useState(dummyMcqs[index])
  const [score, setScore] = useState(0)
  const [game, setGame] = useState(true)
  const [lock, setLock] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [questionAnimation, setQuestionAnimation] = useState(false)
  const [scoreAnimation, setScoreAnimation] = useState(false)

  useEffect(() => {
    setQuestionAnimation(true)
    const timer = setTimeout(() => setQuestionAnimation(false), 400)
    return () => clearTimeout(timer)
  }, [index])

  const checkAns = (selectedAnswer: string) => {
    if (!lock) {
      setSelectedOption(selectedAnswer)
      setLock(true)

      setTimeout(() => {
        setShowResult(true)
        if (mcq.answer === selectedAnswer) {
          setScore((score) => score + 1)
          setScoreAnimation(true)
          setTimeout(() => setScoreAnimation(false), 600)
        }
      }, 300)
    }
  }

  const next = () => {
    if (index < dummyMcqs.length - 1) {
      setIndex((index) => index + 1)
      setMcq(dummyMcqs[index + 1])
      setLock(false)
      setSelectedOption(null)
      setShowResult(false)
    } else {
      setGame(false)
    }
  }

  const restart = () => {
    setIndex(0)
    setMcq(dummyMcqs[0])
    setScore(0)
    setGame(true)
    setLock(false)
    setSelectedOption(null)
    setShowResult(false)
    setQuestionAnimation(false)
    setScoreAnimation(false)
  }

  const getOptionStyle = (option: string) => {
    const baseStyle =
      "p-5 rounded-2xl border-2 flex items-center justify-between font-medium transition-all duration-300 transform"

    if (!showResult) {
      return `${baseStyle} bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 hover:scale-[1.02] cursor-pointer hover:shadow-md`
    }

    if (option === mcq.answer) {
      return `${baseStyle} bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-md scale-[1.01]`
    } else if (option === selectedOption && option !== mcq.answer) {
      return `${baseStyle} bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800 shadow-md`
    } else {
      return `${baseStyle} bg-slate-50 border-slate-200 text-slate-500 opacity-60`
    }
  }

  const getOptionIcon = (option: string) => {
    if (!showResult) return null

    if (option === mcq.answer) {
      return <CheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
    } else if (option === selectedOption && option !== mcq.answer) {
      return <XCircle className="w-6 h-6 text-red-600 animate-pulse" />
    }
    return null
  }

  const progressPercentage = ((index + 1) / dummyMcqs.length) * 100
  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 80) return "🎉"
    if (percentage >= 60) return "👏"
    if (percentage >= 40) return "👍"
    return "📚"
  }

  if (!game) {
    const scorePercentage = (score / dummyMcqs.length) * 100

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Heading */}
        <div className="mb-8 w-full max-w-3xl">
          <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-slate-800 ">
              Dummy MCQs Quiz
              <span className="ml-3 inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                <Brain className="w-4 h-4 mr-1" /> Test Your Knowledge
              </span>
            </h1>
          </div>
        </div>

        {/* Results */}
        <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
          <CardContent className="p-12 text-center">
            <div className="mb-10">
              <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <Trophy className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Quiz Complete! {getScoreEmoji(scorePercentage)}
              </h1>
              <p className="text-lg text-slate-600">
                Amazing work! You finished all questions.
              </p>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 mb-8 shadow-md border border-blue-100">
              <div className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
                {score}/{dummyMcqs.length}
              </div>
              <p className="text-base text-slate-600 flex items-center justify-center gap-2 mb-4">
                <Target className="w-5 h-5" />
                Final Score
              </p>
              <Progress value={scorePercentage} className="h-3" />
              <div className="flex justify-center gap-4 mt-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {scorePercentage.toFixed(0)}% Accuracy
                </span>
                {scorePercentage >= 80 && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    ⭐ Excellence!
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={restart}
              
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Heading */}
      <div className="mb-8 w-full max-w-4xl">
        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-slate-800 ">
            Dummy MCQs Quiz
            <span className="ml-2 inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              <Brain className="w-4 h-4 mr-1" /> Test Your Knowledge
            </span>
          </h1>
        </div>
      </div>

      {/* Quiz Card */}
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quiz Challenge
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-full shadow border">
                <Clock className="w-4 h-4 inline mr-1" />
                {index + 1} / {dummyMcqs.length}
              </div>
              <div
                className={`text-lg font-bold text-blue-600 bg-white px-4 py-2 rounded-full shadow border transition-all duration-300 ${
                  scoreAnimation ? "scale-110 bg-green-100" : ""
                }`}
              >
                Score: {score}
              </div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="text-xs text-slate-500 text-right mt-1">
            {progressPercentage.toFixed(0)}% Complete
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          {/* Question */}
          <h2
            className={`text-2xl font-semibold text-slate-800 mb-8 transition-all duration-500 ${
              questionAnimation
                ? "opacity-0 translate-x-4"
                : "opacity-100 translate-x-0"
            }`}
          >
            <span className="text-blue-600 font-bold">Q{index + 1}:</span>{" "}
            {mcq.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {[mcq.option1, mcq.option2, mcq.option3, mcq.option4].map(
              (option, i) => (
                <div
                  key={i}
                  onClick={() => checkAns(option)}
                  className={`${getOptionStyle(option)} ${
                    !lock && !questionAnimation ? "" : "pointer-events-none"
                  }`}
                >
                  <span className="text-lg">{option}</span>
                  {getOptionIcon(option)}
                </div>
              )
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t mt-10">
            <span className="flex items-center gap-2 text-slate-600">
              <Target className="w-5 h-5" />
              Progress:{" "}
              <span className="font-bold text-blue-600">
                {index + 1}/{dummyMcqs.length}
              </span>
            </span>

            <Button
              onClick={next}
              disabled={!lock}
              
            >
              {index === dummyMcqs.length - 1 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Finish Quiz
                </>
              ) : (
                "Next →"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
