"use client"

import type React from "react"
import { forwardRef } from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { useAudioContext } from "@/components/audio-provider"

interface AudioInputProps extends InputProps {
  enableTypingSound?: boolean
}

export const AudioInput = forwardRef<HTMLInputElement, AudioInputProps>(
  ({ enableTypingSound = true, onKeyDown, onFocus, ...props }, ref) => {
    const { playSound } = useAudioContext()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (enableTypingSound && e.key.length === 1) {
        playSound("typing")
      }
      onKeyDown?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      playSound("beep")
      onFocus?.(e)
    }

    return <Input ref={ref} onKeyDown={handleKeyDown} onFocus={handleFocus} {...props} />
  },
)

AudioInput.displayName = "AudioInput"
