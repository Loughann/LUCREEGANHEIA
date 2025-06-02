"use client"

import { useEffect, useState } from "react"
import { Loader2, Terminal } from "lucide-react"

interface StepTransitionProps {
  isVisible: boolean
  onComplete: () => void
  currentStep: number
  isPersonalization?: boolean
}

export function StepTransition({ isVisible, onComplete, currentStep, isPersonalization }: StepTransitionProps) {
  const [dots, setDots] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setDots("")
      setProgress(0)
      return
    }

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(dotsInterval)
          setTimeout(() => {
            onComplete()
          }, 300) // Reduzir delay para 300ms
          return 100
        }
        return prev + 3 // Aumentar incremento para 3
      })
    }, 60) // Aumentar intervalo para 60ms

    return () => {
      clearInterval(dotsInterval)
      clearInterval(progressInterval)
    }
  }, [isVisible, onComplete, isPersonalization])

  if (!isVisible) return null

  const getTransitionText = () => {
    if (isPersonalization) {
      switch (currentStep) {
        case 1:
          return "Aplicando layout selecionado"
        case 2:
          return "Configurando esquema de cores"
        case 3:
          return "Ajustando tipografia"
        case 4:
          return "Personalizando cabeçalho"
        case 5:
          return "Adicionando elementos de credibilidade"
        default:
          return "Aplicando personalização"
      }
    }

    switch (currentStep) {
      case 1:
        return "Aplicando prompt criado"
      case 2:
        return "Processando conteúdo gerado"
      case 3:
        return "Finalizando entrega"
      default:
        return "Aplicando prompt criado"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-green-500/30 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Terminal icon with animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Terminal className="h-16 w-16 text-green-400" />
              <div className="absolute inset-0 animate-ping">
                <Terminal className="h-16 w-16 text-green-400/30" />
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-green-400 font-mono">
              {getTransitionText()}
              {dots}
            </h3>
            <p className="text-green-300/70 font-mono text-sm">
              {isPersonalization
                ? "Aguarde enquanto aplicamos suas personalizações"
                : "Aguarde enquanto processamos sua solicitação"}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-green-400 font-mono text-sm">{progress}%</p>
          </div>

          {/* Animated loader */}
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 text-green-400 animate-spin" />
          </div>

          {/* Code simulation */}
          <div className="bg-black/50 rounded-md p-3 text-left">
            <pre className="text-green-300 font-mono text-xs">
              <span className="text-green-500">$</span>{" "}
              {isPersonalization ? "applying_customization.sh" : "executing_prompt.sh"}
              {dots}
              {progress > 20 && (
                <>
                  {"\n"}✓ {isPersonalization ? "Validando configurações" : "Validando entrada"}
                </>
              )}
              {progress > 40 && (
                <>
                  {"\n"}✓ {isPersonalization ? "Aplicando estilo" : "Processando IA"}
                </>
              )}
              {progress > 60 && (
                <>
                  {"\n"}✓ {isPersonalization ? "Atualizando preview" : "Gerando resultado"}
                </>
              )}
              {progress > 80 && (
                <>
                  {"\n"}✓ {isPersonalization ? "Finalizando personalização" : "Aplicando configurações"}
                </>
              )}
              {progress === 100 && <>{"\n"}✓ Concluído com sucesso!</>}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
