"use client"

import type React from "react"
import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useAudioContext } from "@/components/audio-provider"
import type { SoundType } from "@/hooks/use-audio"

interface AudioButtonProps extends ButtonProps {
  soundType?: SoundType
  hoverSound?: boolean
}

export const AudioButton = forwardRef<HTMLButtonElement, AudioButtonProps>(
  ({ soundType = "click", hoverSound = true, onMouseEnter, onMouseLeave, onClick, children, ...props }, ref) => {
    const { playSound } = useAudioContext()

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hoverSound) {
        playSound("hover")
      }
      onMouseEnter?.(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playSound(soundType)
      onClick?.(e)
    }

    return (
      <Button ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onClick={handleClick} {...props}>
        {children}
      </Button>
    )
  },
)

AudioButton.displayName = "AudioButton"
