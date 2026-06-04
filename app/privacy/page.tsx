'use client'

import Link from 'next/link'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
              <p className="text-gray-600">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Payment information (processed securely)</li>
                <li>Laundry preferences and special instructions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                <li>Process your laundry orders</li>
                <li>Communicate about order status</li>
                <li>Send payment confirmations and receipts</li>
                <li>Improve our services</li>
                <li>Respond to your inquiries</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Information Sharing</h2>
              <p className="text-gray-600">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                <li>Service providers who assist in laundry processing</li>
                <li>Payment processors for transaction handling</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
              <p className="text-gray-600">We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Cookies and Tracking</h2>
              <p className="text-gray-600">We use cookies to enhance your experience on our website. You can set your browser to refuse cookies, but some features may not function properly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Rights</h2>
              <p className="text-gray-600">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

          
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to This Policy</h2>
              <p className="text-gray-600">We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
              <p className="text-gray-600">If you have questions about this Privacy Policy, please contact us:</p>
              <p className="text-gray-600 mt-2">📧washmate28@gmail.com</p>
              
              <p className="text-gray-600">📞 +91 9054747442</p>
              <p className="text-gray-600">📞 +91 9265999304</p>
              <p className="text-gray-600">📍 WashMate Laundry Services</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">Your privacy is important to us. We are committed to protecting your personal information.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}