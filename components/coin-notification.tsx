"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"

interface CoinNotificationProps {
  amount: string
}

interface CoinProps {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function CoinNotification({ amount }: CoinNotificationProps) {
  const [coins, setCoins] = useState<CoinProps[]>([])

  // Gerar moedas aleatórias
  useEffect(() => {
    const newCoins = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 50,
      size: 20 + Math.random() * 15,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 1.2,
    }))
    setCoins(newCoins)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 left-0 right-0 z-50 flex justify-center"
    >
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-400 max-w-[90%] relative overflow-hidden">
        {/* Moedas caindo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ y: coin.y, x: `${coin.x}%`, opacity: 0, scale: 0 }}
              animate={{
                y: "120%",
                opacity: [0, 1, 1, 0],
                rotate: [0, 180, 360],
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: coin.duration,
                delay: coin.delay,
                ease: "easeIn",
              }}
              className="absolute"
            >
              <div
                className="rounded-full bg-yellow-400 flex items-center justify-center text-yellow-800 font-bold"
                style={{ width: coin.size, height: coin.size }}
              >
                $
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center mr-4">
            <DollarSign className="h-6 w-6 text-green-800" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Pagamento recebido!</h3>
            <p className="text-green-100">
              R$ <span className="font-bold text-xl">{amount}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
