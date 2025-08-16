"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

interface PokemonCard {
  id: string
  name: string
  hp: string
  types: string[]
  images: {
    small: string
    large: string
  }
  attacks?: Array<{
    name: string
    cost: string[]
    damage: string
    text: string
  }>
  weaknesses?: Array<{
    type: string
    value: string
  }>
  resistances?: Array<{
    type: string
    value: string
  }>
  retreatCost?: string[]
  number: string
  set: {
    name: string
  }
}

export default function PokemonCard() {
  const [pitch, setPitch] = useState(0) // front/back tilt
  const [roll, setRoll] = useState(0) // left/right tilt
  const [needsPermission, setNeedsPermission] = useState(false)
  const [cardData, setCardData] = useState<PokemonCard | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch Pokémon card data
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true)
        
        // Check for URL parameter
        const urlParams = new URLSearchParams(window.location.search)
        const cardId = urlParams.get('id')
        
        let url = 'https://api.pokemontcg.io/v2/cards'
        if (cardId) {
          url += `/${cardId}`
        } else {
          url += '?q=name:charizard&orderBy=-set.releaseDate'
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
                 if (cardId && data.data) {
           // Single card response
           setCardData(data.data)
         } else if (data.data && data.data.length > 0) {
           // Multiple cards response - get the most recent card with images
           const defaultCard = data.data.find((card: PokemonCard) => 
             card.images?.large
           ) || data.data[0]
           
           setCardData(defaultCard)
        }
      } catch (error) {
        console.error('Failed to fetch card data:', error)
        // Fallback to default card structure
        setCardData({
          id: "base4-4",
          name: "Charizard",
          hp: "120",
          types: ["Fire"],
          images: {
            small: "/card.png",
            large: "/card.png"
          },
          attacks: [
            {
              name: "Fire Blast",
              cost: ["Fire", "Fire", "Fire", "Fire"],
              damage: "100",
              text: "Discard 1 Energy card attached to Charizard in order to use this attack."
            }
          ],
          weaknesses: [{ type: "Water", value: "×2" }],
          resistances: [{ type: "Electric", value: "-30" }],
          retreatCost: ["Colorless", "Colorless", "Colorless"],
          number: "4",
          set: { name: "Base Set" }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCardData()
  }, [])

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setPitch(e.beta ?? 0) // range: -180..180
      setRoll(e.gamma ?? 0) // range: -90..90
    }

         // Check if we need permission (iOS Safari)
     const DOE = (window as typeof window & { DeviceOrientationEvent?: typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent
      if (DOE && typeof DOE.requestPermission === "function") {
      setNeedsPermission(true)
      } else {
      // Android Chrome and other browsers work out of the box
      window.addEventListener("deviceorientation", handleOrientation)
    }

    // Mouse fallback for desktop
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setRoll(x * 30) // Convert to degrees
      setPitch(y * 30)
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

     // iOS permission request
  const requestMotion = async () => {
    try {
       const DOE = (window as typeof window & { DeviceOrientationEvent?: typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent
      if (DOE && typeof DOE.requestPermission === "function") {
        const res = await DOE.requestPermission()
        if (res === "granted") {
          window.addEventListener("deviceorientation", (e: DeviceOrientationEvent) => {
            setPitch(e.beta ?? 0)
            setRoll(e.gamma ?? 0)
          })
          setNeedsPermission(false)
        }
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

  const tiltX = clamp(roll, -45, 45)
  const tiltY = clamp(pitch, -45, 45)

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-neutral-900">
                 <div className="text-white text-xl">Loading Pokémon Card...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-neutral-900 relative overflow-hidden">
    <div
        className="relative w-80 h-[28rem] rounded-2xl transition-all duration-200 ease-out overflow-hidden"
      style={{
          boxShadow: `
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(150, 100, 255, 0.4)
          `,
        }}
      >
        {/* Card Image Base */}
        <Image
          src={cardData?.images?.large || "/card.png"}
          alt={`${cardData?.name || "Pokemon"} Card`}
          fill
          className="object-cover rounded-2xl"
          priority
          onError={(e) => {
            // Fallback to local image if API image fails
            (e.target as HTMLImageElement).src = "/card.png"
          }}
        />

        {/* Holographic Rainbow Border Overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(
                ${45 + tiltX * 2}deg,
                hsl(${280 + tiltY * 2}, 100%, 60%),
                hsl(${200 - tiltY * 2}, 100%, 50%),
                hsl(${120 + tiltX * 2}, 100%, 60%),
                hsl(${60 - tiltX * 2}, 100%, 55%),
                hsl(${320 + tiltY * 2}, 100%, 65%)
              )
            `,
            backgroundSize: "400% 400%",
            backgroundPosition: `${50 + tiltX}% ${50 + tiltY}%`,
            mask: `
              radial-gradient(circle at center, transparent 85%, black 88%, black 100%)
            `,
            WebkitMask: `
              radial-gradient(circle at center, transparent 85%, black 88%, black 100%)
            `,
            opacity: 0.8,
          }}
        />

        {/* Holographic Sparkles Overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(circle at ${25 + tiltX * 2}% ${15 + tiltY * 2}%, rgba(255, 215, 0, 0.8) 1px, transparent 3px),
              radial-gradient(circle at ${75 - tiltX * 2}% ${85 - tiltY * 2}%, rgba(0, 255, 255, 0.7) 1px, transparent 3px),
              radial-gradient(circle at ${45 + tiltX}% ${35 + tiltY}%, rgba(255, 105, 180, 0.6) 1px, transparent 3px),
              radial-gradient(circle at ${15 - tiltX}% ${65 + tiltY * 2}%, rgba(50, 205, 50, 0.7) 1px, transparent 3px),
              radial-gradient(circle at ${85 + tiltX * 2}% ${25 - tiltY}%, rgba(255, 69, 0, 0.8) 1px, transparent 3px),
              radial-gradient(circle at ${35 - tiltX}% ${75 + tiltY}%, rgba(138, 43, 226, 0.6) 1px, transparent 3px),
              radial-gradient(circle at ${60 + tiltX}% ${45 - tiltY}%, rgba(255, 20, 147, 0.7) 1px, transparent 3px),
              radial-gradient(circle at ${20 - tiltX}% ${80 + tiltY}%, rgba(0, 191, 255, 0.6) 1px, transparent 3px)
            `,
            backgroundSize: "15px 15px, 20px 20px, 25px 25px, 30px 30px, 18px 18px, 22px 22px, 28px 28px, 35px 35px",
          }}
        />

        {/* Rainbow Prismatic Sweep */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(${60 + tiltX * 3}deg, 
                transparent 10%,
                rgba(255, 0, 150, 0.4) 25%,
                rgba(0, 255, 255, 0.4) 35%,
                rgba(255, 255, 0, 0.4) 45%,
                rgba(150, 0, 255, 0.4) 55%,
                rgba(255, 100, 0, 0.4) 65%,
                rgba(0, 255, 150, 0.4) 75%,
                transparent 90%
              )
            `,
          }}
        />

        {/* Holographic Shine Effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(
                ${135 + tiltX * 4}deg,
                transparent 20%,
                rgba(255, 255, 255, 0.6) 40%,
                rgba(255, 200, 100, 0.4) 50%,
                rgba(255, 255, 255, 0.6) 60%,
                transparent 80%
              )
            `,
            opacity: 0.5,
          }}
        />

        {/* Rotating Conic Gradient Overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              conic-gradient(
                from ${tiltX * 6}deg at ${50 + tiltX / 4}% ${50 + tiltY / 4}%,
                transparent 0deg,
                rgba(255, 0, 150, 0.5) 45deg,
                rgba(0, 255, 255, 0.5) 90deg,
                rgba(255, 255, 0, 0.5) 135deg,
                rgba(255, 100, 0, 0.5) 180deg,
                rgba(150, 0, 255, 0.5) 225deg,
                rgba(0, 255, 100, 0.5) 270deg,
                rgba(255, 0, 150, 0.5) 315deg,
                transparent 360deg
              )
            `,
            mask: `
              radial-gradient(circle at center, black 0%, black 70%, transparent 85%)
            `,
            WebkitMask: `
              radial-gradient(circle at center, black 0%, black 70%, transparent 85%)
            `,
          }}
        />
      </div>

      {/* Permission button for iOS */}
      {needsPermission && (
        <button
          onClick={requestMotion}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl border border-white/20 bg-gray-900/90 backdrop-blur-md text-white text-sm cursor-pointer"
        >
          Tap to enable motion ✨
        </button>
      )}

             {/* Instruction text */}
       <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white/70 text-center text-sm pointer-events-none">
         <div>Tilt your phone or move your mouse ✨</div>
         {cardData && (
           <div className="mt-2 text-xs">
             {cardData.name} • {cardData.set.name} • #{cardData.number}
           </div>
         )}
       </div>

      {/* Card Info Panel */}
      {cardData && (
        <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white text-sm max-w-sm">
          <h3 className="text-lg font-bold mb-2">{cardData.name}</h3>
          <div className="space-y-1 text-xs">
            <div>HP: {cardData.hp} • Type: {cardData.types?.join(", ")}</div>
            {cardData.attacks && cardData.attacks.length > 0 && (
              <div>
                <strong>Attack:</strong> {cardData.attacks[0].name} ({cardData.attacks[0].damage})
              </div>
            )}
            {cardData.weaknesses && (
              <div>
                <strong>Weakness:</strong> {cardData.weaknesses[0].type} {cardData.weaknesses[0].value}
              </div>
            )}
            <div className="text-gray-400">Set: {cardData.set.name}</div>
          </div>
      </div>
      )}
    </div>
  )
}
