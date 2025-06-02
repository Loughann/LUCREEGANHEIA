"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lock, Terminal, AlertCircle } from "lucide-react"

interface GameTaskProps {
  id: string
  title: string
  description: string
  reward: number
  icon: React.ReactNode
  onComplete: () => void
  disabled?: boolean
  currentLevel: number
  requiredLevel: number
  isCompleted: boolean
}

export function GameTask({
  id,
  title,
  description,
  reward,
  icon,
  onComplete,
  disabled = false,
  currentLevel,
  requiredLevel,
  isCompleted,
}: GameTaskProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showLevelHint, setShowLevelHint] = useState(false)

  // Use the isCompleted prop from parent component
  useEffect(() => {
    // If task is already completed, we don't need to do anything
  }, [isCompleted])

  const handleComplete = () => {
    if (isCompleted || disabled) return

    setIsLoading(true)
    setShowCode(true)

    // Simulate task completion with code execution
    setTimeout(() => {
      setIsLoading(false)
      onComplete()

      // Hide code after completion
      setTimeout(() => {
        setShowCode(false)
      }, 1500)
    }, 2500)
  }

  const handleDisabledClick = () => {
    if (disabled) {
      setShowLevelHint(true)
      setTimeout(() => {
        setShowLevelHint(false)
      }, 3000)
    }
  }

  // Random code snippets for visual effect
  const codeSnippets = [
    "const ai = new ChatGPT();\nconst response = await ai.generate(prompt);\nconsole.log('Success: ' + response.status);",
    "function createContent() {\n  const result = AI.process(data);\n  return result.optimize();\n}",
    "async function generateIncome() {\n  const clients = await findClients();\n  return clients.map(c => c.pay(100));\n}",
    "const template = new AITemplate();\ntemplate.addSection('header');\ntemplate.addSection('benefits');\ntemplate.render();",
    "class AIAssistant {\n  constructor() {\n    this.model = 'gpt-4';\n  }\n  async respond() { /* ... */ }\n}",
  ]

  const randomCode = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 bg-gray-900 border border-green-500/30 ${disabled ? "opacity-70" : "hover:shadow-lg hover:border-green-500/50"}`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base text-green-400 font-mono flex items-center">
            <Terminal className="h-4 w-4 mr-2" />
            {title}
          </CardTitle>
          <CardDescription className="text-green-300/70 font-mono text-xs">{description}</CardDescription>
        </div>
        <div className="bg-green-900/30 text-green-400 border border-green-500/30 rounded-md px-3 py-1 text-sm font-mono">
          +R$ {reward}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {showCode ? (
          <div className="bg-black/50 rounded p-2 border border-green-500/20 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
              <span className="text-green-500">$</span> executing task...
              <br />
              <span className="animate-pulse">{randomCode}</span>
            </pre>
          </div>
        ) : (
          <div className="flex items-center text-sm text-green-400/70 font-mono">
            {icon}
            <span className="ml-2">
              {isCompleted ? "Módulo concluído com sucesso!" : "Execute este módulo para ganhar recompensa"}
            </span>
          </div>
        )}

        {/* Level hint notification */}
        {showLevelHint && (
          <div className="mt-2 bg-yellow-900/30 border border-yellow-500/30 rounded p-2 text-xs text-yellow-400 font-mono flex items-start">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <span>Você precisa atingir o nível {requiredLevel} para desbloquear este módulo.</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {disabled ? (
          <Button
            variant="outline"
            className="w-full bg-gray-800 border-gray-700 text-gray-500 font-mono"
            disabled
            onClick={handleDisabledClick}
          >
            <Lock className="h-4 w-4 mr-2" />
            NÍVEL {requiredLevel} NECESSÁRIO
          </Button>
        ) : isCompleted ? (
          <Button
            variant="outline"
            className="w-full bg-green-900/20 text-green-500 border-green-500/50 font-mono"
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            MÓDULO CONCLUÍDO
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            className="w-full bg-green-700 hover:bg-green-800 text-black font-mono"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-pulse">Executando</span>
                <span className="inline-block ml-1 animate-pulse">.</span>
                <span className="inline-block ml-0 animate-pulse delay-100">.</span>
                <span className="inline-block ml-0 animate-pulse delay-200">.</span>
              </span>
            ) : (
              <span className="flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                EXECUTAR MÓDULO
              </span>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
