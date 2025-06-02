"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Palette, MessageSquare } from "lucide-react"

interface ServiceSelectionProps {
  onSelect: (service: string) => void
}

export function ServiceSelection({ onSelect }: ServiceSelectionProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const services = [
    {
      id: "landing-page",
      name: "Página de Vendas",
      description: "Crie uma página de vendas persuasiva para produtos ou serviços",
      icon: <FileText className="h-8 w-8" />,
      earnings: "R$ 500",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "design",
      name: "Design com IA",
      description: "Gere designs, logos e banners para redes sociais",
      icon: <Palette className="h-8 w-8" />,
      earnings: "R$ 300",
      color: "from-purple-600 to-purple-800",
    },
    {
      id: "script",
      name: "Script de Atendimento",
      description: "Crie scripts persuasivos para atendimento e vendas",
      icon: <MessageSquare className="h-8 w-8" />,
      earnings: "R$ 400",
      color: "from-green-600 to-green-800",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 font-mono mb-2">ESCOLHA UM SERVIÇO</h2>
        <p className="text-green-300/70 font-mono">Selecione o tipo de serviço que você deseja criar com ChatGPT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`bg-gray-900 border border-green-500/30 hover:border-green-500/70 transition-all duration-300 overflow-hidden ${hoveredService === service.id ? "transform scale-105" : ""}`}
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <div
              className={`p-6 bg-gradient-to-br ${service.color} flex flex-col items-center justify-center text-white`}
            >
              {service.icon}
              <h3 className="mt-4 text-xl font-bold font-mono">{service.name}</h3>
            </div>
            <div className="p-6">
              <p className="text-green-300/80 font-mono text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-400 font-mono text-sm">Ganhos por entrega:</span>
                <span className="text-green-400 font-mono font-bold">{service.earnings}</span>
              </div>
              <Button
                onClick={() => onSelect(service.name)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-black font-mono"
              >
                SELECIONAR SERVIÇO
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
