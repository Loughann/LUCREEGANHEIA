"use client"

import type React from "react"
import { useEffect } from "react"
import { useConfetti } from "./confetti-provider"
import { useAudioContext } from "@/components/audio-provider"

interface SimulationStep4Props {
  onComplete: () => void
}

const SimulationStep4: React.FC<SimulationStep4Props> = ({ onComplete }) => {
  const { startConfetti } = useConfetti()
  const { playSound } = useAudioContext()

  useEffect(() => {
    playSound("coin")

    // Add multiple celebration sounds
    setTimeout(() => playSound("level-up"), 500)
    setTimeout(() => playSound("ding"), 1000)

    startConfetti()
    const timeoutId = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [onComplete, playSound, startConfetti])

  return (
    <div>
      <h2>Congratulations!</h2>
      <p>You have successfully completed the simulation.</p>
    </div>
  )
}

export default SimulationStep4
