"use client"

import type React from "react"
import { useState } from "react"
import { AudioButton } from "@/components/audio-button"
import { AudioCard } from "@/components/audio-card"
import { useAudioContext } from "@/components/audio-provider"

interface SimulationStep3Props {
  onNext: () => void
}

const SimulationStep3: React.FC<SimulationStep3Props> = ({ onNext }) => {
  const [isDelivering, setIsDelivering] = useState(false)
  const [isDelivered, setIsDelivered] = useState(false)
  const { playSound } = useAudioContext()

  const handleDeliver = () => {
    playSound("whoosh")
    setIsDelivering(true)

    setTimeout(() => {
      playSound("level-up")
      setIsDelivering(false)
      setIsDelivered(true)
    }, 2000)
  }

  return (
    <AudioCard>
      <h2>Delivery Time!</h2>
      {isDelivering ? (
        <p>Delivering the package...</p>
      ) : isDelivered ? (
        <p>Package delivered successfully!</p>
      ) : (
        <>
          <p>Click the button below to deliver the package.</p>
          <AudioButton variant="contained" color="primary" onClick={handleDeliver}>
            Deliver
          </AudioButton>
        </>
      )}
      {isDelivered && (
        <AudioButton variant="contained" color="secondary" onClick={onNext}>
          Next
        </AudioButton>
      )}
    </AudioCard>
  )
}

export default SimulationStep3
