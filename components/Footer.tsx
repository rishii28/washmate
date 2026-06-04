'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="text-center py-6 mt-8 border-t border-indigo-100">
      <div className="flex justify-center gap-6 mb-3 flex-wrap">
        <Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-600 transition">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600 transition">
          Privacy Policy
        </Link>
      </div>
      <p className="text-sm text-gray-500">
        © {currentYear} WashMate. All rights reserved.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Fast, Simple & Reliable Laundry Service
      </p>
    </footer>
  )
}