"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect immediately to sales page - same behavior for mobile and desktop
    router.replace("/venda")
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin h-12 w-12 border-t-2 border-b-2 border-green-500 rounded-full mb-4"></div>
        <p className="text-green-500 font-mono animate-pulse">Redirecionando...</p>
      </div>
    </div>
  )
}
