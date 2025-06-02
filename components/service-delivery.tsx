"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Send, User, Star, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ServiceDeliveryProps {
  content: string
  service: string
  onComplete: (amount: number) => void
}

export function ServiceDelivery({ content, service, onComplete }: ServiceDeliveryProps) {
  const [isDelivering, setIsDelivering] = useState(false)
  const [isDelivered, setIsDelivered] = useState(false)
  const [clientFeedback, setClientFeedback] = useState("")

  const getServiceAmount = () => {
    switch (service) {
      case "Página de Vendas":
        return 500
      case "Design com IA":
        return 300
      case "Script de Atendimento":
        return 400
      default:
        return 350
    }
  }

  const getClientName = () => {
    const clients = ["Carlos Mendes", "Ana Oliveira", "Roberto Santos", "Juliana Costa", "Marcelo Almeida"]
    return clients[Math.floor(Math.random() * clients.length)]
  }

  const getClientCompany = () => {
    const companies = ["TechSolutions", "Inova Marketing", "Empreenda Já", "Saúde Total", "Constrular"]
    return companies[Math.floor(Math.random() * companies.length)]
  }

  const clientName = getClientName()
  const clientCompany = getClientCompany()

  const handleDeliver = () => {
    setIsDelivering(true)

    // Simulate delivery process
    setTimeout(() => {
      setIsDelivering(false)
      setIsDelivered(true)

      // Generate client feedback
      const feedbacks = [
        `Excelente trabalho! Era exatamente o que eu precisava para minha empresa. Vou recomendar seus serviços.`,
        `Muito bom! Você entendeu perfeitamente o que eu queria. Já estou vendo resultados positivos.`,
        `Adorei o resultado! Ficou melhor do que eu esperava. Com certeza vou solicitar mais serviços.`,
        `Trabalho de qualidade e entregue no prazo. Parabéns pela eficiência e profissionalismo.`,
      ]
      setClientFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)])

      // After 2 seconds, complete the delivery
      setTimeout(() => {
        onComplete(getServiceAmount())
      }, 2000)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 font-mono mb-2">REVISAR E ENTREGAR</h2>
        <p className="text-green-300/70 font-mono">
          Revise seu <span className="text-green-400">{service}</span> antes de entregar ao cliente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border border-green-500/30 overflow-hidden">
            <div className="bg-gray-950 p-4 border-b border-green-500/30">
              <h3 className="text-green-400 font-mono">Conteúdo Gerado</h3>
            </div>
            <div className="p-4">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="bg-gray-800 border border-green-500/20">
                  <TabsTrigger
                    value="preview"
                    className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
                  >
                    Visualização
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
                  >
                    Código
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <div className="bg-white text-gray-900 p-6 rounded-md">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
                  </div>
                </TabsContent>
                <TabsContent value="code" className="mt-4">
                  <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto text-green-300 font-mono text-sm">
                    {content}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-gray-900 border border-green-500/30 overflow-hidden">
            <div className="bg-gray-950 p-4 border-b border-green-500/30">
              <h3 className="text-green-400 font-mono">Detalhes do Cliente</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-10 w-10 text-green-400 bg-green-900/30 p-2 rounded-full mr-3" />
                  <div>
                    <p className="text-green-400 font-mono font-bold">{clientName}</p>
                    <p className="text-green-300/70 font-mono text-sm">{clientCompany}</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-md">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-green-400 mr-2" />
                    <p className="text-green-300/70 font-mono text-sm">Prazo de entrega: Hoje</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <p className="text-green-300/70 font-mono text-sm">Cliente Premium</p>
                  </div>
                </div>

                <div className="bg-green-900/20 p-3 rounded-md border border-green-500/30">
                  <p className="text-green-400 font-mono text-sm mb-2">Valor do serviço:</p>
                  <p className="text-green-400 font-mono text-2xl font-bold">R$ {getServiceAmount()}</p>
                </div>

                {isDelivered ? (
                  <div className="bg-green-900/30 p-4 rounded-md border border-green-500/50">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <p className="text-green-400 font-mono">Entrega concluída!</p>
                    </div>
                    <div className="mt-3 bg-gray-800/50 p-3 rounded-md">
                      <p className="text-green-300 font-mono text-sm italic">"{clientFeedback}"</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleDeliver}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-black font-mono"
                    disabled={isDelivering}
                  >
                    {isDelivering ? (
                      <span className="flex items-center">
                        <span className="animate-pulse">Enviando</span>
                        <span className="inline-block ml-1 animate-pulse">.</span>
                        <span className="inline-block ml-0 animate-pulse delay-100">.</span>
                        <span className="inline-block ml-0 animate-pulse delay-200">.</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        ENTREGAR PARA O CLIENTE
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper function to format markdown to HTML
function formatMarkdown(markdown: string): string {
  // Very simple markdown to HTML conversion
  // In a real app, you would use a proper markdown parser
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-4">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 mt-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
    .replace(
      /✅ (.*$)/gm,
      '<div class="flex items-center mb-2"><svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>$1</div>',
    )

  // Replace [BUTTON TEXT] with a button
  html = html.replace(
    /\[(.*?)\]/g,
    '<button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">$1</button>',
  )

  return html
}
