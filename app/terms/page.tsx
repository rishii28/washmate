'use client'

import Link from 'next/link'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🧺 WashMate
          </Link>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
              <p className="text-gray-600">Welcome to WashMate. By using our laundry management services, you agree to these Terms of Service. Please read them carefully.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Our Services</h2>
              <p className="text-gray-600">WashMate provides laundry management services including but not limited to:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                
                <li>Washing, drying, and folding services</li>
                <li>Special care for delicate fabrics</li>
                <li>Stain removal services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
              <p className="text-gray-600">To use our services, you must register an account. You are responsible for:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                <li>Maintaining the confidentiality of your password</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Pricing and Payment</h2>
              <p className="text-gray-600">All prices are in Indian Rupees (₹). Payment is required before laundry processing. Prices may change without prior notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Liability</h2>
              <p className="text-gray-600">We take utmost care with your garments. However, we are not liable for:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                <li>Normal wear and tear</li>
                <li>Pre-existing damage</li>
                <li>Items left in pockets</li>
                <li>Delicate fabrics washed against care instructions</li>
              </ul>
            </section>

            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Privacy</h2>
              <p className="text-gray-600">Your privacy is important to us. Please review our <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link> to understand how we collect and use your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to Terms</h2>
              <p className="text-gray-600">We may update these terms from time to time. Continued use of our services constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
              <p className="text-gray-600">If you have any questions about these Terms, please contact us at:</p>
              <p className="text-gray-600 mt-2">📧 washmate28@gmail.com</p>
              <p className="text-gray-600">📞 +91 9054747442</p>
              <p className="text-gray-600">📞 +91 9265999304</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">By using WashMate, you agree to these Terms of Service.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}