"use client"

import { useState, useEffect } from "react"
import { AudioButton } from "@/components/audio-button"
import { useAudioContext } from "@/components/audio-provider"

interface Message {
  role: string
  content: string
}

const SimulationStep2 = () => {
  const [prompt, setPrompt] = useState<string>("")
  const [conversation, setConversation] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedText, setGeneratedText] = useState<string>("")
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [typingIndex, setTypingIndex] = useState<number>(0)

  const { playSound } = useAudioContext()

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating || isComplete) return

    playSound("button-press")
    setConversation([...conversation, { role: "user", content: prompt }])
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      const response = "This is a simulated response from ChatGPT.  It's a very long response to simulate typing."
      setGeneratedText(response)
      setIsTyping(true)
      setTypingIndex(0)
    }, 1000)
  }

  useEffect(() => {
    if (isTyping) {
      const typingInterval = setInterval(() => {
        setTypingIndex((index) => index + 1)
      }, 20) // Adjust typing speed here

      if (typingIndex >= generatedText.length) {
        clearInterval(typingInterval)
        setIsTyping(false)
        setIsComplete(true)
        setTimeout(() => {
          playSound("success")
        }, 2000)
      }

      return () => clearInterval(typingInterval)
    }
  }, [isTyping, generatedText, typingIndex, playSound])

  useEffect(() => {
    if (isTyping && typingIndex === 0) {
      playSound("beep")
    }
  }, [isTyping, typingIndex, playSound])

  const displayedText = isTyping ? generatedText.substring(0, typingIndex) : generatedText

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        {conversation.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <span className="font-bold">{message.role === "user" ? "You:" : "ChatGPT:"}</span>
            <p>{message.content}</p>
          </div>
        ))}
        {isGenerating && (
          <div className="text-left mb-2">
            <span className="font-bold">ChatGPT:</span>
            <p>{displayedText}</p>
          </div>
        )}
        {isComplete && (
          <div className="text-left mb-2">
            <span className="font-bold">ChatGPT:</span>
            <p>{displayedText}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded mr-2"
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit()
            }}
            disabled={isGenerating || isComplete}
          />
          <AudioButton onClick={handleSubmit} disabled={isGenerating || isComplete} aria-label="Send">
            Send
          </AudioButton>
        </div>
      </div>
    </div>
  )
}

export default SimulationStep2
