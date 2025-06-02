"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface ChatGPTInterfaceProps {
  service: string
  onComplete: (content: string) => void
}

export function ChatGPTInterface({ service, onComplete }: ChatGPTInterfaceProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [generatedContent, setGeneratedContent] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingText, setCurrentTypingText] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)
  const conversationEndRef = useRef<HTMLDivElement>(null)

  // Predefined prompts based on service type
  const getDefaultPrompt = () => {
    switch (service) {
      case "Página de Vendas":
        return "Crie uma página de vendas persuasiva para um curso de marketing digital. O curso ensina como usar redes sociais para atrair clientes."
      case "Design com IA":
        return "Preciso de instruções para criar um logo para uma empresa de tecnologia chamada TechFusion. Quero um design moderno e minimalista."
      case "Script de Atendimento":
        return "Crie um script de atendimento para vendedores de um serviço de consultoria financeira. O objetivo é converter leads em clientes pagantes."
      default:
        return ""
    }
  }

  // Set default prompt when service changes
  useEffect(() => {
    setPrompt(getDefaultPrompt())
  }, [service])

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
    setIsGenerating(true)

    // Simulate API call to ChatGPT
    setTimeout(() => {
      const response = generateResponse(prompt, service)

      // Add assistant message to conversation
      setConversation((prev) => [...prev, { role: "assistant", content: response }])
      setGeneratedContent(response)

      // Start typing effect
      setIsTyping(true)
      setCurrentTypingText("")
      setTypingIndex(0)

      setIsGenerating(false)
      setPrompt("")
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleComplete = () => {
    if (generatedContent) {
      onComplete(generatedContent)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 font-mono mb-2">CHATGPT WORKSPACE</h2>
        <p className="text-green-300/70 font-mono">
          Criando: <span className="text-green-400">{service}</span>
        </p>
      </div>

      <div className="bg-gray-900 border border-green-500/30 rounded-lg overflow-hidden">
        {/* ChatGPT header */}
        <div className="bg-gray-950 p-4 border-b border-green-500/30 flex items-center">
          <Bot className="h-6 w-6 text-green-400 mr-2" />
          <span className="text-green-400 font-mono">ChatGPT Terminal</span>
        </div>

        {/* Conversation area */}
        <div className="p-4 h-96 overflow-y-auto bg-black/30">
          {/* Welcome message */}
          {conversation.length === 0 && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-green-400 font-mono text-sm">
                <Bot className="h-4 w-4 inline-block mr-2" />
                Olá! Estou pronto para ajudar você a criar um{" "}
                <span className="text-green-300 font-bold">{service}</span>. Digite suas instruções ou use o prompt
                sugerido.
              </p>
            </div>
          )}

          {/* Conversation messages */}
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 ${message.role === "user" ? "bg-green-900/20" : "bg-gray-800/50"} rounded-lg`}
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
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-green-400 font-mono text-sm flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando resposta...
              </p>
            </div>
          )}

          {/* Invisible element for auto-scrolling */}
          <div ref={conversationEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-green-500/30 bg-gray-950">
          <div className="flex space-x-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite suas instruções para o ChatGPT..."
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
        </div>
      </div>

      {/* Complete button - only show when content has been generated */}
      {generatedContent && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-black font-mono py-2 px-8 text-lg"
          >
            USAR ESTE CONTEÚDO
          </Button>
        </div>
      )}
    </div>
  )
}

// Function to generate responses based on prompt and service type
function generateResponse(prompt: string, service: string): string {
  // In a real app, this would call an actual AI API
  // For demo purposes, we'll return predefined responses

  switch (service) {
    case "Página de Vendas":
      return `# DOMINE O MARKETING DIGITAL

## Transforme suas Redes Sociais em Máquinas de Vendas

Você está cansado de postar nas redes sociais sem ver resultados? Seu negócio merece mais visibilidade e mais clientes.

### O QUE VOCÊ VAI APRENDER:

✅ Como criar conteúdo que converte seguidores em clientes
✅ Estratégias avançadas de targeting para encontrar seu público ideal
✅ Técnicas de copywriting que aumentam suas vendas em até 300%
✅ Como automatizar seu marketing digital e economizar horas por semana

### RESULTADOS REAIS:

"Implementei apenas 3 estratégias do curso e já consegui 15 novos clientes em uma semana!" - Maria S.

"Meu ROI em anúncios aumentou 250% depois de aplicar as técnicas do módulo 2" - João P.

### INVESTIMENTO:

De R$997 por apenas R$497 (oferta por tempo limitado)

### GARANTIA TOTAL:

Se em 30 dias você não estiver satisfeito, devolvemos 100% do seu investimento.

## CLIQUE NO BOTÃO ABAIXO E TRANSFORME SUAS REDES SOCIAIS HOJE MESMO!

[QUERO AUMENTAR MINHAS VENDAS AGORA]`

    case "Design com IA":
      return `# Instruções para Logo da TechFusion

## Conceito
Para criar um logo moderno e minimalista para a TechFusion, sugiro os seguintes elementos:

1. **Forma principal**: Dois hexágonos sobrepostos ou interconectados, representando fusão e tecnologia
2. **Cores**: 
   - Azul tecnológico (#2563EB)
   - Verde vibrante (#10B981)
   - Fundo transparente ou branco

## Elementos de Design
- Fonte sans-serif minimalista (recomendo Montserrat ou Poppins)
- Linhas finas e precisas
- Espaço negativo para criar formas adicionais
- Versão do logo em uma única cor para versatilidade

## Instruções para Geração
1. No Midjourney ou DALL-E, use o prompt:
   "Minimalist tech logo for TechFusion company, overlapping hexagons, blue and green gradient, clean lines, white background, professional, vector style"

2. Para ajustes:
   - Remova qualquer texto gerado pela IA
   - Certifique-se de que o design funciona bem em tamanhos pequenos
   - Verifique se o conceito de "fusão" está claramente representado

## Variações
Crie 3-4 variações:
- Logo horizontal
- Logo vertical
- Apenas símbolo (para favicon/ícone)
- Versão monocromática`

    case "Script de Atendimento":
      return `# SCRIPT DE ATENDIMENTO - CONSULTORIA FINANCEIRA

## ABERTURA

**Atendente**: "Olá [Nome do Cliente], tudo bem? Aqui é [Seu Nome] da Consultoria Financeira Prosperar. Agradeço pelo seu interesse em nossos serviços! Estou entrando em contato porque você solicitou informações sobre como organizar suas finanças pessoais. Teria alguns minutos para conversarmos sobre como podemos te ajudar?"

## IDENTIFICAÇÃO DE NECESSIDADES

**Atendente**: "Para que eu possa entender melhor sua situação e oferecer a solução mais adequada, posso fazer algumas perguntas rápidas?"

1. "Atualmente, qual é sua maior dificuldade em relação às suas finanças pessoais?"
2. "Você já tentou alguma estratégia para resolver essa situação?"
3. "Em uma escala de 0 a 10, quão urgente é resolver esse problema para você?"
4. "Quais são seus principais objetivos financeiros para os próximos 12 meses?"

## APRESENTAÇÃO DA SOLUÇÃO

**Atendente**: "Baseado no que você me contou, temos exatamente o que você precisa. Nossa consultoria financeira personalizada já ajudou mais de 500 clientes a [benefício principal relacionado à necessidade do cliente]."

"Nosso processo funciona em 3 etapas simples:

1. **Diagnóstico Financeiro**: Analisamos detalhadamente sua situação atual
2. **Plano Personalizado**: Desenvolvemos estratégias específicas para seus objetivos
3. **Acompanhamento Contínuo**: Monitoramos seus resultados e fazemos ajustes quando necessário"

## SUPERAÇÃO DE OBJEÇÕES

**Se o cliente mencionar preço**: "Entendo sua preocupação com o investimento. Muitos de nossos clientes também pensaram assim inicialmente. Porém, nossos dados mostram que para cada R$1 investido em nossa consultoria, nossos clientes economizam ou ganham em média R$5 em apenas 6 meses. Além disso, oferecemos opções de pagamento que cabem no seu orçamento."

**Se o cliente disser que precisa pensar**: "Compreendo que você queira refletir sobre essa decisão. É justamente por isso que oferecemos uma sessão de diagnóstico gratuita, sem compromisso. Assim você pode conhecer nossa metodologia antes de decidir. Podemos agendar essa sessão para amanhã ou você prefere depois de amanhã?"

## FECHAMENTO

**Atendente**: "Ótimo! Vamos agendar sua [próxima etapa] para [data e hora]. Você receberá um e-mail de confirmação com todas as informações e um link para preencher um breve questionário que nos ajudará a preparar sua sessão. Tem alguma dúvida que eu possa esclarecer agora?"

"Muito obrigado pela confiança, [Nome do Cliente]! Estamos ansiosos para ajudá-lo a alcançar seus objetivos financeiros. Tenha um excelente dia!"`

    default:
      return "Conteúdo gerado com sucesso! Aqui está o resultado do seu pedido."
  }
}
