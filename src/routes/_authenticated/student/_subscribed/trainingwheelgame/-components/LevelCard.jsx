import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useNavigate } from "@tanstack/react-router"
import { IconArrowRight, IconCircleCheck } from "@tabler/icons-react"

export default function LevelCard({ level, setStep, selectedLevel }) {
  const navigate = useNavigate()

  const getThemeColors = () => {
    if (level.title === "admin") {
      return {
        gradient: "from-[#10b981] to-[#059669]", // Admin: Green gradient
        ring: "ring-[#10b981]", // Admin: Green ring
        icon: "text-[#10b981]", // Admin: Green icon
      }
    } else if (level.title === "teacher") {
      return {
        gradient: "from-[#ef4444] to-[#dc2626]", // Teacher: Red gradient
        ring: "ring-[#ef4444]", // Teacher: Red ring
        icon: "text-[#ef4444]", // Teacher: Red icon
      }
    } else {
      return {
        gradient: "from-[#f59e0b] to-[#d97706]", // Student: Yellow gradient
        ring: "ring-[#f59e0b]", // Student: Yellow ring
        icon: "text-[#f59e0b]", // Student: Yellow icon
      }
    }
  }

  const themeColors = getThemeColors()

  return (
    <Card
      onClick={() =>
        navigate({
          to: "/student/trainingwheelgame",
          search: { selectedLevel: level.title },
        })
      }
      className={`relative flex flex-col items-center justify-center rounded-[12px] 
        mx-auto bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] 
        transition-all duration-300 cursor-pointer overflow-hidden font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]
        ${
          selectedLevel === level.title
            ? `scale-[1.03] shadow-lg ring-2 ${themeColors.ring} bg-[#ffffff]/90`
            : "hover:scale-[1.02] hover:shadow-lg hover:border-[#cbd5e1]"
        }`}
    >
      <CardHeader className="flex flex-col items-center p-4">
        <figure className="rounded-[12px] overflow-hidden border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
          <img
            src={`/images/${level.title}-level-game.png`}
            alt={`${level.title} Level`}
            className="rounded-[12px] object-cover w-full h-32 sm:h-40"
            loading="lazy"
          />
        </figure>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col items-center text-center p-4 pt-0">
        <h2
          className={`text-xl sm:text-2xl font-bold mb-3 capitalize bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
        >
          {level.title} Level
        </h2>

        <ul className="flex flex-col gap-2 text-left w-full">
          {level.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#64748b]">
              <span className={`${themeColors.icon}`}>
                <IconCircleCheck size={18} />
              </span>
              <span
                className={`${
                  selectedLevel === level.title ? "font-semibold text-[#1e293b]" : "text-[#64748b]"
                }`}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 w-full">
          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation()
              if (selectedLevel === level.title) setStep("game")
            }}
            disabled={selectedLevel !== level.title}
            className={`relative inline-flex h-11 items-center justify-center rounded-[8px] 
              font-medium text-white transition-all duration-300 w-full font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]
              ${
                selectedLevel === level.title
                  ? `bg-gradient-to-r ${themeColors.gradient} hover:scale-[1.03] hover:shadow-lg border-0`
                  : "bg-[#f1f5f9] text-[#475569] cursor-not-allowed opacity-70 hover:bg-[#e2e8f0]"
              }`}
          >
            <span className="flex items-center gap-2">
              Let’s Begin
              {selectedLevel === level.title && <IconArrowRight size={18} />}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}