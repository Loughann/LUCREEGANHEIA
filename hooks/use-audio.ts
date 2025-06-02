"use client"

import { useCallback, useRef } from "react"

// Tipos de sons disponíveis
export type SoundType =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "notification"
  | "typing"
  | "loading"
  | "transition"
  | "coin"
  | "level-up"
  | "button-press"
  | "whoosh"
  | "beep"
  | "ding"
  | "pop"

interface AudioContextType {
  context: AudioContext | null
  isEnabled: boolean
}

export function useAudio() {
  const audioContextRef = useRef<AudioContextType>({ context: null, isEnabled: true })

  // Inicializar contexto de áudio
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current.context && typeof window !== "undefined") {
      try {
        audioContextRef.current.context = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn("Audio context not supported:", error)
        audioContextRef.current.isEnabled = false
      }
    }
  }, [])

  // Gerar tons programaticamente
  const generateTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) => {
      if (!audioContextRef.current.context || !audioContextRef.current.isEnabled) return

      const context = audioContextRef.current.context
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.frequency.setValueAtTime(frequency, context.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + duration)
    },
    [],
  )

  // Gerar sons complexos
  const generateComplexSound = useCallback(
    (config: {
      frequencies: number[]
      duration: number
      type?: OscillatorType
      volume?: number
      delay?: number
    }) => {
      config.frequencies.forEach((freq, index) => {
        setTimeout(
          () => {
            generateTone(freq, config.duration, config.type, config.volume)
          },
          (config.delay || 0) * index,
        )
      })
    },
    [generateTone],
  )

  // Reproduzir sons específicos
  const playSound = useCallback(
    (soundType: SoundType) => {
      initAudioContext()

      if (!audioContextRef.current.isEnabled) return

      switch (soundType) {
        case "click":
          generateTone(800, 0.1, "square", 0.15)
          break

        case "hover":
          generateTone(600, 0.05, "sine", 0.08)
          break

        case "success":
          generateComplexSound({
            frequencies: [523, 659, 784, 1047],
            duration: 0.15,
            type: "sine",
            volume: 0.2,
            delay: 50,
          })
          break

        case "error":
          generateComplexSound({
            frequencies: [300, 250, 200],
            duration: 0.2,
            type: "sawtooth",
            volume: 0.15,
            delay: 100,
          })
          break

        case "notification":
          generateComplexSound({
            frequencies: [800, 1000, 1200],
            duration: 0.1,
            type: "sine",
            volume: 0.12,
            delay: 80,
          })
          break

        case "typing":
          generateTone(400 + Math.random() * 200, 0.05, "square", 0.06)
          break

        case "loading":
          generateTone(440, 0.3, "sine", 0.08)
          break

        case "transition":
          generateComplexSound({
            frequencies: [220, 330, 440, 660],
            duration: 0.4,
            type: "sine",
            volume: 0.1,
            delay: 100,
          })
          break

        case "coin":
          generateComplexSound({
            frequencies: [1319, 1568, 2637, 2093],
            duration: 0.1,
            type: "square",
            volume: 0.15,
            delay: 30,
          })
          break

        case "level-up":
          generateComplexSound({
            frequencies: [523, 659, 784, 1047, 1319],
            duration: 0.2,
            type: "sine",
            volume: 0.18,
            delay: 60,
          })
          break

        case "button-press":
          generateTone(1000, 0.08, "square", 0.12)
          setTimeout(() => generateTone(800, 0.08, "square", 0.08), 50)
          break

        case "whoosh":
          // Efeito de whoosh usando noise
          if (audioContextRef.current.context) {
            const context = audioContextRef.current.context
            const bufferSize = context.sampleRate * 0.3
            const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
            const data = buffer.getChannelData(0)

            for (let i = 0; i < bufferSize; i++) {
              data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
            }

            const source = context.createBufferSource()
            const gainNode = context.createGain()
            const filter = context.createBiquadFilter()

            filter.type = "highpass"
            filter.frequency.setValueAtTime(200, context.currentTime)
            filter.frequency.exponentialRampToValueAtTime(2000, context.currentTime + 0.3)

            source.buffer = buffer
            source.connect(filter)
            filter.connect(gainNode)
            gainNode.connect(context.destination)

            gainNode.gain.setValueAtTime(0.1, context.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3)

            source.start()
          }
          break

        case "beep":
          generateTone(1000, 0.1, "sine", 0.1)
          break

        case "ding":
          generateComplexSound({
            frequencies: [2093, 2637],
            duration: 0.3,
            type: "sine",
            volume: 0.12,
            delay: 0,
          })
          break

        case "pop":
          generateTone(800, 0.05, "square", 0.15)
          setTimeout(() => generateTone(1200, 0.03, "sine", 0.1), 20)
          break
      }
    },
    [initAudioContext, generateTone, generateComplexSound],
  )

  // Toggle áudio
  const toggleAudio = useCallback(() => {
    audioContextRef.current.isEnabled = !audioContextRef.current.isEnabled
    return audioContextRef.current.isEnabled
  }, [])

  // Verificar se áudio está habilitado
  const isAudioEnabled = useCallback(() => {
    return audioContextRef.current.isEnabled
  }, [])

  return {
    playSound,
    toggleAudio,
    isAudioEnabled,
  }
}
