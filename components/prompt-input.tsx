"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PromptInputProps {
  category: string
  onGenerate: (prompt: string, category: string, value: string) => void
  isGenerating: boolean
  suggestedPrompts: Array<{ text: string; value: string }>
}

export function PromptInput({ category, onGenerate, isGenerating, suggestedPrompts }: PromptInputProps) {
  const [prompt, setPrompt] = useState("")
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingText, setCurrentTypingText] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)
  const conversationEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation, currentTypingText])

  // Typing effect for assistant responses
  useEffect(() => {
    if (!isTyping || !conversation.length) return

    const lastMessage = conversation[conversation.length - 1]
    if (lastMessage.role !== "assistant") return

    const text = lastMessage.content
    if (typingIndex < text.length) {
      const timer = setTimeout(() => {
        setCurrentTypingText(text.substring(0, typingIndex + 1))
        setTypingIndex(typingIndex + 1)
      }, 10) // Speed of typing
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [isTyping, typingIndex, conversation])

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return

    // Add user message to conversation
    setConversation([...conversation, { role: "user", content: prompt }])

    // Determine which value to use based on the prompt content
    let selectedValue = suggestedPrompts[0].value // Default to first suggestion

    // Verificação específica para esquema de cores
    if (category === "colorScheme") {
      const promptLower = prompt.toLowerCase()
      if (promptLower.includes("roxo") || promptLower.includes("purple")) {
        selectedValue = "purple"
      } else if (promptLower.includes("verde") || promptLower.includes("green")) {
        selectedValue = "green"
      } else if (promptLower.includes("azul") || promptLower.includes("blue")) {
        selectedValue = "blue"
      }

      console.log(`Esquema de cores detectado: ${selectedValue} para prompt: ${prompt}`)
    } else if (category === "headerStyle") {
      // Verificação específica para estilo de cabeçalho
      const promptLower = prompt.toLowerCase()
      if (
        promptLower.includes("escassez") ||
        promptLower.includes("black friday") ||
        promptLower.includes("frete grátis") ||
        promptLower.includes("oferta") ||
        promptLower.includes("limitado") ||
        promptLower.includes("promoção")
      ) {
        selectedValue = "scarcity"
      } else if (
        promptLower.includes("hero") ||
        promptLower.includes("impactante") ||
        promptLower.includes("imagem de fundo")
      ) {
        selectedValue = "hero"
      } else {
        selectedValue = "minimal"
      }
    } else if (category === "credibilityElements") {
      // Verificação específica para elementos de credibilidade
      const promptLower = prompt.toLowerCase()
      if (
        promptLower.includes("avaliações") ||
        promptLower.includes("depoimentos") ||
        promptLower.includes("testemunhos") ||
        promptLower.includes("provas sociais") ||
        promptLower.includes("clientes")
      ) {
        selectedValue = "testimonials"
      } else if (
        promptLower.includes("produtos") ||
        promptLower.includes("vitrine") ||
        promptLower.includes("ofertas") ||
        promptLower.includes("catálogo")
      ) {
        selectedValue = "products"
      } else if (
        promptLower.includes("segurança") ||
        promptLower.includes("selo") ||
        promptLower.includes("garantia") ||
        promptLower.includes("certificado") ||
        promptLower.includes("confiança")
      ) {
        selectedValue = "security"
      }
    } else {
      // Para outras categorias, tente corresponder com as sugestões
      for (const suggestion of suggestedPrompts) {
        const keywords = suggestion.text.toLowerCase().split(" ")
        const promptLower = prompt.toLowerCase()

        if (keywords.filter((keyword) => keyword.length > 4 && promptLower.includes(keyword)).length >= 2) {
          selectedValue = suggestion.value
          break
        }
      }
    }

    // Call the onGenerate function with the prompt and selected value
    onGenerate(prompt, category, selectedValue)

    // Prepare for assistant response
    setTimeout(() => {
      // Add assistant message to conversation
      const response = `Aplicando personalização de ${getCategoryName(category)} conforme solicitado. Atualizando a visualização da página...`

      setConversation((prev) => [...prev, { role: "assistant", content: response }])

      // Start typing effect
      setIsTyping(true)
      setCurrentTypingText("")
      setTypingIndex(0)

      // Clear the prompt input
      setPrompt("")
    }, 500)
  }

  const getStylePreview = (category: string, value: string) => {
    if (category === "headerStyle") {
      switch (value) {
        case "minimal":
          return "Cabeçalho minimalista: Design clean e profissional com navegação simplificada"
        case "hero":
          return "Cabeçalho hero: Visual impactante com imagem de fundo e chamada para ação destacada"
        case "scarcity":
          return "Barra de escassez: Faixa vermelha com mensagem de Black Friday e frete grátis"
        default:
          return ""
      }
    } else if (category === "credibilityElements") {
      switch (value) {
        case "testimonials":
          return "Avaliações e depoimentos: Provas sociais de clientes satisfeitos"
        case "products":
          return "Vitrine de produtos: Exibição visual dos principais produtos/serviços"
        case "security":
          return "Selos de segurança: Garantias e certificados para aumentar a confiança"
        default:
          return ""
      }
    }
    return ""
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt)
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "layout":
        return "layout"
      case "colorScheme":
        return "esquema de cores"
      case "typography":
        return "tipografia"
      case "headerStyle":
        return "estilo de cabeçalho"
      case "credibilityElements":
        return "elementos de credibilidade"
      default:
        return category
    }
  }

  // Detectar estilo de cabeçalho com base no prompt
  const detectHeaderStyle = (prompt: string) => {
    if (category === "headerStyle") {
      const promptLower = prompt.toLowerCase()
      if (
        promptLower.includes("escassez") ||
        promptLower.includes("black friday") ||
        promptLower.includes("frete grátis") ||
        promptLower.includes("oferta") ||
        promptLower.includes("limitado") ||
        promptLower.includes("promoção")
      ) {
        return "scarcity"
      } else if (
        promptLower.includes("hero") ||
        promptLower.includes("impactante") ||
        promptLower.includes("imagem de fundo")
      ) {
        return "hero"
      } else {
        return "minimal"
      }
    }
    return "minimal"
  }

  // Detectar elementos de credibilidade com base no prompt
  const detectCredibilityElements = (prompt: string) => {
    if (category === "credibilityElements") {
      const promptLower = prompt.toLowerCase()
      if (
        promptLower.includes("avaliações") ||
        promptLower.includes("depoimentos") ||
        promptLower.includes("testemunhos") ||
        promptLower.includes("provas sociais") ||
        promptLower.includes("clientes")
      ) {
        return "testimonials"
      } else if (
        promptLower.includes("produtos") ||
        promptLower.includes("vitrine") ||
        promptLower.includes("ofertas") ||
        promptLower.includes("catálogo")
      ) {
        return "products"
      } else if (
        promptLower.includes("segurança") ||
        promptLower.includes("selo") ||
        promptLower.includes("garantia") ||
        promptLower.includes("certificado") ||
        promptLower.includes("confiança")
      ) {
        return "security"
      }
    }
    return "none"
  }

  return (
    <div className="space-y-4">
      {/* Conversation area */}
      <div className="bg-gray-800/50 rounded-lg p-4 h-64 overflow-y-auto">
        {/* Welcome message */}
        {conversation.length === 0 && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-green-400 font-mono text-sm">
              <Bot className="h-4 w-4 inline-block mr-2" />
              Olá! Estou pronto para ajudar você a personalizar os{" "}
              <span className="text-green-300 font-bold">{getCategoryName(category)}</span> da sua página. Digite suas
              instruções ou use uma das sugestões abaixo.
            </p>
          </div>
        )}

        {/* Conversation messages */}
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 ${message.role === "user" ? "bg-green-900/20" : "bg-gray-800"} rounded-lg`}
          >
            <p className="text-green-400 font-mono text-sm">
              {message.role === "user" ? (
                <User className="h-4 w-4 inline-block mr-2" />
              ) : (
                <Bot className="h-4 w-4 inline-block mr-2" />
              )}
              {message.role === "assistant" && index === conversation.length - 1 && isTyping
                ? currentTypingText
                : message.content}
            </p>
          </div>
        ))}

        {/* Loading indicator */}
        {isGenerating && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-green-400 font-mono text-sm flex items-center">
              <Bot className="h-4 w-4 mr-2" />
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gerando personalização...
            </p>
          </div>
        )}

        {/* Estilo selecionado para cabeçalho */}
        {category === "headerStyle" && !isGenerating && conversation.length > 0 && (
          <div className="mt-4 p-3 bg-gray-800/80 border border-green-500/30 rounded-lg">
            <p className="text-green-400 font-mono text-sm">
              <Bot className="h-4 w-4 inline-block mr-2" />
              <span className="text-green-300 font-bold">Estilo selecionado:</span>{" "}
              {getStylePreview(
                category,
                conversation[conversation.length - 1].role === "user"
                  ? detectHeaderStyle(conversation[conversation.length - 1].content)
                  : "minimal",
              )}
            </p>
          </div>
        )}

        {/* Elementos de credibilidade selecionados */}
        {category === "credibilityElements" && !isGenerating && conversation.length > 0 && (
          <div className="mt-4 p-3 bg-gray-800/80 border border-green-500/30 rounded-lg">
            <p className="text-green-400 font-mono text-sm">
              <Bot className="h-4 w-4 inline-block mr-2" />
              <span className="text-green-300 font-bold">Elementos selecionados:</span>{" "}
              {getStylePreview(
                category,
                conversation[conversation.length - 1].role === "user"
                  ? detectCredibilityElements(conversation[conversation.length - 1].content)
                  : "none",
              )}
            </p>
          </div>
        )}

        {/* Invisible element for auto-scrolling */}
        <div ref={conversationEndRef} />
      </div>

      {/* Prompt input */}
      <div className="flex space-x-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Digite instruções para personalizar os ${getCategoryName(category)}...`}
          className="flex-1 bg-gray-800 border-green-500/50 text-green-100 font-mono focus:border-green-400 focus:ring-green-400/20 min-h-[80px]"
          disabled={isGenerating}
        />
        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-black font-mono self-end h-10"
          disabled={!prompt.trim() || isGenerating}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggested prompts */}
      <div className="space-y-2">
        <p className="text-green-300/70 font-mono text-xs">Sugestões de prompts:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((suggestion, index) => (
            <Card
              key={index}
              className="bg-gray-800 border border-green-500/30 hover:border-green-500/70 transition-all duration-300 cursor-pointer p-2"
              onClick={() => handleSuggestedPrompt(suggestion.text)}
            >
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 text-green-400/70 mr-2" />
                <p className="text-xs font-mono text-green-300/70 line-clamp-1">{suggestion.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
