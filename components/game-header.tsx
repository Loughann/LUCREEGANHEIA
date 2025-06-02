import { Coins, Terminal, User } from "lucide-react"

interface GameHeaderProps {
  playerName: string
  money: number
  level: number
  progress: number
}

export function GameHeader({ playerName, money, level, progress }: GameHeaderProps) {
  return (
    <div className="bg-gray-900 shadow-md p-4 border-b border-green-500/30">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-green-900/50 border border-green-500/50 rounded-md flex items-center justify-center text-green-400 font-mono font-bold text-lg">
            <User className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 text-green-400 mr-1" />
              <p className="text-green-400 font-mono">user@{playerName.toLowerCase().replace(/\s+/g, "-")}:~$</p>
            </div>
            <div className="flex items-center">
              <p className="text-green-300 text-xs font-mono">
                <span className="text-green-500">$</span> level = {level}
                {level < 5 && (
                  <span className="ml-2 text-green-400/50">
                    [{progress}% para nível {level + 1}]
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-gray-800 border border-green-500/30 rounded-md px-4 py-2">
          <Coins className="h-5 w-5 text-green-400 mr-2" />
          <span className="text-green-400 font-mono font-bold">R$ {money.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
