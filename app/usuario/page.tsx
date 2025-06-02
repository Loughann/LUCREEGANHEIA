"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AudioButton } from "@/components/audio-button"
import { AudioInput } from "@/components/audio-input"
import { AudioToggle } from "@/components/audio-toggle"
import { useAudioContext } from "@/components/audio-provider"
import { X, AlertTriangle, Shield, Code, Gift, User, Phone } from "lucide-react"
import { UserBackRedirect } from "@/components/user-back-redirect"

export default function UsuarioPage() {
  const router = useRouter()
  const { playSound } = useAudioContext()
  const [isLoading, setIsLoading] = useState(true)
  const [showStartForm, setShowStartForm] = useState(false)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [exitPopupShown, setExitPopupShown] = useState(false)
  const [popupName, setPopupName] = useState("")
  const [popupWhatsapp, setPopupWhatsapp] = useState("")
  const [showBackRedirect, setShowBackRedirect] = useState(false)
  const [backRedirectShown, setBackRedirectShown] = useState(false)

  useEffect(() => {
    // Som de entrada na página
    playSound("transition")

    // Verifica se veio da página de venda
    const fromVenda = sessionStorage.getItem("fromVenda")
    if (!fromVenda) {
      router.push("/venda")
      return
    }
    setIsLoading(false)

    // Verifica se o usuário já preencheu o formulário
    const playerName = localStorage.getItem("playerName")
    if (playerName) {
      // Usuário já tem dados, vai para a próxima etapa
      playSound("whoosh")
      router.push("/contratacao")
    } else {
      setTimeout(() => {
        setShowStartForm(true)
        playSound("notification")
      }, 1000)
    }

    // Configurar detecção de back button para o back redirect
    const handlePopState = (e: PopStateEvent) => {
      // Previne o comportamento padrão
      e.preventDefault()
      window.history.pushState(null, "", window.location.pathname)

      if (!backRedirectShown) {
        setShowBackRedirect(true)
        setBackRedirectShown(true)
      }
    }

    // Adiciona um estado na história para poder detectar o botão voltar
    window.history.pushState(null, "", window.location.pathname)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [router, playSound, backRedirectShown])

  useEffect(() => {
    if (!isLoading || exitPopupShown) return

    let scrollTimer: NodeJS.Timeout
    let lastScrollY = 0
    let scrollDirection = 0

    // Desktop: Detecção de mouse leave
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitPopup) {
        playSound("alert")
        setShowExitPopup(true)
        setExitPopupShown(true)
      }
    }

    // Mobile: Detecção de scroll up (simula gesto de voltar)
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY) {
        scrollDirection++
        if (scrollDirection > 3 && currentScrollY < 100 && !showExitPopup) {
          if (scrollTimer) clearTimeout(scrollTimer)
          scrollTimer = setTimeout(() => {
            playSound("alert")
            setShowExitPopup(true)
            setExitPopupShown(true)
          }, 300)
        }
      } else {
        scrollDirection = 0
      }

      lastScrollY = currentScrollY
    }

    // Mobile: Eventos de touch para detecção de swipe
    let touchStartY = 0
    let touchStartTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentY = e.touches[0].clientY
      const touchDiff = touchCurrentY - touchStartY
      const timeDiff = Date.now() - touchStartTime

      // Detecta swipe rápido para cima próximo ao topo da tela
      if (touchDiff > 50 && timeDiff < 300 && touchStartY < 100 && !showExitPopup) {
        playSound("alert")
        setShowExitPopup(true)
        setExitPopupShown(true)
      }
    }

    // Keyboard: Tecla ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showExitPopup) {
        playSound("alert")
        setShowExitPopup(true)
        setExitPopupShown(true)
      }
    }

    // Adiciona os event listeners
    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("keydown", handleKeyDown)
      if (scrollTimer) clearTimeout(scrollTimer)
    }
  }, [isLoading, exitPopupShown, showExitPopup, playSound])

  // Adicionar detecção de back redirect para dispositivos móveis
  useEffect(() => {
    if (backRedirectShown) return

    // Mobile: Eventos de touch para detecção de swipe back
    let touchStartX = 0
    let touchStartTime = 0

    const handleBackTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartTime = Date.now()
    }

    const handleBackTouchMove = (e: TouchEvent) => {
      const touchCurrentX = e.touches[0].clientX
      const touchDiff = touchCurrentX - touchStartX
      const timeDiff = Date.now() - touchStartTime

      // Detecta swipe da esquerda para direita (gesto de voltar)
      if (touchDiff > 70 && timeDiff < 300 && !backRedirectShown) {
        e.preventDefault()
        setShowBackRedirect(true)
        setBackRedirectShown(true)
      }
    }

    document.addEventListener("touchstart", handleBackTouchStart, { passive: true })
    document.addEventListener("touchmove", handleBackTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleBackTouchStart)
      document.removeEventListener("touchmove", handleBackTouchMove)
    }
  }, [backRedirectShown])

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não for dígito
    const numbers = value.replace(/\D/g, "")

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11)

    // Aplica a formatação
    if (limited.length <= 2) {
      return limited
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
    }
  }

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Remove todos os caracteres não numéricos para validar
    const numbersOnly = popupWhatsapp.replace(/\D/g, "")

    if (numbersOnly.length !== 11) {
      playSound("error")
      alert("Por favor, digite um número de WhatsApp com 11 dígitos (DDD + número)")
      return
    }

    if (!popupName.trim() || !popupWhatsapp.trim()) {
      playSound("error")
      alert("Por favor, preencha todos os campos")
      return
    }

    // Salva no localStorage
    localStorage.setItem("playerName", popupName.trim())
    localStorage.setItem("playerWhatsapp", popupWhatsapp.trim())

    // Som de sucesso e fecha o popup
    playSound("level-up")
    setShowExitPopup(false)

    // Enviar dados para a API
    const sendToAPI = async () => {
      try {
        const response = await fetch("https://eo2r3hqot95yzox.m.pipedream.net", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: popupName.trim(),
            whatsapp: popupWhatsapp.trim(),
            timestamp: new Date().toISOString(),
            source: "exit-popup",
          }),
        })

        if (!response.ok) {
          console.error("Erro ao enviar dados para API:", response.status)
        }
      } catch (error) {
        console.error("Erro na requisição para API:", error)
      }
    }

    // Enviar para API (não bloqueia o fluxo)
    sendToAPI()

    // Pequeno delay para o som tocar antes da transição
    setTimeout(() => {
      playSound("whoosh")
      router.push("/contratacao")
    }, 500)
  }

  const handleClosePopup = () => {
    playSound("click")
    setShowExitPopup(false)
  }

  const handleCloseBackRedirect = () => {
    playSound("click")
    setShowBackRedirect(false)
  }

  const handleSubmit = (name: string, whatsapp: string) => {
    // Remove todos os caracteres não numéricos para validar
    const numbersOnly = whatsapp.replace(/\D/g, "")

    if (numbersOnly.length !== 11) {
      playSound("error")
      alert("Por favor, digite um número de WhatsApp com 11 dígitos (DDD + número)")
      return
    }

    // Salva os dados no localStorage
    localStorage.setItem("playerName", name)
    localStorage.setItem("playerWhatsapp", whatsapp)

    // Som de sucesso
    playSound("level-up")

    // Enviar dados para a API
    const sendToAPI = async () => {
      try {
        const response = await fetch("https://eo2r3hqot95yzox.m.pipedream.net", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            whatsapp: whatsapp,
            timestamp: new Date().toISOString(),
            source: "usuario-page",
          }),
        })

        if (!response.ok) {
          console.error("Erro ao enviar dados para API:", response.status)
        }
      } catch (error) {
        console.error("Erro na requisição para API:", error)
      }
    }

    // Enviar para API (não bloqueia o fluxo)
    sendToAPI()

    // Pequeno delay para o som tocar antes da transição
    setTimeout(() => {
      playSound("whoosh")
      router.push("/contratacao")
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">
          <div className="inline-block animate-spin h-12 w-12 border-t-2 border-b-2 border-green-500 rounded-full mr-4"></div>
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-500 relative overflow-hidden">
      {/* Audio Toggle */}
      <AudioToggle />

      {/* Back Redirect */}
      <UserBackRedirect isOpen={showBackRedirect} onClose={handleCloseBackRedirect} />

      {/* Animated background code effect */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <pre className="text-xs text-green-500 animate-scroll whitespace-pre-wrap leading-4">
          {Array(50)
            .fill(
              `function generateAIIncome() { 
  const prompt = new AIPrompt('create website');
  const result = prompt.execute();
  return result.monetize();
}

const income = new PassiveIncome('AI');
const result = income.generate(500);
if (result.success) { 
  bank.deposit(result.amount); 
  console.log('💰 Renda gerada: R$' + result.amount);
}

class AIWebsiteBuilder {
  constructor() {
    this.templates = ['landing', 'ecommerce', 'blog'];
    this.revenue = 0;
  }
  
  createSite(prompt) {
    const site = this.ai.generate(prompt);
    this.revenue += 500;
    return site;
  }
}

// Simulação de ganhos
setInterval(() => {
  const earnings = Math.random() * 100;
  totalEarnings += earnings;
  updateBalance(totalEarnings);
}, 1000);

`,
            )
            .join("")}
        </pre>
      </div>

      {/* Matrix rain effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-rain">
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="matrix-column"
                style={{
                  left: `${i * 5}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                {Array(20)
                  .fill(0)
                  .map((_, j) => (
                    <span key={j} className="matrix-char">
                      {String.fromCharCode(0x30a0 + Math.random() * 96)}
                    </span>
                  ))}
              </div>
            ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Exit Intent Popup */}
        {showExitPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClosePopup} />

            {/* Modal */}
            <div className="relative bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
              {/* Pulsing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur opacity-75 animate-pulse"></div>

              <div className="relative bg-gray-900 rounded-lg p-6">
                {/* Close button */}
                <AudioButton
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-transparent border-none p-1"
                  soundType="click"
                >
                  <X className="h-5 w-5" />
                </AudioButton>

                {/* Alert icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500/20 p-3 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-xl md:text-2xl font-bold text-center mb-3 text-white">
                  ⚠️ Espere! Falta só um passo para desbloquear sua simulação com IA
                </h2>

                {/* Subheadline */}
                <p className="text-gray-300 text-center mb-6 text-sm md:text-base">
                  Você está prestes a ver como criar uma página com IA como se fosse para um cliente de verdade — grátis
                  e em menos de 3 minutos.
                </p>

                {/* Features list */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-green-500/20 p-1.5 rounded-full">
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-gray-300">Acesso 100% gratuito</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-blue-500/20 p-1.5 rounded-full">
                      <Code className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-gray-300">Criação com IA sem saber programar</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-yellow-500/20 p-1.5 rounded-full">
                      <Gift className="h-4 w-4 text-yellow-500" />
                    </div>
                    <span className="text-gray-300">Seu presente será liberado após a simulação</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handlePopupSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <AudioInput
                      type="text"
                      placeholder="Seu nome completo"
                      value={popupName}
                      onChange={(e) => setPopupName(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <AudioInput
                      type="tel"
                      placeholder="Seu WhatsApp (com DDD)"
                      maxLength={15}
                      value={popupWhatsapp}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setPopupWhatsapp(formatted)
                      }}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                      required
                    />
                  </div>
                  <AudioButton
                    type="submit"
                    soundType="level-up"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-lg shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105"
                  >
                    🚀 Liberar Minha Simulação
                  </AudioButton>
                </form>

                {/* Footer */}
                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                  Você está a segundos de ver como transformar ideias em renda. Não perca essa chance.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Crie e Lucre com <span className="text-green-400 animate-pulse">IA</span>
            </h1>
            <p className="text-green-400 text-lg leading-relaxed">
              Descubra como criar serviços valiosos com Inteligência Artificial e gerar
              <br />
              <span className="text-yellow-400 font-semibold">renda extra em minutos</span>, mesmo sem experiência
              técnica.
            </p>
          </div>

          {showStartForm ? (
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl shadow-green-500/10 animate-in fade-in-50 duration-500">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Comece Sua Jornada</h2>
                <p className="text-slate-400">Preencha seus dados para acessar a simulação</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = formData.get("name") as string
                  const whatsapp = formData.get("whatsapp") as string
                  handleSubmit(name, whatsapp)
                }}
                className="space-y-6"
              >
                {/* Nome Completo */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-green-400 font-medium">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <AudioInput
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20"
                      required
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label htmlFor="whatsapp" className="text-green-400 font-medium">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <AudioInput
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      maxLength={15} // (11) 99999-9999 = 15 caracteres com formatação
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        e.target.value = formatted
                      }}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <AudioButton
                  type="submit"
                  soundType="level-up"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/25"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Iniciar Simulação
                </AudioButton>
              </form>

              {/* Privacy Notice */}
              <p className="text-center text-slate-400 text-sm mt-6">
                <Shield className="inline h-4 w-4 mr-1" />
                Seus dados estão seguros e não serão compartilhados
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="inline-block animate-spin h-12 w-12 border-t-2 border-b-2 border-green-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array(15)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-500 rounded-full animate-float opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .matrix-rain {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .matrix-column {
          position: absolute;
          top: -100%;
          width: 20px;
          height: 100vh;
          animation: matrix-fall linear infinite;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #00ff00;
        }
        
        .matrix-char {
          display: block;
          line-height: 1.2;
          opacity: 0.8;
        }
        
        @keyframes matrix-fall {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}
