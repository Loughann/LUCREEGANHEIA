"use client"

import { CheckCircle, Circle } from "lucide-react"

interface ProgressBarProps {
  currentStage: number
  totalStages: number
  completedStages: number[]
}

export function ProgressBar({ currentStage, totalStages, completedStages }: ProgressBarProps) {
  const stages = [
    { name: "Layout", description: "Estrutura da página" },
    { name: "Cores", description: "Esquema de cores" },
    { name: "Tipografia", description: "Fontes e textos" },
    { name: "Cabeçalho", description: "Estilo do topo" },
    { name: "Credibilidade", description: "Elementos de confiança" }, // Alterado de "Imagens" para "Credibilidade"
  ]

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-800"></div>
        </div>

        <ul className="relative flex justify-between">
          {stages.map((stage, index) => (
            <li key={stage.name} className="relative flex flex-col items-center">
              <div className="flex items-center justify-center">
                {completedStages.includes(index + 1) ? (
                  <CheckCircle className="h-8 w-8 text-green-500 bg-black rounded-full p-1" />
                ) : index + 1 === currentStage ? (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-green-500 bg-black text-green-500 font-mono">
                    {index + 1}
                  </div>
                ) : (
                  <Circle className="h-8 w-8 text-gray-600 bg-black rounded-full p-1" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-mono ${completedStages.includes(index + 1) ? "text-green-500" : index + 1 === currentStage ? "text-green-400" : "text-gray-600"}`}
                >
                  {stage.name}
                </div>
                <div
                  className={`text-[10px] font-mono ${completedStages.includes(index + 1) ? "text-green-400/80" : index + 1 === currentStage ? "text-green-400/80" : "text-gray-600/50"} hidden sm:block`}
                >
                  {stage.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
