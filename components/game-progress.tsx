import { CheckCircle2, Circle, Terminal, AlertCircle } from "lucide-react"

interface GameProgressProps {
  level: number
  progress: number
  moneyToNextLevel: number
}

export function GameProgress({ level, progress, moneyToNextLevel }: GameProgressProps) {
  const steps = [
    { name: "Iniciante", description: "Primeiros passos com IA" },
    { name: "Aprendiz", description: "Criando conteúdo básico" },
    { name: "Intermediário", description: "Automatizando processos" },
    { name: "Avançado", description: "Monetizando seus conhecimentos" },
    { name: "Especialista", description: "Negócios completos com IA" },
  ]

  return (
    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 text-green-400 mr-2" />
          <h3 className="text-green-400 font-mono">Progresso_Sistema.log</h3>
        </div>

        {level < 5 && (
          <div className="flex items-center text-xs text-green-400/70 font-mono">
            <AlertCircle className="h-3 w-3 mr-1 text-yellow-400" />
            <span>Próximo nível: +R$ {moneyToNextLevel.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {level < 5 && (
        <div className="w-full bg-gray-800 h-2 rounded-full mb-4 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-800"></div>
        </div>

        <ul className="relative flex justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative flex flex-col items-center">
              <div className="flex items-center justify-center">
                {stepIdx < level ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500 bg-gray-900 rounded-full p-1" />
                ) : stepIdx === level - 1 ? (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-green-500 bg-gray-900 text-green-500 font-mono">
                    {level}
                  </div>
                ) : (
                  <Circle className="h-8 w-8 text-gray-600 bg-gray-900 rounded-full p-1" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-mono ${stepIdx < level ? "text-green-500" : stepIdx === level - 1 ? "text-green-400" : "text-gray-600"}`}
                >
                  {step.name}
                </div>
                <div
                  className={`text-[10px] font-mono ${stepIdx < level ? "text-green-400/80" : stepIdx === level - 1 ? "text-green-400/80" : "text-gray-600/50"}`}
                >
                  {step.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
