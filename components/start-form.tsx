"use client"

import type React from "react"

import { useState } from "react"
import { Rocket } from "lucide-react"
import { AudioButton } from "@/components/audio-button"
import { AudioInput } from "@/components/audio-input"

interface StartFormProps {
  onStart: (name: string, whatsapp: string) => void
}

function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3]
  }
  return phoneNumber
}

export function StartForm({ onStart }: StartFormProps) {
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart(name, whatsapp)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AudioInput
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Digite seu nome completo"
        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20"
        required
      />
      <AudioInput
        id="whatsapp"
        type="tel"
        value={whatsapp}
        onChange={(e) => {
          const formatted = formatPhoneNumber(e.target.value)
          setWhatsapp(formatted)
        }}
        placeholder="(11) 99999-9999"
        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20"
        required
      />
      <AudioButton
        type="submit"
        soundType="success"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
      >
        <Rocket className="mr-2 h-5 w-5" />
        Iniciar Simulação
      </AudioButton>
    </form>
  )
}
