import React from "react"
import { ThumbsUp, Medal, Laptop, Smile, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { featureData } from "./partenerData"
import { useNavigate } from "@tanstack/react-router"

const icons = { ThumbsUp, Medal, Laptop, Smile }

const Feature = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
          {featureData.map((item, index) => {
            const Icon = icons[item.icon]
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm hover:shadow-xl transition duration-500"
              >
                {/* Icon box */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 text-violet-600">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-violet-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 mt-3 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/student/blogs/blog-details/234" })}
                      className="inline-flex items-center gap-2 text-violet-600 hover:gap-3 transition-all"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Feature
