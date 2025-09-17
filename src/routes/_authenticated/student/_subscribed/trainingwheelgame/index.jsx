import { useState } from "react"
import axios from "axios"
import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useSearch } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import Game from "./-components/Game"
import ScoreCard from "./-components/ScoreCard"
import StartGame from "./-components/StartGame"

const queryClient = new QueryClient()
const gameQueryOptions = (selectedLevel) =>
  queryOptions({
    queryKey: ["game"],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/student/game/training-wheel-game/get?level=${selectedLevel}`,
          { skipInterceptors: true }
        )
        response = response.data
        if (response.success) {
          return { questions: response.data, currentQuestion: response.data[0] }
        }
      } catch (error) {
        console.log("Error:", error)
        return { questions: [], currentQuestion: [] }
      }
    },
  })

export const Route = createFileRoute(
  "/_authenticated/student/_subscribed/trainingwheelgame/"
)({
  validateSearch: (search) => {
    return { selectedLevel: search.selectedLevel || "" }
  },
  loaderDeps: ({ search }) => {
    return { selectedLevel: search.selectedLevel }
  },
  component: RouteComponent,
  loader: ({ params }) =>
    queryClient.ensureQueryData(gameQueryOptions(params.selectedLevel)),
})

function RouteComponent() {
  const [step, setStep] = useState("start-game")
  const selectedLevel = useSearch({
    from: "/_authenticated/student/_subscribed/trainingwheelgame/",
    select: (search) => search.selectedLevel || "",
  })
  const { data } = useSuspenseQuery(
    gameQueryOptions({ selectedLevel: selectedLevel })
  )
  const [scoreCard, setScoreCard] = useState({ score: 0, questionCount: 0 })

  // Show score card
  const handleScoreCard = (totalQuestions, score = 0) => {
    setScoreCard({ totalQuestions, score, difficultyLevel: selectedLevel })
    setStep("score-card")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                       bg-clip-text text-3xl font-bold tracking-tight text-transparent 
                       drop-shadow-sm md:text-4xl">
          Training Wheel Game
        </h1>
      </Header>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-8">
        <Card
          className="bg-white border border-slate-200 rounded-xl shadow-lg 
                     hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          {/* Subtle gradient background */}
          <div className="relative min-h-[70vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-indigo-50/30 pointer-events-none" />

            {/* Game Steps */}
            <div className="relative z-10 p-8">
              {step === "start-game" && (
                <div className="animate-fade-in">
                  <StartGame setStep={setStep} selectedLevel={selectedLevel} />
                </div>
              )}
              {step === "game" && (
                <div className="animate-fade-in">
                  <Game
                    selectedLevel={selectedLevel}
                    setStep={setStep}
                    handleScoreCard={handleScoreCard}
                  />
                </div>
              )}
              {step === "score-card" && (
                <div className="animate-fade-in">
                  <ScoreCard scoreCard={scoreCard} setStep={setStep} />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
