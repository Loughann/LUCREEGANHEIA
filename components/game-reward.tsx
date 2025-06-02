"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Coins, Lock, Download, Terminal, AlertCircle } from "lucide-react"

interface GameRewardProps {
  title: string
  description: string
  cost: number
  level: number
  currentLevel: number
  currentMoney: number
  onRedeem: () => void
}

export function GameReward({ title, description, cost, level, currentLevel, currentMoney, onRedeem }: GameRewardProps) {
  const [isRedeemed, setIsRedeemed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const isLocked = currentLevel < level
  const canAfford = currentMoney >= cost

  const handleRedeem = () => {
    if (isRedeemed || isLocked || !canAfford) return

    setIsLoading(true)

    // Simulate redeeming reward
    setTimeout(() => {
      setShowDownload(true)

      setTimeout(() => {
        setIsRedeemed(true)
        setIsLoading(false)
        setShowDownload(false)
        onRedeem()
      }, 1500)
    }, 1000)
  }

  const handleClick = () => {
    if (isLocked) {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 3000)
    } else if (!canAfford && !isRedeemed) {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 3000)
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 bg-gray-900 border border-green-500/30 ${isLocked ? "opacity-70" : "hover:shadow-lg hover:border-green-500/50"}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base text-green-400 font-mono flex items-center">
            <Terminal className="h-4 w-4 mr-2" />
            {title}
          </CardTitle>
          {isLocked ? (
            <div className="bg-gray-800 text-gray-500 border border-gray-700 rounded-md px-3 py-1 text-xs font-mono flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Nível {level}
            </div>
          ) : (
            <div className="bg-green-900/30 text-green-400 border border-green-500/30 rounded-md px-3 py-1 text-xs font-mono flex items-center">
              <Coins className="h-3 w-3 mr-1" />
              R$ {cost}
            </div>
          )}
        </div>
        <CardDescription className="text-green-300/70 font-mono text-xs">{description}</CardDescription>
      </CardHeader>

      {showDownload && (
        <div className="px-4 py-2">
          <div className="bg-black/50 rounded p-2 border border-green-500/20">
            <pre className="text-xs text-green-400 font-mono">
              <span className="text-green-500">$</span> downloading resource...
              <br />
              <span className="animate-pulse">
                Progress: [{"=".repeat(Math.floor(Math.random() * 10) + 1)}
                {">"}
                {" ".repeat(10 - Math.floor(Math.random() * 10))}]{Math.floor(Math.random() * 50) + 50}%
              </span>
            </pre>
          </div>
        </div>
      )}

      {showHint && (
        <div className="px-4 py-2">
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded p-2 text-xs text-yellow-400 font-mono flex items-start">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <span>
              {isLocked
                ? `Você precisa atingir o nível ${level} para desbloquear este recurso.`
                : `Você precisa de R$ ${cost} para obter este recurso.`}
            </span>
          </div>
        </div>
      )}

      <CardFooter>
        {isLocked ? (
          <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-gray-500 font-mono" disabled>
            <Lock className="h-4 w-4 mr-2" />
            NÍVEL {level} NECESSÁRIO
          </Button>
        ) : isRedeemed ? (
          <Button
            variant="outline"
            className="w-full bg-green-900/20 text-green-500 border-green-500/50 font-mono"
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            RECURSO OBTIDO
          </Button>
        ) : (
          <Button
            onClick={handleRedeem}
            className={`w-full font-mono ${canAfford ? "bg-green-700 hover:bg-green-800 text-black" : "bg-gray-800 text-gray-500"}`}
            disabled={!canAfford || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-pulse">Processando</span>
                <span className="inline-block ml-1 animate-pulse">.</span>
                <span className="inline-block ml-0 animate-pulse delay-100">.</span>
                <span className="inline-block ml-0 animate-pulse delay-200">.</span>
              </span>
            ) : canAfford ? (
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                OBTER RECURSO
              </span>
            ) : (
              <span className="flex items-center">
                <Coins className="h-4 w-4 mr-2" />
                FUNDOS INSUFICIENTES
              </span>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
