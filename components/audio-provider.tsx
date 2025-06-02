"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAudio, type SoundType } from "@/hooks/use-audio"

interface AudioContextType {
  playSound: (soundType: SoundType) => void
  toggleAudio: () => boolean
  isAudioEnabled: () => boolean
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudio()

  return <AudioContext.Provider value={audio}>{children}</AudioContext.Provider>
}

export function useAudioContext() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider")
  }
  return context
}
