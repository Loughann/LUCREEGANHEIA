"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PagePreview } from "@/components/page-preview"
import { AudioButton } from "@/components/audio-button"
import { AudioCard } from "@/components/audio-card"
import { useAudioContext } from "@/components/audio-provider"
import {
  Terminal,
  Wand2,
  ArrowRight,
  Palette,
  LayoutGrid,
  Type,
  ImageIcon,
  Shield,
  ChevronRight,
  Smartphone,
  Maximize,
  Minimize,
  X,
} from "lucide-react"
import { StepTransition } from "@/components/step-transition"
import { InstructionPopup } from "@/components/instruction-popup"

// Define the stages of personalization
const TOTAL_STAGES = 5

// Função para extrair o esquema de cores do prompt
const extractColorScheme = (prompt: string): string => {
  const promptLower = prompt.toLowerCase()
  if (promptLower.includes("roxo") || promptLower.includes("purple")) {
    return "purple"
  } else if (promptLower.includes("verde") || promptLower.includes("green")) {
    return "green"
  } else if (promptLower.includes("azul") || promptLower.includes("blue")) {
    return "blue"
  }
  return "blue" // valor padrão
}

export default function PersonalizePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [pageSettings, setPageSettings] = useState({
    layout: "modern",
    colorScheme: "blue",
    typography: "modern",
    headerStyle: "minimal",
    credibilityElements: "none",
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string>("layout")
  const [showTransition, setShowTransition] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [hasShownSuccessInstruction, setHasShownSuccessInstruction] = useState(false)
  const [instructionContent, setInstructionContent] = useState({
    title: "👋 Vamos começar!",
    content:
      "TOQUE em uma das opções abaixo para personalizar o layout da sua página. Escolha a que mais combina com você!",
  })
  const [showButtonAlert, setShowButtonAlert] = useState(false)
  const [instructionsDismissed, setInstructionsDismissed] = useState(false)

  const { playSound } = useAudioContext()

  // Categories for each stage
  const stageCategories = {
    1: "layout",
    2: "colorScheme",
    3: "typography",
    4: "headerStyle",
    5: "credibilityElements",
  }

  // Define prompts for each category
  const categoryPrompts = {
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
        text: "Crie um cabeçalho minimalista com logo e navegação limpa para uma aparência profissional e focada no conteúdo.",
        value: "minimal",
      },
      {
        text: "Desenvolva um cabeçalho hero impactante com imagem de fundo e chamada para ação destacada para maior conversão.",
        value: "hero",
      },
      {
        text: "Adicione uma barra de escassez no topo do cabeçalho com mensagem de Black Friday e frete grátis para aumentar conversões.",
        value: "scarcity",
      },
    ],
    credibilityElements: [
      {
        text: "Adicione uma seção de avaliações e depoimentos de clientes para aumentar a confiança e credibilidade.",
        value: "testimonials",
      },
      {
        text: "Inclua uma vitrine de produtos em destaque para mostrar visualmente suas ofertas principais.",
        value: "products",
      },
      {
        text: "Implemente selos de segurança e garantias para transmitir confiabilidade e reduzir objeções de compra.",
        value: "security",
      },
    ],
  }

  useEffect(() => {
    // Play entrance sound
    playSound("transition")

    // Check if user has completed contratacao
    const name = localStorage.getItem("playerName")
    const hasCompletedContratacao = localStorage.getItem("hasCompletedContratacao")

    if (!name) {
      router.push("/usuario")
      return
    }

    // Check if user has completed contratacao step
    if (!hasCompletedContratacao) {
      router.push("/contratacao")
      return
    }

    if (name && hasCompletedContratacao) {
      setPlayerName(name)
      setIsLoaded(true)
      setCurrentCategory(stageCategories[currentStage as keyof typeof stageCategories])

      // Mostrar instrução para a etapa atual
      updateInstructionForStage(currentStage)
    }

    // Adicionar listener para tecla ESC
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [router, currentStage, isFullscreen, playSound])

  const handleGenerate = (prompt: string, category: string, value: string) => {
    playSound("button-press")
    setIsGenerating(true)
    setShowInstruction(false) // Esconder instrução durante geração

    // Store the prompt for reference
    localStorage.setItem(`prompt_stage_${currentStage}`, prompt)

    // Determine the correct value for color scheme
    let finalValue = value

    // Specific check for color scheme
    if (category === "colorScheme") {
      // Explicitly check prompt content to determine color
      const promptLower = prompt.toLowerCase()
      if (promptLower.includes("roxo") || promptLower.includes("purple")) {
        finalValue = "purple"
      } else if (promptLower.includes("verde") || promptLower.includes("green")) {
        finalValue = "green"
      } else if (promptLower.includes("azul") || promptLower.includes("blue")) {
        finalValue = "blue"
      }

      console.log(`Color scheme detected in prompt: ${finalValue}`)
    }

    // Simulate AI generation
    setTimeout(() => {
      // Update page settings based on the selected prompt
      setPageSettings((prev) => {
        const newSettings = {
          ...prev,
          [category]: finalValue,
        }
        console.log("New settings applied:", newSettings)
        return newSettings
      })

      setIsGenerating(false)
      playSound("success")

      // Mark this stage as completed
      if (!completedStages.includes(currentStage)) {
        setCompletedStages([...completedStages, currentStage])
      }

      setShowNextButton(true)

      // Mostrar alerta sutil sobre localização do botão - duração maior
      setTimeout(() => {
        setShowButtonAlert(true)
        // Auto-hide após 10 segundos (mais tempo)
        setTimeout(() => setShowButtonAlert(false), 10000)
      }, 800)

      // Mostrar instrução de sucesso apenas uma vez por etapa
      if (!hasShownSuccessInstruction) {
        setTimeout(() => {
          setInstructionContent({
            title: "✅ Perfeito!",
            content: `Sua ${getCategoryTitle(currentCategory).toLowerCase()} foi aplicada! Agora TOQUE no botão verde abaixo para continuar.`,
          })
          setShowInstruction(true)
          setHasShownSuccessInstruction(true)
        }, 1000)
      }
    }, 2000)
  }

  // Função para rolar até o botão
  const scrollToButton = () => {
    const buttonElement = document.getElementById("next-button")
    if (buttonElement) {
      buttonElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      setShowButtonAlert(false)
    }
  }

  // Modify handleNextStage function to mark personalization completion
  const handleNextStage = () => {
    if (currentStage < TOTAL_STAGES) {
      playSound("level-up")
      setShowTransition(true)
    } else {
      // All stages completed, mark as completed and go to contratacao again
      playSound("level-up")
      localStorage.setItem("hasCompletedPersonalizacao", "true")
      router.push("/contratacao")
    }
  }

  const handleTransitionComplete = () => {
    setShowTransition(false)
    const nextStage = currentStage + 1
    setCurrentStage(nextStage)
    setCurrentCategory(stageCategories[nextStage as keyof typeof stageCategories])
    setShowNextButton(false)
    setShowButtonAlert(false)
    setInstructionsDismissed(false) // Reset para nova etapa

    // Reset success instruction flag for new stage
    setHasShownSuccessInstruction(false)

    // Scroll to top after transition completes - with delay to ensure DOM is updated
    setTimeout(() => {
      // Try multiple methods to ensure scroll works
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })

      // Fallback method
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Also try scrolling the main container if it exists
      const mainContainer = document.querySelector("main") || document.querySelector("[data-main-content]")
      if (mainContainer) {
        mainContainer.scrollTop = 0
      }
    }, 100)

    // Mostrar instrução para a nova etapa
    if (nextStage <= TOTAL_STAGES) {
      setTimeout(() => {
        updateInstructionForStage(nextStage)
      }, 200)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "layout":
        return <LayoutGrid className="h-5 w-5" />
      case "colorScheme":
        return <Palette className="h-5 w-5" />
      case "typography":
        return <Type className="h-5 w-5" />
      case "headerStyle":
        return <ImageIcon className="h-5 w-5" />
      case "credibilityElements":
        return <Shield className="h-5 w-5" />
      default:
        return <Wand2 className="h-5 w-5" />
    }
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "layout":
        return "Layout da Página"
      case "colorScheme":
        return "Esquema de Cores"
      case "typography":
        return "Tipografia"
      case "headerStyle":
        return "Estilo do Cabeçalho"
      case "credibilityElements":
        return "Elementos de Credibilidade"
      default:
        return "Personalização"
    }
  }

  const updateInstructionForStage = (stage: number) => {
    const instructions = {
      1: {
        title: "📱 Etapa 1/5: Layout",
        content:
          "TOQUE em uma das 3 opções abaixo para escolher como sua página será organizada. Deslize para ver todas as opções!",
      },
      2: {
        title: "🎨 Etapa 2/5: Cores",
        content: "Agora SELECIONE a cor principal da sua página. TOQUE na opção que mais combina com sua marca!",
      },
      3: {
        title: "✍️ Etapa 3/5: Fontes",
        content: "ESCOLHA o estilo de texto da sua página. TOQUE na tipografia que melhor representa seu negócio!",
      },
      4: {
        title: "🖼️ Etapa 4/5: Cabeçalho",
        content: "DEFINA como será o topo da sua página. TOQUE no estilo de cabeçalho que mais te agrada!",
      },
      5: {
        title: "🛡️ Etapa 5/5: Credibilidade",
        content: "Por último, ADICIONE elementos que geram confiança. TOQUE na opção que mais convence seus clientes!",
      },
    }

    setInstructionContent(instructions[stage] || instructions[1])
    setShowInstruction(true)
    // Reset success instruction flag when showing initial instruction
    setHasShownSuccessInstruction(false)
  }

  const handleFullscreenOpen = () => {
    playSound("whoosh")
    setIsFullscreen(true)
    setInstructionsDismissed(true) // Marcar que instruções foram dispensadas
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-t-2 border-b-2 border-green-500 rounded-full mb-4"></div>
          <p className="text-green-500 font-semibold animate-pulse">Carregando seu app...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Mobile App Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-white" />
              <h1 className="text-lg font-bold text-white">Personalizar</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white font-semibold text-sm">
                {currentStage}/{TOTAL_STAGES}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-gray-800/50">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStage / TOTAL_STAGES) * 100}%` }}
          ></div>
        </div>
        <p className="text-gray-300 text-sm mt-2 text-center">
          {Math.round((currentStage / TOTAL_STAGES) * 100)}% concluído
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6" data-main-content>
        {/* Category Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
            {getCategoryIcon(currentCategory)}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{getCategoryTitle(currentCategory)}</h2>
          <p className="text-gray-400 text-sm">Escolha a opção que mais combina com você</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {categoryPrompts[currentCategory as keyof typeof categoryPrompts]?.map((prompt, index) => (
            <AudioCard
              key={index}
              onClick={() => handleGenerate(prompt.text, currentCategory, prompt.value)}
              disabled={isGenerating}
              className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-left transition-all duration-200 hover:bg-gray-700/80 hover:border-green-500/50 active:scale-95 disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium text-sm leading-relaxed">{prompt.text}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0" />
              </div>
            </AudioCard>
          ))}
        </div>

        {/* Preview */}
        {!isGenerating && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Preview da Página</h3>
              <div className="flex items-center space-x-2">
                <AudioButton
                  onClick={handleFullscreenOpen}
                  soundType="whoosh"
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                  title="Ver em tela cheia"
                >
                  <Maximize className="h-4 w-4 text-green-400" />
                </AudioButton>
                <Terminal className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3 min-h-[200px]">
              <PagePreview settings={pageSettings} isGenerating={isGenerating} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-green-500 rounded-full mb-4"></div>
            <p className="text-green-400 font-semibold">Aplicando personalização...</p>
            <p className="text-gray-400 text-sm mt-1">Aguarde alguns segundos</p>
          </div>
        )}

        {/* Button Location Alert - Clicável para direcionar - não mostrar em tela cheia */}
        {showButtonAlert && !isFullscreen && (
          <div className="fixed bottom-20 left-4 right-4 z-50">
            <AudioButton
              onClick={scrollToButton}
              soundType="notification"
              className="w-full bg-green-500/20 backdrop-blur-md border border-green-400/40 rounded-2xl p-4 shadow-2xl animate-slide-up hover:bg-green-500/30 transition-all duration-200 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-very-slow"></div>
                  <p className="text-green-300 text-sm font-medium">👇 Toque aqui para ir ao botão verde</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowButtonAlert(false)
                  }}
                  className="text-green-400/60 hover:text-green-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </AudioButton>
          </div>
        )}

        {/* Next Button */}
        {showNextButton && (
          <AudioButton
            id="next-button"
            onClick={handleNextStage}
            soundType="level-up"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 active:scale-95 shadow-lg animate-pulse-very-slow"
          >
            <div className="flex items-center justify-center space-x-2">
              {currentStage < TOTAL_STAGES ? (
                <>
                  <span>PRÓXIMA ETAPA</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  <Terminal className="h-5 w-5" />
                  <span>FINALIZAR PROJETO</span>
                </>
              )}
            </div>
          </AudioButton>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[60] bg-black">
          {/* Header da tela cheia */}
          <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-400" />
                <h3 className="text-white font-semibold">Preview - {getCategoryTitle(currentCategory)}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <AudioButton
                  onClick={() => setIsFullscreen(false)}
                  soundType="whoosh"
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                  title="Sair da tela cheia"
                >
                  <Minimize className="h-4 w-4 text-green-400" />
                </AudioButton>
                <AudioButton
                  onClick={() => setIsFullscreen(false)}
                  soundType="error"
                  className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  title="Fechar"
                >
                  <X className="h-4 w-4 text-red-400" />
                </AudioButton>
              </div>
            </div>
          </div>

          {/* Conteúdo da tela cheia */}
          <div className="h-[calc(100vh-73px)] overflow-auto bg-white">
            <PagePreview settings={pageSettings} isGenerating={isGenerating} />
          </div>

          {/* Controles inferiores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="text-green-400 text-sm font-medium">
                  Etapa {currentStage}/{TOTAL_STAGES}
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="text-gray-300 text-sm">{getCategoryTitle(currentCategory)}</div>
                <div className="w-px h-4 bg-gray-600"></div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ESC para sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step transition overlay */}
      <StepTransition
        isVisible={showTransition}
        onComplete={handleTransitionComplete}
        currentStep={currentStage}
        isPersonalization={true}
      />

      {/* Instruction Popup - não mostrar em tela cheia */}
      <InstructionPopup
        isOpen={showInstruction && !isFullscreen && !instructionsDismissed}
        onClose={() => {
          setShowInstruction(false)
          setInstructionsDismissed(true)
        }}
        title={instructionContent.title}
        content={instructionContent.content}
        allowClose={true}
      />

      <style jsx>{`
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse-very-slow {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(0.96); 
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        
        .animate-pulse-very-slow {
          animation: pulse-very-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
