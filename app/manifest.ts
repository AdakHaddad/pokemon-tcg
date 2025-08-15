import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pokémon TCG Holographic Viewer',
    short_name: 'Pokémon TCG',
    description: 'Interactive 3D holographic Pokémon trading card viewer',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a2e',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}