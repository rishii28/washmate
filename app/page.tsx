'use client'

import { useState } from 'react'
import SplashScreen from '@/components/SplashScreen'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8 animate-bounce">
          <span className="text-7xl">🧺</span>
        </div>
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">
          WashMate
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Fast, Simple & Reliable Laundry Service
        </p>
        <div className="space-x-4">
          <a 
            href="/login" 
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
          >
            Register
          </a>
        </div>
      </div>
      
    </div>
  )
}