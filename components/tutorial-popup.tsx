"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, ChevronRight, ChevronLeft } from "lucide-react"

interface TutorialStep {
  title: string
  content: string
  position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TutorialPopupProps {
  steps: TutorialStep[]
  isOpen: boolean
  onClose: () => void
}

export function TutorialPopup({ steps, isOpen, onClose }: TutorialPopupProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getPositionClasses = (position = "center") => {
    switch (position) {
      case "top":
        return "top-4 left-1/2 -translate-x-1/2"
      case "bottom":
        return "bottom-4 left-1/2 -translate-x-1/2"
      case "left":
        return "left-4 top-1/2 -translate-y-1/2"
      case "right":
        return "right-4 top-1/2 -translate-y-1/2"
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`max-w-md w-full bg-gray-900 border border-green-500/30 rounded-lg shadow-lg p-6 ${getPositionClasses(steps[currentStep].position)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 text-green-400 mr-2" />
                <h3 className="text-lg font-bold text-green-400 font-mono">{steps[currentStep].title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-green-300 font-mono">{steps[currentStep].content}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-green-400/70 font-mono text-sm">
                {currentStep + 1} / {steps.length}
              </div>
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-green-500/30 text-green-400 hover:bg-gray-700 font-mono"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-black font-mono" onClick={handleNext}>
                  {currentStep < steps.length - 1 ? (
                    <>
                      Próximo
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Entendi"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
