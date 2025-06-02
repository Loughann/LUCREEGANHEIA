"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CheckCircle,
  Star,
  Users,
  ArrowRight,
  Lock,
  Shield,
  Award,
  ChevronUp,
  Zap,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Clock, Code, Gift } from "lucide-react"
import { AudioButton } from "@/components/audio-button"
import { AudioCard } from "@/components/audio-card"
import { AudioToggle } from "@/components/audio-toggle"
import { useAudio } from "@/hooks/use-audio"

export default function VendaPage() {
  const router = useRouter()
  const { playSound } = useAudio()
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 37, seconds: 22 })
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [remainingSpots, setRemainingSpots] = useState(7)
  const topRef = useRef(null)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fade-in animation
  useEffect(() => {
    setIsVisible(true)
    playSound("whoosh")
  }, [playSound])

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
      setShowScrollTop(position > 700)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Simulate decreasing spots
  useEffect(() => {
    const spotTimer = setInterval(() => {
      if (Math.random() > 0.7 && remainingSpots > 1) {
        setRemainingSpots((prev) => {
          playSound("notification")
          return prev - 1
        })
      }
    }, 45000)

    return () => clearInterval(spotTimer)
  }, [remainingSpots, playSound])

  // Exit intent detection
  useEffect(() => {
    let mouseLeaveTimer: NodeJS.Timeout

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownPopup) {
        setShowExitPopup(true)
        setHasShownPopup(true)
        playSound("notification")
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShownPopup) {
        e.preventDefault()
        setShowExitPopup(true)
        setHasShownPopup(true)
        playSound("notification")
        return (e.returnValue = "")
      }
    }

    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY - 100 && currentScrollY < 200 && !hasShownPopup) {
        clearTimeout(mouseLeaveTimer)
        mouseLeaveTimer = setTimeout(() => {
          setShowExitPopup(true)
          setHasShownPopup(true)
          playSound("notification")
        }, 500)
      }
      lastScrollY = currentScrollY
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(mouseLeaveTimer)
    }
  }, [hasShownPopup, playSound])

  const handleExitPopupTest = () => {
    playSound("success")
    setShowExitPopup(false)
    sessionStorage.setItem("fromExitPopup", "true")
    sessionStorage.setItem("fromVenda", "true")
    router.push("/usuario")
  }

  const handleStartSimulation = () => {
    playSound("levelUp")
    sessionStorage.setItem("fromVenda", "true")
    router.push("/usuario")
  }

  const scrollToForm = () => {
    playSound("whoosh")
    document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    playSound("whoosh")
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white" ref={topRef}>
      <AudioToggle />

      {/* Sticky header with countdown */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-black to-gray-900 border-b border-green-500/30 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <div className="text-xl font-bold mb-2 md:mb-0 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-2xl font-extrabold tracking-tight">
              CRIE E LUCRE
            </span>
            <span className="text-white ml-1">com IA</span>
            <div className="absolute -top-3 -right-8 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              PRO
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section
        className={`py-10 md:py-16 bg-gradient-to-b from-black to-gray-900 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-green-400 to-green-600 opacity-30 rounded-full"></div>
                <div className="w-32 h-32 relative">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2023%20de%20mai.%20de%202025%2C%2018_45_21-RaaC2Jnvae1DcBiIgcUTtjWn4NnJ7p.png"
                    alt="Inteligência Artificial"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              <div className="mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-5xl md:text-7xl">
                  CRIE E LUCRE
                </span>
              </div>
              <span className="text-white">Ganhe</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                R$150 a R$500 Por Dia
              </span>{" "}
              <span className="text-white">Com IA</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Mesmo que você <span className="underline decoration-red-500">não tenha experiência</span>, não entenda de
              tecnologia e tenha apenas <span className="font-bold text-white">1 hora livre por dia</span>
            </p>

            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Star className="fill-yellow-400 h-6 w-6" />
                <Star className="fill-yellow-400 h-6 w-6" />
                <Star className="fill-yellow-400 h-6 w-6" />
                <Star className="fill-yellow-400 h-6 w-6" />
                <Star className="fill-yellow-400 h-6 w-6" />
                <span className="text-white ml-2">(4.9/5 - 327 avaliações)</span>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }} className="mb-4">
              <AudioButton
                onClick={handleStartSimulation}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold px-8 py-6 rounded-full shadow-xl transition-transform hover:scale-105 relative overflow-hidden"
                soundType="click"
              >
                <span className="absolute inset-0 bg-white opacity-20 animate-pulse-fast rounded-full"></span>
                <span className="relative flex items-center">
                  QUERO TESTAR AGORA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </AudioButton>
            </motion.div>

            <p className="text-gray-400 mt-4 flex items-center justify-center">
              <Lock className="inline h-4 w-4 mr-1" /> Teste 100% Grátis e Sem Compromisso
            </p>

            <div className="mt-6 bg-gray-800/50 rounded-lg p-3 border border-green-500/20">
              <p className="text-sm text-gray-300 flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <span>
                  <span className="text-yellow-400 font-bold">Apenas {remainingSpots} vagas</span> restantes para simulação gratuita hoje
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-green-500">PESSOAS COMUNS</span> TRANSFORMANDO SUAS VIDAS
            </h2>
            <p className="text-xl text-gray-300">
              Mais de <span className="font-bold text-green-400">3.742 alunos</span> já estão lucrando com nosso método
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <AudioCard className="bg-gray-800 border-green-500/30 p-6 rounded-xl shadow-lg hover:shadow-green-500/10 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Marcos Silva</h3>
                  <div className="flex text-yellow-400">
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                "Nunca imaginei que seria tão fácil. Em 2 semanas já fiz{" "}
                <span className="font-bold text-green-400">R$ 2.750</span> criando landing pages para pequenas empresas.
                O método é simples e qualquer um consegue aplicar!"
              </p>
              <div className="mt-3 text-xs text-gray-400">
                <span className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1 text-green-500" /> Verificado em 12/05/2025
                </span>
              </div>
            </AudioCard>

            {/* Testimonial 2 */}
            <AudioCard className="bg-gray-800 border-green-500/30 p-6 rounded-xl shadow-lg hover:shadow-green-500/10 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-xl">
                  A
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Ana Oliveira</h3>
                  <div className="flex text-yellow-400">
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                "Comecei do zero, sem entender nada de IA. Hoje faço{" "}
                <span className="font-bold text-green-400">R$ 180 a R$ 300 por dia</span> criando conteúdo para redes
                sociais. Melhor investimento que já fiz!"
              </p>
              <div className="mt-3 text-xs text-gray-400">
                <span className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1 text-green-500" /> Verificado em 08/05/2025
                </span>
              </div>
            </AudioCard>

            {/* Testimonial 3 */}
            <AudioCard className="bg-gray-800 border-green-500/30 p-6 rounded-xl shadow-lg hover:shadow-green-500/10 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-xl">
                  R
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Roberto Mendes</h3>
                  <div className="flex text-yellow-400">
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                    <Star className="fill-yellow-400 h-4 w-4" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                "Estava desempregado há 3 meses. Agora ganho{" "}
                <span className="font-bold text-green-400">mais de R$ 5.000 por mês</span> criando textos e designs com
                IA. O método é direto ao ponto e funciona de verdade!"
              </p>
              <div className="mt-3 text-xs text-gray-400">
                <span className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1 text-green-500" /> Verificado em 15/05/2025
                </span>
              </div>
            </AudioCard>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              <span className="text-green-400 font-bold">98.7% dos alunos</span> relatam resultados positivos nas
              primeiras 2 semanas
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              NOSSO <span className="text-green-500">MÉTODO COMPROVADO</span> DE 3 PASSOS
            </h2>
            <p className="text-xl text-gray-300">
              <span className="font-bold text-green-400">97% dos alunos</span> começam a lucrar na primeira semana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <AudioCard className="bg-gray-800 border-green-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-black font-bold px-3 py-1 rounded-bl-lg">
                PASSO 1
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-2xl mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Aprenda a Usar as IAs</h3>
              <p className="text-gray-300">
                Nosso treinamento simplificado ensina como usar as ferramentas de IA mais poderosas do mercado, mesmo
                que você nunca tenha usado tecnologia antes.
              </p>
              <div className="mt-4 text-green-400 text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-1" /> Tempo de aprendizado: apenas 30 minutos
              </div>
            </AudioCard>

            {/* Step 2 */}
            <AudioCard className="bg-gray-800 border-green-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-black font-bold px-3 py-1 rounded-bl-lg">
                PASSO 2
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-2xl mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Crie Serviços de Alta Demanda</h3>
              <p className="text-gray-300">
                Descubra os 7 serviços mais lucrativos que você pode oferecer usando IA e como entregar resultados
                profissionais em minutos.
              </p>
              <div className="mt-4 text-green-400 text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-1" /> Crie seu primeiro serviço em 15 minutos
              </div>
            </AudioCard>

            {/* Step 3 */}
            <AudioCard className="bg-gray-800 border-green-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-black font-bold px-3 py-1 rounded-bl-lg">
                PASSO 3
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-2xl mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Comece a Receber Pagamentos</h3>
              <p className="text-gray-300">
                Aprenda a encontrar clientes dispostos a pagar de R$150 a R$500 por serviços que você cria em minutos
                usando IA.
              </p>
              <div className="mt-4 text-green-400 text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-1" /> Receba seu primeiro pagamento hoje mesmo
              </div>
            </AudioCard>
          </div>

          <div className="mt-10 text-center">
            <motion.div whileTap={{ scale: 0.95 }}>
              <AudioButton
                onClick={handleStartSimulation}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold px-8 py-5 rounded-full shadow-xl transition-transform hover:scale-105 relative overflow-hidden"
                soundType="click"
              >
                <span className="absolute inset-0 bg-white opacity-20 animate-pulse-fast rounded-full"></span>
                <span className="relative flex items-center">
                  QUERO COMEÇAR AGORA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </AudioButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What you'll get */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O QUE VOCÊ VAI <span className="text-green-500">RECEBER HOJE</span>
              </h2>
              <p className="text-xl text-gray-300">Teste grátis do método que já transformou milhares de vidas</p>
            </div>

            <div className="bg-gray-800 border border-green-500/30 rounded-xl p-6 mb-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold">Simulação Prática do Método</span>
                    <p className="text-gray-300">
                      Experimente na prática como é fácil criar serviços com IA e receber pagamentos
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold">Acesso à Primeira Aula do Treinamento</span>
                    <p className="text-gray-300">Aprenda os fundamentos para começar a lucrar com IA imediatamente</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold">Lista dos 7 Serviços Mais Lucrativos</span>
                    <p className="text-gray-300">
                      Descubra quais serviços têm maior demanda e pagam melhor no mercado atual
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold">Suporte por 7 Dias</span>
                    <p className="text-gray-300">
                      Tire suas dúvidas e receba orientação personalizada durante o período de teste
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Signup form */}
            <div
              id="signup-form"
              className="bg-gray-800 border border-green-500/30 rounded-xl p-8 mb-8 relative overflow-hidden"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl blur-xl animate-pulse-slow"></div>

              <div className="relative">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  COMECE <span className="text-green-500">AGORA MESMO</span> - VAGAS LIMITADAS!
                </h3>

                <div className="mb-6">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <AudioButton
                      onClick={handleStartSimulation}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold py-6 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center relative overflow-hidden"
                      soundType="click"
                    >
                      <span className="absolute inset-0 bg-white opacity-20 animate-pulse-fast rounded-full"></span>
                      <span className="relative flex items-center">
                        SIMULAÇÃO GRATUITA
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </AudioButton>
                  </motion.div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>100% Seguro</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    <span>Sem Compromisso</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Apenas {remainingSpots} vagas restantes</span>
                  </div>
                </div>

                <div className="mt-4 bg-black/50 p-3 rounded-lg border border-yellow-500/30 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-100">
                    <span className="font-bold">ATENÇÃO:</span> Devido à alta demanda, não podemos garantir que estas
                    vagas gratuitas continuarão disponíveis após hoje.
                  </p>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-gradient-to-r from-green-900/20 to-green-700/20 border border-green-500/30 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <Award className="h-16 w-16 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">GARANTIA INCONDICIONAL DE 7 DIAS</h3>
                  <p className="text-gray-300">
                    Se você não começar a lucrar com IA nos primeiros 7 dias ou não ficar 100% satisfeito com o método,
                    devolvemos seu investimento integralmente. Sem perguntas, sem burocracia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                PERGUNTAS <span className="text-green-500">FREQUENTES</span>
              </h2>
            </div>

            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="item-1" className="border-green-500/30 mb-3 bg-gray-800 rounded-xl overflow-hidden">
                <AccordionTrigger
                  className="text-left font-bold px-4 py-3 hover:bg-gray-700/50"
                  onClick={() => playSound("click")}
                >
                  Preciso ter experiência com tecnologia ou IA?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  Não! Nosso método foi desenvolvido para iniciantes absolutos. Tudo é explicado passo a passo, de forma
                  simples e direta. Se você sabe usar um smartphone, consegue aplicar nosso método.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-green-500/30 mb-3 bg-gray-800 rounded-xl overflow-hidden">
                <AccordionTrigger
                  className="text-left font-bold px-4 py-3 hover:bg-gray-700/50"
                  onClick={() => playSound("click")}
                >
                  Quanto tempo leva para começar a ganhar dinheiro?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  97% dos nossos alunos começam a receber seus primeiros pagamentos na primeira semana. Tudo depende da
                  sua dedicação, mas com apenas 1 hora por dia, você já consegue criar serviços e oferecê-los.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-green-500/30 mb-3 bg-gray-800 rounded-xl overflow-hidden">
                <AccordionTrigger
                  className="text-left font-bold px-4 py-3 hover:bg-gray-700/50"
                  onClick={() => playSound("click")}
                >
                  Preciso investir em ferramentas caras?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  Não! Você pode começar usando ferramentas gratuitas ou com investimento mínimo (menos de R$20 por
                  mês). O método ensina como maximizar seus resultados mesmo com as versões gratuitas das IAs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-green-500/30 mb-3 bg-gray-800 rounded-xl overflow-hidden">
                <AccordionTrigger
                  className="text-left font-bold px-4 py-3 hover:bg-gray-700/50"
                  onClick={() => playSound("click")}
                >
                  Como encontro clientes dispostos a pagar?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  O treinamento inclui módulos específicos sobre como encontrar clientes, quanto cobrar e como negociar.
                  Você receberá scripts prontos e estratégias testadas que funcionam mesmo para quem está começando.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-green-500/30 mb-3 bg-gray-800 rounded-xl overflow-hidden">
                <AccordionTrigger
                  className="text-left font-bold px-4 py-3 hover:bg-gray-700/50"
                  onClick={() => playSound("click")}
                >
                  E se eu não conseguir resultados?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-4">
                  Oferecemos garantia incondicional de 7 dias. Se você seguir o método e não obtiver resultados, ou
                  simplesmente não gostar do conteúdo, devolvemos 100% do seu investimento. Sem perguntas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center">
              <motion.div whileTap={{ scale: 0.95 }}>
                <AudioButton
                  onClick={handleStartSimulation}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black text-xl font-bold px-8 py-6 rounded-full shadow-xl transition-transform hover:scale-105 relative overflow-hidden"
                  soundType="click"
                >
                  <span className="absolute inset-0 bg-white opacity-20 animate-pulse-fast rounded-full"></span>
                  <span className="relative flex items-center">
                    QUERO CRIAR AGORA
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </AudioButton>
              </motion.div>
              <p className="text-gray-400 mt-4">
                <Lock className="inline h-4 w-4 mr-1" /> Teste 100% Grátis e Sem Compromisso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-green-500/30">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Crie e Lucre com IA. Todos os direitos reservados.</p>
          <p className="mt-2">
            Este é um produto educacional. Os resultados podem variar de acordo com a dedicação e aplicação do método.
          </p>
        </div>
      </footer>

      {/* Floating CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-green-500/30 p-4 z-40">
        <motion.div whileTap={{ scale: 0.95 }}>
          <AudioButton
            onClick={handleStartSimulation}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-4 rounded-full shadow-lg relative overflow-hidden"
            soundType="click"
          >
            <span className="absolute inset-0 bg-white opacity-20 animate-pulse-fast rounded-full"></span>
            <span className="relative flex items-center justify-center">
              GARANTIR MINHA VAGA
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </AudioButton>
        </motion.div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Restam apenas {remainingSpots} vagas hoje para simulação
        </p>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <AudioButton
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 bg-green-500 text-black p-3 rounded-full shadow-lg z-40 animate-bounce-slow"
          aria-label="Voltar ao topo"
          soundType="whoosh"
        >
          <ChevronUp className="h-5 w-5" />
        </AudioButton>
      )}

      {/* Exit Intent Popup */}
      <Dialog open={showExitPopup} onOpenChange={setShowExitPopup}>
        <DialogContent className="sm:max-w-md w-[95%] max-w-[400px] bg-black border-2 border-red-500 text-white p-0 gap-0 rounded-xl overflow-hidden">
          <div className="relative">
            <div className="flex justify-between items-center p-4 border-b border-red-500/30">
              <div className="w-6"></div>
              <AudioButton
                onClick={() => setShowExitPopup(false)}
                className="text-gray-400 hover:text-white transition-colors bg-transparent border-none p-0"
                soundType="click"
              >
                <X className="h-5 w-5" />
              </AudioButton>
            </div>

            <div className="p-6 text-center">
              <div className="mb-4">
                <div className="text-3xl mb-2">⚠️</div>
                <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-2">Ei! Antes de sair…</h2>
                <h3 className="text-lg md:text-xl font-bold mb-4">
                  Que tal ver na prática como a IA pode te gerar renda?
                </h3>
              </div>

              <p className="text-gray-300 mb-6 text-sm md:text-base">
                Teste agora, sem compromisso, como é fácil criar uma página com IA como se fosse para um cliente real.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm md:text-base">Criação em minutos</span>
                </div>
                <div className="flex items-center">
                  <Code className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm md:text-base">Sem precisar saber programar</span>
                </div>
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm md:text-base">Primeira missão 100% gratuita</span>
                </div>
              </div>

              <AudioButton
                onClick={handleExitPopupTest}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-xl transition-all hover:scale-105 mb-4"
                soundType="success"
              >
                Fazer o Teste Agora
              </AudioButton>

              <p className="text-xs text-gray-400 flex items-center justify-center">
                <Gift className="h-3 w-3 mr-1 text-yellow-500" />
                Quem concluir o teste recebe um presente surpresa. Válido hoje.
              </p>
            </div>

            <div className="absolute inset-0 border-2 border-red-500 rounded-xl animate-pulse pointer-events-none"></div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
