"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ArrowRight, TrendingUp, Award, Gift } from "lucide-react"
import confetti from "canvas-confetti"

interface PaymentReceivedProps {
  service: string
  amount: number
  completedServices: number
  onContinue: () => void
}

export function PaymentReceived({ service, amount, completedServices, onContinue }: PaymentReceivedProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti effect when component mounts
    setShowConfetti(true)

    if (typeof window !== "undefined") {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          }),
        )
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          }),
        )
      }, 250)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 font-mono mb-2">PAGAMENTO RECEBIDO!</h2>
        <p className="text-green-300/70 font-mono">
          Seu <span className="text-green-400">{service}</span> foi entregue com sucesso
        </p>
      </div>

      <Card className="bg-gray-900 border border-green-500/50 overflow-hidden max-w-lg mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
          <div className="bg-white/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-white font-mono text-xl font-bold">Transação Concluída</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-green-500/20">
              <span className="text-green-300/70 font-mono">Serviço:</span>
              <span className="text-green-400 font-mono font-bold">{service}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-green-500/20">
              <span className="text-green-300/70 font-mono">Status:</span>
              <span className="text-green-400 font-mono font-bold flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Pago
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-green-500/20">
              <span className="text-green-300/70 font-mono">Data:</span>
              <span className="text-green-400 font-mono font-bold">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center pb-4">
              <span className="text-green-300/70 font-mono">Valor:</span>
              <span className="text-green-400 font-mono text-2xl font-bold">R$ {amount}</span>
            </div>

            <div className="bg-green-900/20 p-4 rounded-md border border-green-500/30 mt-6">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-green-400 font-mono">Seu progresso:</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-300/70 font-mono text-sm">Serviços concluídos:</span>
                <span className="text-green-400 font-mono font-bold">{completedServices}</span>
              </div>

              {completedServices >= 3 ? (
                <div className="mt-4 bg-yellow-900/30 border border-yellow-500/30 rounded-md p-3 flex items-start">
                  <Gift className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-mono font-bold">Oferta Especial Desbloqueada!</p>
                    <p className="text-yellow-300/70 font-mono text-sm mt-1">
                      Você completou 3 serviços e desbloqueou nossa oferta exclusiva!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 bg-blue-900/30 border border-blue-500/30 rounded-md p-3 flex items-start">
                  <Award className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-mono font-bold">Próximo objetivo:</p>
                    <p className="text-blue-300/70 font-mono text-sm mt-1">
                      Complete {3 - completedServices} serviço{3 - completedServices > 1 ? "s" : ""} para desbloquear
                      nossa oferta especial!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-black font-mono mt-4"
            >
              {completedServices >= 3 ? (
                <span className="flex items-center">
                  VER OFERTA ESPECIAL
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center">
                  CRIAR NOVO SERVIÇO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
