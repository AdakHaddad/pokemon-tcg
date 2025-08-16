"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
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
  set: {
    name: string
  }
  number: string
  rarity?: string
}

export default function PokemonLandingPage() {
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pokémon TCG Holographic Viewer",
    "description": "Interactive 3D holographic Pokémon trading card viewer with real-time TCG API data",
    "url": "https://pokemon-holocard.vercel.app",
    "applicationCategory": "Entertainment",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Pokémon TCG Viewer"
    },
    "featureList": [
      "Interactive 3D holographic effects",
      "Real-time Pokémon TCG API integration",
      "Search and filter by card type",
      "Mobile responsive design",
      "Device motion support"
    ]
  }
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const cardsPerPage = 24

  const pokemonTypes = [
    "all", "Fire", "Water", "Grass", "Electric", "Psychic", 
    "Ice", "Dragon", "Dark", "Fairy", "Normal", "Fighting", 
    "Poison", "Ground", "Flying", "Bug", "Rock", "Ghost", "Steel"
  ]

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true)
        const pageParam = `&page=${currentPage}`
        const pageSizeParam = `&pageSize=${cardsPerPage}`
        let url = `https://api.pokemontcg.io/v2/cards?orderBy=-set.releaseDate${pageSizeParam}${pageParam}`
        
        if (searchTerm) {
          url += `&q=name:${searchTerm}`
        } else if (selectedType !== "all") {
          url += `&q=types:${selectedType}`
        }

        const response = await fetch(url)
        const data = await response.json()
        
        if (data.data) {
          setCards(data.data.filter((card: PokemonCard) => card.images?.small))
          setTotalCount(data.totalCount || 0)
          setTotalPages(Math.ceil((data.totalCount || 0) / cardsPerPage))
        }
      } catch (error) {
        console.error('Failed to fetch cards:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [searchTerm, selectedType, currentPage])

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const generatePageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5)
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2)
      }
    }
    
    return pages
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              Pokémon TCG
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Discover holographic trading cards from the Pokémon universe
            </p>
            
            {/* SEO-friendly hidden text */}
            <div className="sr-only">
              <h2>Interactive Holographic Pokémon Card Viewer</h2>
              <p>Experience stunning 3D holographic effects on authentic Pokémon trading cards. Browse the complete TCG database, search by Pokémon type, and view cards in immersive detail with real-time API integration.</p>
            </div>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto space-y-4">
              <form onSubmit={handleSearch} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search for Pokémon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Search Pokémon cards by name"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Search
                </button>
              </form>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full md:w-auto px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Filter Pokémon cards by type"
              >
                {pokemonTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-900">
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-white/70 mt-4">Loading Pokémon cards...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {cards.map((card) => (
                <Link key={card.id} href={`/holo?id=${card.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
                      {/* Holographic Border Effect */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `
                            linear-gradient(45deg,
                              hsl(280, 100%, 60%),
                              hsl(200, 100%, 50%),
                              hsl(120, 100%, 60%),
                              hsl(60, 100%, 55%),
                              hsl(320, 100%, 65%)
                            )
                          `,
                          mask: `radial-gradient(circle at center, transparent 85%, black 88%, black 100%)`,
                          WebkitMask: `radial-gradient(circle at center, transparent 85%, black 88%, black 100%)`,
                        }}
                      ></div>
                      
                      <div className="relative p-4">
                        <Image
                          src={card.images.small}
                          alt={card.name}
                          width={245}
                          height={342}
                          className="w-full h-auto rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        />
                        
                        <div className="mt-3 space-y-1">
                          <h3 className="text-white font-semibold text-sm truncate">
                            {card.name}
                          </h3>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-300">
                              HP: {card.hp || "?"}
                            </span>
                            <span className="text-cyan-300">
                              {card.types?.[0] || "Unknown"}
                            </span>
                          </div>
                          <div className="text-xs text-white/60 truncate">
                            {card.set.name} • #{card.number}
                          </div>
                          {card.rarity && (
                            <div className="text-xs text-yellow-400">
                              {card.rarity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Page Info */}
                <div className="text-white/60 text-sm order-2 sm:order-1">
                  Page {currentPage} of {totalPages} ({totalCount.toLocaleString()} total cards)
                </div>
                
                {/* Pagination Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all text-sm"
                    aria-label="Previous page"
                  >
                    ←
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {generatePageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                          currentPage === page
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all text-sm"
                    aria-label="Next page"
                  >
                    →
                  </button>
                </div>
                
                {/* Quick Jump (Desktop Only) */}
                <div className="hidden lg:flex items-center gap-2 order-3 text-sm">
                  <span className="text-white/60">Go to:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value)
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page)
                      }
                    }}
                    className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Jump to page number"
                  />
                </div>
              </div>
            )}
            
            {cards.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-white/70 text-lg">No cards found. Try a different search term.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-white/60">
            <p>Powered by Pokémon TCG API</p>
            <p className="mt-2 text-sm">
              Discover holographic cards • Click any card to view in 3D
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
