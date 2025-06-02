"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AudioButton } from "@/components/audio-button"
import { useAudioContext } from "@/components/audio-provider"
import {
  X,
  Clock,
  CheckCircle,
  ArrowDown,
  AlertTriangle,
  Zap,
  Rocket,
  LightbulbIcon,
  PlayCircle,
  Target,
} from "lucide-react"

interface UserBackRedirectProps {
  isOpen: boolean
  onClose: () => void
}

export function UserBackRedirect({ isOpen, onClose }: UserBackRedirectProps) {
  const { playSound } = useAudioContext()
  const [showPulse, setShowPulse] = useState(false)
  const [countdown, setCountdown] = useState(120)

  useEffect(() => {
    if (isOpen) {
      playSound("alert")
      setShowPulse(true)

      // Countdown timer para criar urgência
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isOpen, playSound])

  const handleContinueClick = () => {
    playSound("levelUp")
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
    onClose()

    // Foca no primeiro campo do formulário após fechar o popup
    setTimeout(() => {
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
      if (nameInput) {
        nameInput.focus()
        nameInput.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 300)
  }

  const handleClose = () => {
    playSound("click")
    onClose()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-sm mx-auto bg-gray-900 border-2 border-green-500 text-white p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative overflow-hidden">
          {/* Header verde */}
          <div className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] p-4 relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-200" />
                <span className="text-lg font-bold text-white">ESPERE!</span>
              </div>
              <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-white font-semibold mt-1 text-sm">
              Você está prestes a perder a chance de aprender na prática!
            </p>
          </div>

          {/* Conteúdo principal */}
          <div className="p-4 space-y-4 bg-gray-900">
            {/* Mensagem principal */}
            <div className="bg-gradient-to-r from-green-900 to-green-800 border border-green-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <PlayCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-bold text-sm">SIMULAÇÃO PRÁTICA!</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Aprenda <span className="text-green-400">na prática</span> como criar e lucrar{" "}
                <span className="text-yellow-400">+R$500/dia</span>
              </h3>
              <div className="text-sm text-green-200">
                Simulação real de criação com IA + estratégias que realmente funcionam
              </div>
            </div>

            {/* Contador regressivo */}
            <div className="bg-gradient-to-r from-red-700 to-red-800 border border-red-600 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-red-300" />
                <span className="text-red-200 font-bold text-sm">TEMPO LIMITADO:</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(countdown)}</div>
              <p className="text-xs text-red-300 mt-1">Para iniciar sua simulação gratuita!</p>
            </div>

            {/* O que você vai aprender */}
            <div className="space-y-2">
              <h4 className="text-center text-white font-bold text-sm mb-3">
                <Target className="h-4 w-4 inline mr-1 text-green-400" />O QUE VOCÊ VAI APRENDER NA SIMULAÇÃO:
              </h4>
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">
                  Como criar páginas profissionais com IA em minutos
                </span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Estratégias para cobrar R$500+ por projeto</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Prompts prontos para usar imediatamente</span>
              </div>
            </div>

            {/* CTA verde */}
            <AudioButton
              onClick={handleContinueClick}
              className={`w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold py-4 px-6 rounded-xl text-base shadow-lg transition-all duration-300 hover:scale-105 ${
                showPulse ? "animate-[pulse_2s_ease-in-out_infinite]" : ""
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>INICIAR MINHA SIMULAÇÃO</span>
                <ArrowDown className="h-4 w-4" />
              </span>
            </AudioButton>

            {/* Garantias pequenas */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Rocket className="h-3 w-3 text-green-400" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center space-x-1">
                <LightbulbIcon className="h-3 w-3 text-green-400" />
                <span>Aprenda fazendo</span>
              </div>
            </div>

            {/* Aviso final */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-3 text-center">
              <div className="text-green-400 font-bold text-sm mb-1">
                <Zap className="h-4 w-4 inline mr-1" />
                ÚLTIMA CHANCE!
              </div>
              <div className="text-gray-300 text-xs leading-tight">
                Comece a simulação gratuita que já transformou <strong className="text-white">+2.847 vidas</strong>{" "}
                financeiramente.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
