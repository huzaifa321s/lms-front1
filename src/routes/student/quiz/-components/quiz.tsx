import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Trophy, RotateCcw, Clock, Target, Award, Brain } from "lucide-react"
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

  // Animate question transitions
  useEffect(() => {
    setQuestionAnimation(true)
    const timer = setTimeout(() => setQuestionAnimation(false), 500)
    return () => clearTimeout(timer)
  }, [index])

  // Validate answer
  const checkAns = (selectedAnswer) => {
    if (!lock) {
      setSelectedOption(selectedAnswer)
      setLock(true)
      
      // Show result with slight delay for better UX
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

  // Next Question
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

  // Restart Quiz
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

  const getOptionStyle = (option) => {
    const baseStyle = "p-5 rounded-xl border-2 flex items-center justify-between font-medium transition-all duration-300 transform"
    
    if (!showResult) {
      return `${baseStyle} bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 hover:scale-[1.02] cursor-pointer hover:shadow-lg`
    }

    if (option === mcq.answer) {
      return `${baseStyle} bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-lg scale-[1.02]`
    } else if (option === selectedOption && option !== mcq.answer) {
      return `${baseStyle} bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800 shadow-lg`
    } else {
      return `${baseStyle} bg-slate-50 border-slate-200 text-slate-500 opacity-60`
    }
  }

  const getOptionIcon = (option) => {
    if (!showResult) return null

    if (option === mcq.answer) {
      return <CheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
    } else if (option === selectedOption && option !== mcq.answer) {
      return <XCircle className="w-6 h-6 text-red-600 animate-pulse" />
    }
    return null
  }

  const progressPercentage = ((index + 1) / dummyMcqs.length) * 100
  const getScoreEmoji = (percentage) => {
    if (percentage >= 80) return "🎉"
    if (percentage >= 60) return "👏"
    if (percentage >= 40) return "👍"
    return "📚"
  }

  if (!game) {
    const scorePercentage = (score / dummyMcqs.length) * 100

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Dummy MCQs Heading */}
        <div className="mb-6 w-full max-w-2xl">
          <div className="bg-white/90 border-2 border-slate-200 rounded-xl shadow-lg p-6 text-center backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-slate-800 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
              Dummy MCQs Practice Quiz
              <span className="ml-2 inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Brain className="w-4 h-4 inline mr-1" /> Test Your Knowledge
              </span>
            </h1>
          </div>
        </div>

        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-in fade-in duration-700">
          <CardContent className="p-12 text-center">
            <div className="mb-8 animate-in zoom-in duration-500">
              <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <Trophy className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Quiz Complete! {getScoreEmoji(scorePercentage)}
              </h1>
              <p className="text-xl text-slate-600 mb-8">Amazing work! You've completed the challenge!</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 mb-8 shadow-lg border border-blue-100 animate-in slide-in-from-bottom duration-700">
              <div className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-pulse">
                {score}/{dummyMcqs.length}
              </div>
              <p className="text-lg text-slate-600 mb-4 flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                Final Score
              </p>
              <div className="w-full bg-slate-200 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-2000 ease-out shadow-lg"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-slate-600">
                  <Award className="w-4 h-4" />
                  <span>{scorePercentage.toFixed(0)}% Accuracy</span>
                </div>
                {scorePercentage >= 80 && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    ⭐ Excellence!
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={restart}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-3" />
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Dummy MCQs Heading */}
      <div className="mb-6 w-full max-w-4xl">
        <div className="bg-white/90 border-2 border-slate-200 rounded-xl shadow-lg p-6 text-center backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-slate-800 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
            Dummy MCQs Practice Quiz
            <span className="ml-2 inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <Brain className="w-4 h-4 inline mr-1" /> Test Your Knowledge
            </span>
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quiz Challenge
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-full shadow-md border">
                <Clock className="w-4 h-4 inline mr-1" />
                Question {index + 1} of {dummyMcqs.length}
              </div>
              <div className={`text-lg font-bold text-blue-600 bg-white px-4 py-2 rounded-full shadow-md border transition-all duration-300 ${scoreAnimation ? 'scale-110 bg-green-100' : ''}`}>
                Score: {score}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3 bg-slate-200" />
            <div className="text-xs text-slate-500 text-right">
              {progressPercentage.toFixed(0)}% Complete
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          <div className="mb-10">
            <h2 className={`text-2xl font-semibold text-slate-800 leading-relaxed mb-8 transition-all duration-500 ${questionAnimation ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
              <span className="text-blue-600 font-bold">Q.{index + 1}</span> {mcq.question}
            </h2>

            <div className="space-y-4">
              {[mcq.option1, mcq.option2, mcq.option3, mcq.option4].map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  onClick={() => checkAns(option)}
                  className={`${getOptionStyle(option)} ${!lock && !questionAnimation ? "" : "pointer-events-none"}`}
                  style={{
                    animationDelay: `${optionIndex * 100}ms`
                  }}
                >
                  <span className="text-lg">{option}</span>
                  {getOptionIcon(option)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="text-lg">Progress: <span className="font-bold text-blue-600">{index + 1}/{dummyMcqs.length}</span></span>
              </div>
            </div>

            <Button
              onClick={next}
              disabled={!lock}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-400 text-white px-10 py-3 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              {index === dummyMcqs.length - 1 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Finish Quiz
                </>
              ) : (
                "Next Question →"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}