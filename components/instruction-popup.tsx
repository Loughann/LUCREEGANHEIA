"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowDown, Minimize2, Maximize2, Smartphone, Zap } from "lucide-react"

interface InstructionPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  allowClose?: boolean
}

export function InstructionPopup({ isOpen, onClose, title, content, allowClose = true }: InstructionPopupProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={allowClose ? onClose : undefined}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-4 right-4 z-50 max-w-sm mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMinimize}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isMinimized ? (
                        <Maximize2 className="h-4 w-4 text-white" />
                      ) : (
                        <Minimize2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                    {allowClose && (
                      <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-5"
                >
                  <p className="text-gray-800 font-medium text-base leading-relaxed mb-4">{content}</p>

                  {!allowClose && (
                    <div className="flex items-center justify-center space-x-2 text-green-600 text-sm font-semibold">
                      <ArrowDown className="h-4 w-4 animate-bounce" />
                      <span>Siga as instruções acima</span>
                    </div>
                  )}

                  {allowClose && (
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-2xl transition-colors active:scale-95"
                      >
                        Entendi
                      </button>
                      <button
                        onClick={toggleMinimize}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl transition-colors active:scale-95"
                      >
                        Minimizar
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Minimized State */}
              {isMinimized && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600 text-sm font-medium">Instruções disponíveis</span>
                    </div>
                    <button
                      onClick={toggleMinimize}
                      className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
                    >
                      Expandir
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Bottom Indicator */}
              <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
