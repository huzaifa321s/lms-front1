import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Medal, Award, RotateCcw, Home, Target } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

const ScoreCard = ({ scoreCard, setStep }) => {
  const { totalQuestions, score } = scoreCard
  const [partyPooper, setPartyPooper] = useState(false)
  const [scorePercentage, setScorePercentage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const scorePercent = (score / totalQuestions) * 100
    setScorePercentage(scorePercent)
    if (scorePercent >= 75) {
      setPartyPooper(true)
    }
  }, [score, totalQuestions])

  const getPerformanceLevel = () => {
    if (scorePercentage >= 90)
      return { level: "Excellent!", color: "from-[#10b981] to-[#059669]", icon: Medal }
    if (scorePercentage >= 75)
      return { level: "Great Job!", color: "from-[#2563eb] to-[#1d4ed8]", icon: Award }
    if (scorePercentage >= 50)
      return { level: "Good Effort!", color: "from-[#f59e0b] to-[#d97706]", icon: Trophy }
    return { level: "Keep Trying!", color: "from-[#ef4444] to-[#dc2626]", icon: Target }
  }

  const performance = getPerformanceLevel()
  const PerformanceIcon = performance.icon

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      {partyPooper && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          gravity={0.3}
          colors={["#2563eb", "#10b981", "#ef4444", "#f59e0b"]}
        />
      )}

      <div className="bg-white rounded-[12px] shadow-md border border-[#e2e8f0] overflow-hidden max-w-2xl w-full">
        {/* Header */}
        <div className="bg-white shadow px-8 py-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-xl shadow-md mb-6">
            <Star className="w-6 h-6 text-white fill-white" />
            <span className="text-white font-bold text-lg">Challenge Complete!</span>
          </div>

          <h1 className="text-4xl font-bold text-[#1e293b] mb-2">Your Results</h1>
          <p className="text-[#64748b]">Here’s how you performed</p>
        </div>

        {/* Score */}
        <div className="p-8">
          <div className="bg-white rounded-[12px] shadow-md border border-[#e2e8f0] p-8 mb-6">
            <div className="text-center">
              <div className={`inline-flex p-6 bg-gradient-to-r ${performance.color} rounded-full shadow-lg mb-6`}>
                <PerformanceIcon className="w-12 h-12 text-white" />
              </div>

              <div className="mb-6">
                <div className="text-7xl font-black text-[#1e293b] mb-2">{score}</div>
                <p className="text-xl font-medium text-[#64748b]">
                  out of <span className="text-[#1e293b] font-semibold">{totalQuestions}</span> questions
                </p>
              </div>

              <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${performance.color} rounded-lg shadow-md mb-6`}>
                <span className="text-white font-bold text-xl">{performance.level}</span>
              </div>

              <div className="bg-[#f1f5f9] rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#1e293b]">Accuracy</span>
                  <span className="font-bold text-2xl text-[#2563eb]">{Math.round(scorePercentage)}%</span>
                </div>
                <div className="w-full bg-[#e2e8f0] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${performance.color}`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-[12px] shadow-md border border-[#e2e8f0] p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] font-medium mb-1">Correct</p>
                  <p className="text-3xl font-bold text-[#10b981]">{score}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-md border border-[#e2e8f0] p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] font-medium mb-1">Incorrect</p>
                  <p className="text-3xl font-bold text-[#ef4444]">{totalQuestions - score}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setStep("game")}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setStep("start-game")}
            >
              <Home className="w-5 h-5 mr-2" />
              Main Menu
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f1f5f9] px-8 py-6 text-center border-t border-[#e2e8f0]">
          <p className="text-[#64748b] text-lg font-medium">
            {scorePercentage >= 90
              ? "Outstanding performance! You're a true champion!"
              : scorePercentage >= 75
              ? "Excellent work! Keep up the great momentum!"
              : scorePercentage >= 50
              ? "Good job! Practice makes perfect!"
              : "Don't give up! Every attempt makes you stronger!"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
