"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wand2, Sparkles } from "lucide-react"

interface PromptSelectorProps {
  category: string
  onSelect: (prompt: string, category: string, value: string) => void
  isGenerating: boolean
}

export function PromptSelector({ category, onSelect, isGenerating }: PromptSelectorProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  // Define prompts for each category
  const prompts = {
    layout: [
      {
        text: "Crie um layout moderno com seções bem definidas e espaço para destaque de conteúdo principal.",
        value: "modern",
      },
      {
        text: "Desenvolva um layout minimalista focado em simplicidade e espaço em branco estratégico.",
        value: "minimal",
      },
      {
        text: "Monte um layout arrojado com elementos sobrepostos e design ousado para destacar inovação.",
        value: "bold",
      },
    ],
    colorScheme: [
      {
        text: "Aplique um esquema de cores azul profissional que transmita confiança e estabilidade.",
        value: "blue",
      },
      {
        text: "Use um esquema de cores verde vibrante que comunique crescimento e prosperidade.",
        value: "green",
      },
      {
        text: "Implemente um esquema de cores roxo elegante para transmitir criatividade e luxo.",
        value: "purple",
      },
    ],
    typography: [
      {
        text: "Utilize tipografia moderna com fontes sans-serif limpas para leitura fácil em telas.",
        value: "modern",
      },
      {
        text: "Aplique tipografia clássica com serifa para um visual mais sofisticado e tradicional.",
        value: "classic",
      },
      {
        text: "Combine fontes contrastantes para criar hierarquia visual e dinamismo na página.",
        value: "dynamic",
      },
    ],
    headerStyle: [
      {
        text: "Crie um cabeçalho minimalista com logo e navegação simplificada para foco no conteúdo.",
        value: "minimal",
      },
      {
        text: "Desenvolva um cabeçalho hero com imagem de fundo e texto sobreposto para maior impacto.",
        value: "hero",
      },
      {
        text: "Monte um cabeçalho com vídeo de fundo para engajamento imediato dos visitantes.",
        value: "video",
      },
    ],
    imageStyle: [
      {
        text: "Utilize imagens com estilo minimalista e tons neutros para uma aparência clean e profissional.",
        value: "minimal",
      },
      {
        text: "Aplique imagens vibrantes e coloridas para criar uma página energética e chamativa.",
        value: "vibrant",
      },
      {
        text: "Implemente ilustrações e gráficos em vez de fotos para um visual único e memorável.",
        value: "illustrated",
      },
    ],
  }

  const handleSelect = (prompt: string, value: string) => {
    if (isGenerating) return

    setSelectedPrompt(prompt)

    // Verificação específica para esquema de cores
    let finalValue = value
    if (category === "colorScheme") {
      const promptLower = prompt.toLowerCase()
      if (promptLower.includes("roxo") || promptLower.includes("purple")) {
        finalValue = "purple"
      } else if (promptLower.includes("verde") || promptLower.includes("green")) {
        finalValue = "green"
      } else if (promptLower.includes("azul") || promptLower.includes("blue")) {
        finalValue = "blue"
      }

      console.log(`Esquema de cores selecionado: ${finalValue}`)
    }

    onSelect(prompt, category, finalValue)
  }

  const currentPrompts = prompts[category as keyof typeof prompts] || []

  return (
    <div className="space-y-4">
      <p className="text-green-300/70 font-mono text-sm mb-4">Selecione um prompt para personalizar sua página:</p>

      {currentPrompts.map((prompt, index) => (
        <Card
          key={index}
          className={`bg-gray-800 border ${selectedPrompt === prompt.text ? "border-green-500" : "border-green-500/30"} hover:border-green-500/70 transition-all duration-300 cursor-pointer p-4 ${isGenerating && selectedPrompt !== prompt.text ? "opacity-50" : ""}`}
          onClick={() => handleSelect(prompt.text, prompt.value)}
        >
          <div className="flex items-start">
            <Wand2
              className={`h-5 w-5 ${selectedPrompt === prompt.text ? "text-green-400" : "text-green-400/70"} mt-0.5 mr-3 flex-shrink-0`}
            />
            <p
              className={`text-sm font-mono ${selectedPrompt === prompt.text ? "text-green-400" : "text-green-300/70"}`}
            >
              {prompt.text}
            </p>
          </div>

          {selectedPrompt === prompt.text && (
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                className="bg-green-700 hover:bg-green-800 text-black font-mono text-xs"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">Gerando</span>
                    <span className="inline-block ml-1 animate-pulse">.</span>
                    <span className="inline-block ml-0 animate-pulse delay-100">.</span>
                    <span className="inline-block ml-0 animate-pulse delay-200">.</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    SELECIONADO
                  </span>
                )}
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
