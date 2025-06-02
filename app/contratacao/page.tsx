"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WhatsappSimulation } from "@/components/whatsapp-simulation"
import { useAudioContext } from "@/components/audio-provider"
import { AudioToggle } from "@/components/audio-toggle"

export default function ContratacaoPage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [conversationPart, setConversationPart] = useState<"before" | "after">("before")
  const { playSound } = useAudioContext()

  useEffect(() => {
    playSound("transition")

    // Check if user has filled the form in usuario page
    const name = localStorage.getItem("playerName")

    if (!name) {
      // User hasn't filled the form, redirect to usuario
      router.push("/usuario")
      return
    }

    setPlayerName(name)

    // Check if user has completed personalization
    const hasCompletedPersonalizacao = localStorage.getItem("hasCompletedPersonalizacao")

    if (hasCompletedPersonalizacao === "true") {
      setConversationPart("after")
    } else {
      setConversationPart("before")
    }

    setIsLoaded(true)
  }, [router, playSound])

  const handleBeforeComplete = () => {
    playSound("level-up")
    // Mark that user completed the first part of contratacao
    localStorage.setItem("hasCompletedContratacao", "true")
    // Redirect to personalization page
    router.push("/personalizar")
  }

  const handleAfterComplete = () => {
    playSound("success")
    // Mark that user completed the full flow
    localStorage.setItem("hasCompletedSimulacao", "true")
    // Redirect to offer page
    router.push("/oferta")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-t-2 border-b-2 border-green-500 rounded-full mb-4"></div>
          <p className="text-green-500 font-mono animate-pulse">Carregando simulação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-500 relative">
      {/* Audio Toggle */}
      <AudioToggle />

      {/* Animated background code effect */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <pre className="text-xs text-green-500 animate-scroll whitespace-pre-wrap">
          {Array(50)
            .fill(
              "Análise de cliente em andamento... Processando dados... Verificando perfil... Calculando proposta ideal... Preparando estratégia de comunicação... Otimizando conversão... Segurança ativada... Criptografia em funcionamento...",
            )
            .join("")}
        </pre>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-400 font-mono mb-2">
              {conversationPart === "before" ? "SIMULAÇÃO DE ATENDIMENTO" : "FINALIZAÇÃO DE PROJETO"}
            </h1>
            <p className="text-green-300/70 font-mono">
              {conversationPart === "before"
                ? "Aprenda a comunicação profissional para conquistar clientes"
                : "Entregue o projeto e receba o pagamento final"}
            </p>
          </div>

          {/* WhatsApp Simulation */}
          <WhatsappSimulation
            playerName={playerName}
            onComplete={conversationPart === "before" ? handleBeforeComplete : handleAfterComplete}
            conversationPart={conversationPart}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-100vh);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
