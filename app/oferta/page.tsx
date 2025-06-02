"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AudioButton } from "@/components/audio-button"
import { AudioCard } from "@/components/audio-card"
import { AudioToggle } from "@/components/audio-toggle"
import { BackRedirectPopup } from "@/components/back-redirect-popup"
import { useAudioContext } from "@/components/audio-provider"
import { Star, CheckCircle, ArrowRight, AlertTriangle, ChevronUp, TrendingUp, DollarSign, Target } from "lucide-react"

export default function OfertaPage() {
  const router = useRouter()
  const { playSound } = useAudioContext()
  const [playerName, setPlayerName] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const [earnings, setEarnings] = useState(0)
  const [remainingSpots, setRemainingSpots] = useState(12)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showBackRedirect, setShowBackRedirect] = useState(false)
  const [hasShownBackRedirect, setHasShownBackRedirect] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    playSound("transition")

    // Check if user has started the game
    const name = localStorage.getItem("playerName")
    const storedEarnings = localStorage.getItem("playerEarnings")

    if (!name) {
      router.push("/")
      return
    }

    setPlayerName(name)
    setEarnings(storedEarnings ? Number.parseInt(storedEarnings) : 0)
    setIsLoaded(true)

    // Check if mobile
    setIsMobile(window.innerWidth < 768)

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

    return () => clearInterval(timer)
  }, [router, playSound])

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setShowScrollTop(position > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Simulate decreasing spots
  useEffect(() => {
    const spotTimer = setInterval(() => {
      if (Math.random() > 0.85 && remainingSpots > 3) {
        setRemainingSpots((prev) => prev - 1)
        playSound("notification")
      }
    }, 45000)

    return () => clearInterval(spotTimer)
  }, [remainingSpots, playSound])

  // Back redirect detection - Mobile optimized for Android/iOS
  useEffect(() => {
    let isRedirectShown = false
    let touchStartX = 0
    let touchStartY = 0
    let touchStartTime = 0

    // Enhanced mobile detection
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768

    // Unified function to show redirect
    const showRedirect = () => {
      if (!isRedirectShown && !hasShownBackRedirect) {
        setShowBackRedirect(true)
        setHasShownBackRedirect(true)
        isRedirectShown = true
      }
    }

    // 1. History API - Works on all devices
    const handlePopState = (e: PopStateEvent) => {
      if (!isRedirectShown && !hasShownBackRedirect) {
        e.preventDefault()
        e.stopPropagation()
        showRedirect()
        // Push state back to prevent navigation
        setTimeout(() => window.history.pushState(null, "", window.location.href), 10)
      }
    }

    // 2. Page visibility - App switching, tab changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isRedirectShown && !hasShownBackRedirect) {
        setTimeout(() => {
          if (document.visibilityState === "visible" && !isRedirectShown) {
            showRedirect()
          }
        }, 1000)
      }
    }

    // 3. Touch events - Mobile gestures
    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobileDevice) return
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      touchStartTime = Date.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobileDevice || isRedirectShown || hasShownBackRedirect) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStartX
      const deltaY = touch.clientY - touchStartY
      const deltaTime = Date.now() - touchStartTime

      // Back swipe gesture (iOS/Android)
      if (touchStartX < 50 && deltaX > 100 && Math.abs(deltaY) < 100 && deltaTime < 500) {
        e.preventDefault()
        showRedirect()
        return
      }

      // Pull-to-refresh gesture
      if (window.scrollY === 0 && deltaY > 150 && deltaTime < 1000) {
        e.preventDefault()
        showRedirect()
        return
      }
    }

    // 4. Desktop events
    const handleMouseLeave = (e: MouseEvent) => {
      if (!isMobileDevice && e.clientY <= 0 && !isRedirectShown && !hasShownBackRedirect) {
        showRedirect()
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isMobileDevice && !isRedirectShown && !hasShownBackRedirect) {
        e.preventDefault()
        showRedirect()
        return (e.returnValue = "Tem certeza que deseja sair?")
      }
    }

    // 5. Keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.keyCode === 27) && !isRedirectShown && !hasShownBackRedirect) {
        e.preventDefault()
        showRedirect()
      }
    }

    // 6. Focus events - Mobile app switching
    const handleWindowBlur = () => {
      if (isMobileDevice && !isRedirectShown && !hasShownBackRedirect) {
        setTimeout(() => {
          if (!document.hasFocus() && !isRedirectShown) {
            showRedirect()
          }
        }, 500)
      }
    }

    // 7. Page hide - Mobile navigation
    const handlePageHide = () => {
      if (!isRedirectShown && !hasShownBackRedirect) {
        showRedirect()
      }
    }

    // Add event listeners
    window.addEventListener("popstate", handlePopState, { passive: false })
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("keydown", handleKeyDown)

    if (isMobileDevice) {
      // Mobile-specific events
      document.addEventListener("touchstart", handleTouchStart, { passive: false })
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
    } else {
      // Desktop-specific events
      document.addEventListener("mouseleave", handleMouseLeave)
      window.addEventListener("beforeunload", handleBeforeUnload)
    }

    // Initialize history state
    window.history.pushState(null, "", window.location.href)

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", handlePopState)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasShownBackRedirect])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const scrollToTop = () => {
    playSound("whoosh")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCTAClick = () => {
    playSound("coin")
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    window.open("https://pay.kirvano.com/28256fcf-69b1-4c29-b25e-5742c7c25b05", "_blank")
  }

  const closeBackRedirect = () => {
    setShowBackRedirect(false)
    playSound("success")
    // Don't reset hasShownBackRedirect to prevent showing again
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-green-600 rounded-full mb-4"></div>
          <p className="text-gray-600 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-x-hidden">
      {/* Audio Toggle */}
      <AudioToggle />

      {/* Back Redirect Popup */}
      <BackRedirectPopup isOpen={showBackRedirect} onClose={closeBackRedirect} />

      {/* Matrix background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-5">
          <div className="text-green-500 text-xs font-mono leading-none whitespace-pre-wrap animate-pulse">
            {Array(100)
              .fill("01001000 01100001 01100011 01100011 01101011 01100101 01110010 00100000 01000001 01001001\n")
              .join("")}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-3">
          <div className="text-green-400 text-sm font-mono animate-pulse" style={{ animationDelay: "1s" }}>
            {Array(50).fill("function generateAI() { return profit; }\n").join("")}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-2">
          <div className="text-green-600 text-xs font-mono animate-pulse" style={{ animationDelay: "2s" }}>
            {Array(80).fill("AI.create() → R$ 5000\n").join("")}
          </div>
        </div>
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-12 px-4 bg-gray-800/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-r from-pink-100 to-red-100 text-red-800 px-8 py-4 rounded-full text-lg font-bold mb-8 border-2 border-red-300 shadow-lg animate-pulse">
                🚨 REVELAÇÃO IMPORTANTE 🚨
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                <span className="text-red-400">TUDO</span> o que você acabou de vivenciar foi criado por{" "}
                <span className="text-green-400 animate-pulse">IA</span>
              </h1>

              <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border-2 border-red-500/50 rounded-3xl p-8 mb-8 backdrop-blur-sm shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Sistema: Lucre e Ganhe com IA</h2>

                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                      <span>
                        O chat que te atendeu: <strong>ChatGPT</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                      <span>
                        A simulação de atendimento: <strong>IA</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                      <span>
                        Esta página de vendas: <strong>IA</strong>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                      <span>
                        Todo o design e navegação: <strong>IA</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                      <span>
                        Os textos persuasivos: <strong>IA</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                      <span>
                        A estratégia de conversão: <strong>IA</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/80 border border-gray-600 rounded-xl p-6 mb-8 max-w-2xl mx-auto backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4">E você vai aprender a fazer exatamente isso!</h3>
                <p className="text-gray-300 text-lg">
                  Você acabou de ganhar <strong className="text-green-400">R$ 997</strong> na simulação.
                  <br />
                  Imagine o que pode fazer com o sistema completo...
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <AudioButton
                  onClick={handleCTAClick}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-400 hover:border-green-300 w-full max-w-md"
                  style={{ animation: "pulse 2s infinite" }}
                >
                  QUERO DOMINAR A IA AGORA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </AudioButton>

                <div className="flex items-center justify-center text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Você não verá essa oferta novamente</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-gray-900/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Serviços que você poderá criar e quanto cobrar
              </h2>
              <p className="text-xl text-gray-300">
                Cada serviço pode ser criado em <span className="font-bold text-green-600">minutos</span> usando IA
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                <h3 className="text-green-600 font-bold text-xl mb-4">SERVIÇOS DIGITAIS:</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Landing pages que convertem</span>
                    <span className="text-green-600 font-bold text-right">R$ 800 - R$ 3.000</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Chatbots de atendimento</span>
                    <span className="text-green-600 font-bold text-right">R$ 1.500 - R$ 5.000</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• E-commerces completos</span>
                    <span className="text-green-600 font-bold text-right">R$ 3.000 - R$ 15.000</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Sistemas de agendamento</span>
                    <span className="text-green-600 font-bold text-right">R$ 2.000 - R$ 8.000</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Apps e sites personalizados</span>
                    <span className="text-green-600 font-bold text-right">R$ 5.000 - R$ 25.000</span>
                  </div>
                </div>
              </AudioCard>

              <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                <h3 className="text-green-600 font-bold text-xl mb-4">SERVIÇOS DE CONTEÚDO:</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Textos para redes sociais</span>
                    <span className="text-green-600 font-bold text-right">R$ 150 - R$ 500</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• E-books e materiais ricos</span>
                    <span className="text-green-600 font-bold text-right">R$ 800 - R$ 2.500</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Scripts de vendas</span>
                    <span className="text-green-600 font-bold text-right">R$ 500 - R$ 2.000</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Consultoria em IA</span>
                    <span className="text-green-600 font-bold text-right">R$ 200 - R$ 500/hora</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-300 flex-1">• Automações completas</span>
                    <span className="text-green-600 font-bold text-right">R$ 3.000 - R$ 12.000</span>
                  </div>
                </div>
              </AudioCard>
            </div>

            <div className="flex justify-center">
              <AudioButton
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-400 hover:border-green-300 w-full max-w-md"
                style={{ animation: "pulse 2s infinite" }}
              >
                QUERO APRENDER AGORA
                <ArrowRight className="ml-2 h-5 w-5" />
              </AudioButton>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 px-4 bg-gray-800/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Alunos reais transformando suas vidas</h2>
              <p className="text-xl text-gray-300">
                Mais de <span className="font-bold text-green-600">8.247 pessoas</span> já estão lucrando com nosso
                método
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold text-xl">
                    M
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-white">Marcos Silva</h3>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="fill-yellow-400 h-4 w-4" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Empresário - São Paulo</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "Em 15 dias criei minha primeira landing page e faturei{" "}
                  <span className="font-bold text-green-600">R$ 4.750</span>. Agora tenho uma carteira de 12 clientes
                  fixos. O método é revolucionário!"
                </p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Faturamento mensal: R$ 18.500</span>
                </div>
              </AudioCard>

              <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold text-xl">
                    A
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-white">Ana Oliveira</h3>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="fill-yellow-400 h-4 w-4" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Designer - Rio de Janeiro</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "Estava desempregada há 6 meses. Hoje ganho{" "}
                  <span className="font-bold text-green-600">R$ 280 a R$ 450 por dia</span> criando conteúdo e
                  automações. Trabalho de casa e tenho mais tempo com minha família!"
                </p>
                <div className="flex items-center text-green-600 text-sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Renda diária média: R$ 365</span>
                </div>
              </AudioCard>

              <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold text-xl">
                    R
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-white">Roberto Mendes</h3>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="fill-yellow-400 h-4 w-4" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Programador - Belo Horizonte</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "Mesmo sendo programador, não sabia usar IA para negócios. Agora faturei{" "}
                  <span className="font-bold text-green-600">R$ 47.000 em 2 meses</span> criando sistemas automatizados.
                  O curso abriu minha mente!"
                </p>
                <div className="flex items-center text-green-600 text-sm">
                  <Target className="h-4 w-4 mr-1" />
                  <span>Meta: R$ 100k em 6 meses</span>
                </div>
              </AudioCard>
            </div>

            <div className="bg-gray-800/80 border border-gray-600 p-6 rounded-xl text-center backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-8 text-green-400">
                <div>
                  <div className="text-3xl font-bold">8.247</div>
                  <div className="text-sm text-gray-300">Alunos Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">98.7%</div>
                  <div className="text-sm text-gray-300">Taxa de Sucesso</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">R$ 2.8M</div>
                  <div className="text-sm text-gray-300">Faturado pelos Alunos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-16 px-4 bg-gray-900/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">O que você vai receber hoje</h2>
              <p className="text-xl text-gray-300">Sistema completo para dominar a IA e gerar renda</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-white">Curso Completo em Vídeo</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 6 horas de conteúdo prático</li>
                    <li>• Passo a passo para cada ferramenta</li>
                    <li>• Casos reais de sucesso</li>
                    <li>• Atualizações constantes</li>
                  </ul>
                </AudioCard>

                <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-white">E-book com 150+ Prompts</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Prompts testados e aprovados</li>
                    <li>• Para todas as ferramentas de IA</li>
                    <li>• Organizados por categoria</li>
                    <li>• Resultados garantidos</li>
                  </ul>
                </AudioCard>

                <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-white">Prompt Prontos</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 50+ prompts de landing pages</li>
                    <li>• Scripts de vendas testados</li>
                    <li>• Propostas comerciais prontas</li>
                    <li>• Contratos e documentos</li>
                  </ul>
                </AudioCard>
              </div>

              <div className="space-y-6">
                <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-white">Grupo VIP no Whatsapp</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Networking com outros alunos</li>
                    <li>• Suporte direto comigo</li>
                    <li>• Oportunidades exclusivas</li>
                    <li>• Lives semanais</li>
                  </ul>
                </AudioCard>

                <AudioCard className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl shadow-sm backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
                      5
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-white">Bônus: Mentoria Exclusiva</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Como criar serviço com prompt</li>
                    <li>• Diversas IA para qualquer serviço</li>
                    <li>• Como criar prompt</li>
                    <li>• Fazer R$1.500 em 7 dias</li>
                  </ul>
                </AudioCard>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4 bg-gray-800/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Oferta expira em {formatTime(timeLeft)}
              </h2>
              <div className="text-red-600 text-xl mb-4">Última oportunidade de virar o jogo com IA</div>
            </div>

            <div className="bg-gray-800/80 border border-gray-700 rounded-3xl p-8 mb-8 backdrop-blur-sm shadow-2xl max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="text-gray-500 line-through text-2xl mb-2">De: R$ 97,00</div>
                <div className="text-5xl font-bold text-green-600 mb-2">R$ 14,90</div>
                <div className="text-red-600 text-lg">Bônus incluso</div>
                <div className="text-yellow-600 text-base mt-2">Desconto de 85% - Apenas hoje!</div>
              </div>

              <div className="bg-gray-700/50 border border-gray-600 p-4 rounded-2xl mb-6 backdrop-blur-sm">
                <h3 className="text-green-400 font-bold text-lg mb-3 text-center">Bônus exclusivo se comprar agora:</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Prompt secreto que gera R$ 500+ por projeto</p>
                  <p>• Mentoria exclusiva</p>
                  <p>• Desafio R$1.500 em 7 dias</p>
                  <p>• Acesso a grupo</p>
                </div>
              </div>

              <AudioButton
                onClick={handleCTAClick}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-6 text-xl border-4 border-green-400 shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl relative overflow-hidden mb-4"
                style={{ animation: "pulse 2s infinite" }}
              >
                <span className="relative z-10">QUERO DOMINAR A IA AGORA!</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-20 animate-pulse"></div>
              </AudioButton>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Acesso imediato após confirmação do pagamento</span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Resultado ou reembolso</span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Suporte whatsapp 24/7</span>
                </div>
              </div>

              <div className="text-center bg-gray-700/50 border border-red-500/50 p-4 rounded-2xl">
                <p className="text-red-400 text-base font-bold">
                  ATENÇÃO: Esta oferta NÃO vai passar de hoje!
                  <br />
                  <span className="text-sm">
                    Dia {(() => {
                      const hoje = new Date()
                      const amanha = new Date(hoje)
                      amanha.setDate(hoje.getDate() + 1)
                      const dia = String(amanha.getDate()).padStart(2, "0")
                      const mes = String(amanha.getMonth() + 1).padStart(2, "0")
                      const ano = amanha.getFullYear()
                      return `${dia}/${mes}/${ano}`
                    })()}, o preço volta para R$ 97,00
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-900/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            </div>

            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem
                value="item-1"
                className="border border-gray-700 mb-3 bg-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-bold px-4 py-3 hover:bg-gray-700/50 text-white">
                  Preciso ter experiência com tecnologia ou IA?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  Não! Nosso método foi desenvolvido para iniciantes absolutos. Tudo é explicado passo a passo, de forma
                  simples e direta. Se você sabe usar um smartphone, consegue aplicar nosso método.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border border-gray-700 mb-3 bg-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-bold px-4 py-3 hover:bg-gray-700/50 text-white">
                  Quanto tempo leva para começar a ganhar dinheiro?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  97% dos nossos alunos começam a receber seus primeiros pagamentos na primeira semana. Tudo depende da
                  sua dedicação, mas com apenas 1 hora por dia, você já consegue criar serviços e oferecê-los.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border border-gray-700 mb-3 bg-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-bold px-4 py-3 hover:bg-gray-700/50 text-white">
                  Preciso investir em ferramentas caras?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  Não! Você pode começar usando ferramentas gratuitas ou com investimento mínimo (menos de R$20 por
                  mês). O método ensina como maximizar seus resultados mesmo com as versões gratuitas das IAs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border border-gray-700 mb-3 bg-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-bold px-4 py-3 hover:bg-gray-700/50 text-white">
                  Como encontro clientes dispostos a pagar?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  O treinamento inclui módulos específicos sobre como encontrar clientes, quanto cobrar e como negociar.
                  Você receberá scripts prontos e estratégias testadas que funcionam mesmo para quem está começando.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border border-gray-700 mb-3 bg-gray-800/80 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-bold px-4 py-3 hover:bg-gray-700/50 text-white">
                  E se eu não conseguir resultados?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  Oferecemos garantia incondicional de 7 dias. Se você seguir o método e não obtiver resultados, ou
                  simplesmente não gostar do conteúdo, devolvemos 100% do seu investimento. Sem perguntas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-center">
              <AudioButton
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-400 hover:border-green-300 w-full max-w-md"
                style={{ animation: "pulse 2s infinite" }}
              >
                GARANTIR MINHA VAGA AGORA
                <ArrowRight className="ml-2 h-5 w-5" />
              </AudioButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 px-4 bg-gray-800 border-t border-gray-700">
          <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm leading-relaxed">
            <p>© 2025 Lucre e Ganhe com IA. Todos os direitos reservados.</p>
            <p className="mt-2">
              Este é um produto educacional. Os resultados podem variar de acordo com a dedicação e aplicação do método.
            </p>
          </div>
        </footer>

        {/* Floating CTA for mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-green-500/30 p-4 z-50 md:hidden backdrop-blur-sm">
          <AudioButton
            onClick={handleCTAClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 border-2 border-green-400 text-lg"
            style={{ animation: "pulse 2s infinite" }}
          >
            QUERO DOMINAR A IA AGORA!
            <ArrowRight className="ml-2 h-5 w-5" />
          </AudioButton>
          <p className="text-center text-xs text-gray-400 mt-2">Oferta expira em {formatTime(timeLeft)} • R$ 14,90</p>
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 transition-all duration-200 hover:bg-blue-700 md:bottom-6"
            aria-label="Voltar ao topo"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  )
}
