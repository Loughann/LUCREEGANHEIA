"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@nextui-org/react"
import { AudioCard } from "@/components/audio-card"
import { useAudioContext } from "@/components/audio-provider"

interface Service {
  id: string
  name: string
  description: string
}

interface SimulationStep1Props {
  services: Service[]
  onServiceSelect: (serviceName: string) => void
  selectedService: string | null
  isSelecting: boolean
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>
}

const SimulationStep1: React.FC<SimulationStep1Props> = ({
  services,
  onServiceSelect,
  selectedService,
  isSelecting,
  setIsSelecting,
}) => {
  const { playSound } = useAudioContext()
  const [localSelectedService, setLocalSelectedService] = useState<string | null>(selectedService)

  const handleSelect = (serviceName: string) => {
    playSound("success")
    setIsSelecting(true)
    setSelectedService(serviceName)

    setLocalSelectedService(serviceName)
    onServiceSelect(serviceName)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <AudioCard
          key={service.id}
          enableHoverSound={true}
          enableClickSound={true}
          className={`bg-gray-900 border ${selectedService === service.name ? "border-green-500" : "border-green-500/30"} hover:border-green-500/70 transition-all duration-300 overflow-hidden cursor-pointer ${selectedService && selectedService !== service.name ? "opacity-50" : ""}`}
          onClick={() => !selectedService && !isSelecting && handleSelect(service.name)}
        >
          <Card.Body>
            <h3 className="text-lg font-semibold text-white">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
          </Card.Body>
        </AudioCard>
      ))}
    </div>
  )
}

export default SimulationStep1
