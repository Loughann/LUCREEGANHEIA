"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AudioButton } from "@/components/audio-button"
import { useAudioContext } from "@/components/audio-provider"
import { X, Clock, Users, CheckCircle, ArrowRight, AlertTriangle, Crown, FlameIcon as Fire, Zap } from "lucide-react"

interface BackRedirectPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function BackRedirectPopup({ isOpen, onClose }: BackRedirectPopupProps) {
  const { playSound } = useAudioContext()
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [spotsLeft, setSpotsLeft] = useState(1)
  const [showPulse, setShowPulse] = useState(false)

  useEffect(() => {
    if (isOpen) {
      playSound("error")
      setShowPulse(true)

      // Countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCTAClick = () => {
    playSound("levelUp")
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100])
    }
    window.open("https://pay.hotmart.com/oferta-exclusiva-999", "_blank")
  }

  const handleClose = () => {
    playSound("whoosh")
    onClose()
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
                <AlertTriangle className="h-5 w-5 text-green-200" />
                <span className="text-lg font-bold text-white">ESPERA!</span>
              </div>
              <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-white font-semibold mt-1 text-sm">
              Você está perdendo a maior oportunidade da sua vida!
            </p>
          </div>

          {/* Conteúdo principal */}
          <div className="p-4 space-y-4 bg-gray-900">
            {/* Timer vermelho escuro (mantém urgência) */}
            <div className="bg-gradient-to-r from-[#470700] to-[#320400] border border-[#470700] rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-bold text-sm">OFERTA EXPIRA EM:</span>
              </div>
              <div className="text-3xl font-bold text-white bg-red-600 rounded-lg py-2 px-4 inline-block">
                {formatTime(timeLeft)}
              </div>
              <p className="text-red-300 text-xs mt-2">Depois disso, volta para R$ 97,00!</p>
            </div>

            {/* Escassez verde */}
            <div className="bg-gradient-to-r from-[#15803D] to-[#166534] border border-[#15803D] rounded-xl p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-green-200" />
                <span className="text-green-100 font-bold text-sm">APENAS {spotsLeft} VAGA RESTANTE!</span>
              </div>
              <div className="flex items-center justify-center space-x-1 text-xs text-green-200">
                <Fire className="h-3 w-3" />
                <span>Mais de 1.247 pessoas já garantiram!</span>
              </div>
            </div>

            {/* Card principal verde claro */}
            <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border-2 border-[#22C55E] rounded-xl p-4 text-center relative">
              <div className="text-green-800">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <span className="text-sm font-bold">Oferta especial para quem foi selecionado:</span>
                  <Crown className="h-4 w-4 text-green-700" />
                </div>
                <div className="text-2xl font-black text-red-700 mb-1">37% DE DESCONTO</div>
                <div className="text-xl font-black text-red-700 mb-2">EXTRA!</div>
                <div className="text-base font-bold text-gray-700">
                  <span className="line-through text-gray-500">De R$ 14,90</span> por apenas{" "}
                  <span className="text-green-700 text-xl font-black">R$ 9,90</span>
                </div>
              </div>
            </div>

            {/* Benefícios com checkmarks verdes */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Mentoria Exclusiva X1</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Grupo VIP + Network</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Bônus Secreto de R$ 97</span>
              </div>
            </div>

            {/* CTA verde */}
            <AudioButton
              onClick={handleCTAClick}
              className={`w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold py-4 px-6 rounded-xl text-base shadow-lg transition-all duration-300 hover:scale-105 ${
                showPulse ? "animate-pulse" : ""
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>APROVEITAR DESCONTO DE 37%</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </AudioButton>

            {/* Garantias pequenas */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-400" />
                <span>7 dias garantia</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-green-400" />
                <span>Acesso imediato</span>
              </div>
            </div>

            {/* Aviso final vermelho escuro (mantém urgência) */}
            <div className="bg-gradient-to-r from-[#470700] to-[#320400] border border-[#470700] rounded-xl p-3 text-center">
              <div className="text-green-400 font-bold text-sm mb-1">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                ATENÇÃO: OFERTA ÚNICA!
              </div>
              <div className="text-red-300 text-xs leading-tight">
                Esta oferta é válida apenas por <strong className="text-white">10 minutos</strong> e{" "}
                <strong className="text-green-300">NÃO SERÁ REPETIDA!</strong>
                <br />
                Se fechar esta página, <strong className="text-red-200">perderá para sempre!</strong>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
