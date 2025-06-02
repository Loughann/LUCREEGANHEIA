"use client"

import type React from "react"
import { forwardRef } from "react"
import { Card, type CardProps } from "@/components/ui/card"
import { useAudioContext } from "@/components/audio-provider"

interface AudioCardProps extends CardProps {
  enableHoverSound?: boolean
  enableClickSound?: boolean
}

export const AudioCard = forwardRef<HTMLDivElement, AudioCardProps>(
  ({ enableHoverSound = true, enableClickSound = false, onMouseEnter, onClick, children, ...props }, ref) => {
    const { playSound } = useAudioContext()

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (enableHoverSound) {
        playSound("hover")
      }
      onMouseEnter?.(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (enableClickSound) {
        playSound("pop")
      }
      onClick?.(e)
    }

    return (
      <Card ref={ref} onMouseEnter={handleMouseEnter} onClick={handleClick} {...props}>
        {children}
      </Card>
    )
  },
)

AudioCard.displayName = "AudioCard"
