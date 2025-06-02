"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useAudioContext } from "@/components/audio-provider"

interface AutoAdvanceOverlayProps {
  isVisible: boolean
  onComplete: () => void
}

export function AutoAdvanceOverlay({ isVisible, onComplete }: AutoAdvanceOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const { playSound } = useAudioContext()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowOverlay(true)
        playSound("notification")
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowOverlay(false)
    }
  }, [isVisible, playSound])

  const handleClick = () => {
    playSound("click")
    setShowOverlay(false)
    onComplete()
  }

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          onClick={handleClick}
        >
          <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={handleClick} />
          <div
            className="bg-white rounded-lg p-4 shadow-lg max-w-sm w-full mx-4 pointer-events-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-center mb-2">Toque aqui para continuar a personalização</h3>
            <p className="text-gray-600 text-center mb-4">Clique para continuar a simulação</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="text-green-500"
            >
              <ArrowDown size={32} />
            </motion.div>
            <button
              onClick={handleClick}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              Continuar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
