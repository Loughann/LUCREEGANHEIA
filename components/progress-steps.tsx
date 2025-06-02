import { CheckCircle, Circle } from "lucide-react"

interface ProgressStepsProps {
  currentStep: number
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { name: "Escolher Serviço", description: "Selecione o tipo de serviço" },
    { name: "Gerar Conteúdo", description: "Use o ChatGPT" },
    { name: "Entregar Serviço", description: "Envie para o cliente" },
    { name: "Receber Pagamento", description: "Ganhe dinheiro" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-800"></div>
        </div>

        <ul className="relative flex justify-between">
          {steps.map((step, index) => (
            <li key={step.name} className="relative flex flex-col items-center">
              <div className="flex items-center justify-center">
                {index < currentStep - 1 ? (
                  <CheckCircle className="h-8 w-8 text-green-500 bg-black rounded-full p-1" />
                ) : index === currentStep - 1 ? (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-green-500 bg-black text-green-500 font-mono">
                    {index + 1}
                  </div>
                ) : (
                  <Circle className="h-8 w-8 text-gray-600 bg-black rounded-full p-1" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-mono ${index < currentStep ? "text-green-500" : index === currentStep - 1 ? "text-green-400" : "text-gray-600"}`}
                >
                  {step.name}
                </div>
                <div
                  className={`text-[10px] font-mono ${index < currentStep ? "text-green-400/80" : index === currentStep - 1 ? "text-green-400/80" : "text-gray-600/50"} hidden sm:block`}
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
