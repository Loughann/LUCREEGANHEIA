"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useAudioContext } from "@/components/audio-provider"

export function AudioToggle() {
  const { toggleAudio, isAudioEnabled } = useAudioContext()
  const [enabled, setEnabled] = React.useState(true)

  const handleToggle = () => {
    const newState = toggleAudio()
    setEnabled(newState)
  }

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="sm"
      className="fixed top-4 right-4 z-50 bg-gray-800/80 backdrop-blur-sm border border-gray-600 hover:bg-gray-700/80"
      title={enabled ? "Desativar sons" : "Ativar sons"}
    >
      {enabled ? <Volume2 className="h-4 w-4 text-green-400" /> : <VolumeX className="h-4 w-4 text-gray-400" />}
    </Button>
  )
}
