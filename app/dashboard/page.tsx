'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [laundryItems, setLaundryItems] = useState([])

  // Load user and laundry data
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      const laundryKey = `laundry_${userData.id}`
      const savedLaundry = localStorage.getItem(laundryKey)
      if (savedLaundry) {
        setLaundryItems(JSON.parse(savedLaundry))
      }
    }
    setLoading(false)
  }, [])

  // Auto-add demo records for test user (only once)
  useEffect(() => {
    const addDemoRecordsIfNeeded = () => {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.email === 'test@gmail.com') {
          const laundryKey = `laundry_${userData.id}`
          const existingRecords = localStorage.getItem(laundryKey)
          if (!existingRecords || JSON.parse(existingRecords).length === 0) {
            const DEMO_RECORDS = [
              { id: Date.now(), date: '2026-06-01', pairs: 5, singles: 1, status: 'Received', amount: 110, pickupStatus: null, pickupDate: null, serviceType: 'Clothes' },
              { id: Date.now() + 1, date: '2026-06-02', pairs: 10, singles: 0, status: 'Ready', amount: 200, pickupStatus: null, pickupDate: null, serviceType: 'Clothes' },
              { id: Date.now() + 2, date: '2026-06-03', pairs: 2, singles: 0, status: 'Picked Up', amount: 100, pickupStatus: 'Picked Up', pickupDate: '2026-06-03', serviceType: 'Blanket' }
            ]
            localStorage.setItem(laundryKey, JSON.stringify(DEMO_RECORDS))
            setLaundryItems(DEMO_RECORDS)
          }
        }
      }
    }
    addDemoRecordsIfNeeded()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const calculateTotalAmount = () => {
    let total = 0
    for (let i = 0; i < laundryItems.length; i++) {
      total = total + laundryItems[i].amount
    }
    return total
  }

  const calculatePendingCount = () => {
    // Count items that still have unpaid amount (amount > 0)
    let count = 0
    for (let i = 0; i < laundryItems.length; i++) {
      if (laundryItems[i].amount > 0) {
        count++
      }
    }
    return count
  }

  const downloadPDF = () => {
    const today = new Date().toLocaleDateString()
    let totalSpent = 0
    for (let i = 0; i < laundryItems.length; i++) {
      totalSpent = totalSpent + laundryItems[i].amount
    }
    
    let tableRows = ''
    for (let i = 0; i < laundryItems.length; i++) {
      const item = laundryItems[i]
      tableRows = tableRows + `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.date}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.pairs}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.singles || 0}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.serviceType || 'Clothes'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.pickupStatus === 'Picked Up' ? 'Yes' : 'No'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.pickupDate || '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.amount}</td>
        </tr>
      `
    }

    const htmlContent = `<!DOCTYPE html>
      <html>
      <head>
        <title>Laundry History - ${user?.name}</title>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; margin: 40px; background: #f5f3ff; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 48px; }
          h1 { color: #4f46e5; font-weight: 600; }
          h3 { color: #4f46e5; font-weight: 500; }
          .info { margin-bottom: 20px; background: #f3e8ff; padding: 15px; border-radius: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #4f46e5; color: white; padding: 10px; border: 1px solid #ddd; font-weight: 500; }
          td { padding: 8px; border: 1px solid #ddd; }
          .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: 600; color: #ea580c; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🧺</div>
          <h1>WashMate</h1>
          <h3>Laundry History Report</h3>
        </div>
        
        <div class="info">
          <p><strong>Customer Name:</strong> ${user?.name}</p>
          <p><strong>Email:</strong> ${user?.email}</p>
          <p><strong>Generated On:</strong> ${today}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Pairs</th>
              <th>Single</th>
              <th>Service</th>
              <th>Picked Up</th>
              <th>Pickup Date</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div class="total">
          Total Amount Spent: ₹${totalSpent}
        </div>
        
        <div class="footer">
          <p>Thank you for choosing WashMate!</p>
          <p>Generated by WashMate Laundry Management System</p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = `laundry_history_${user?.name}_${today}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert('History report downloaded! Open the HTML file in browser to view.')
  }

  const handlePaymentSubmit = () => {
    const screenshot = (document.getElementById('screenshot') as HTMLInputElement)?.files?.[0]
    
    if (!screenshot) {
      alert('Please upload payment screenshot')
      return
    }
    
    const paymentRequest = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      amount: calculateTotalAmount(),
      screenshotName: screenshot.name,
      screenshotData: URL.createObjectURL(screenshot),
      status: 'PENDING',
      date: new Date().toISOString(),
      laundryItems: [...laundryItems]
    }
    
    const pendingPayments = JSON.parse(localStorage.getItem('pending_payments') || '[]')
    pendingPayments.push(paymentRequest)
    localStorage.setItem('pending_payments', JSON.stringify(pendingPayments))
    
    alert('✅ Payment details submitted! Admin will verify and update your status.')
    setShowPayment(false)
    
    const screenshotInput = document.getElementById('screenshot') as HTMLInputElement
    if (screenshotInput) screenshotInput.value = ''
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #ffffff, #f3e8ff)' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #ffffff, #f3e8ff)' }}
    >
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🧺 WashMate
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-indigo-50 px-3 py-1 rounded-full">👋 {user.name}</span>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome back, {user.name}! 🎉
          </h2>
          <p className="text-gray-400">Track your laundry orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <p className="text-sm opacity-90 font-medium">Total Pending Amount</p>
            <p className="text-4xl font-bold mt-1">₹{calculateTotalAmount()}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <p className="text-sm opacity-90 font-medium">Pending Items</p>
            <p className="text-4xl font-bold mt-1">{calculatePendingCount()}</p>
          </div>
        </div>

        {/* Laundry Records Table with PDF Button */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium text-gray-700">📋 Laundry Records</h3>
            {laundryItems.length > 0 && (
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-all flex items-center gap-1"
              >
                📥 Download PDF
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-indigo-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-indigo-600">Pair</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-indigo-600">Single</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-indigo-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-indigo-600">Pickup</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-indigo-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {laundryItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      🧺 No laundry records yet. Admin will add them for you.
                    </td>
                  </tr>
                ) : (
                  laundryItems.map((item) => (
                    <tr key={item.id} className="border-t border-indigo-50 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.pairs}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.singles || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Cleared' 
                            ? 'bg-gray-100 text-gray-500'
                            : item.pickupStatus === 'Picked Up' 
                              ? 'bg-blue-100 text-blue-600'
                              : item.status === 'Ready' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-amber-100 text-amber-600'
                        }`}>
                          {item.status === 'Cleared' 
                            ? '✅ Cleared' 
                            : item.pickupStatus === 'Picked Up' 
                              ? '📦 Picked Up' 
                              : item.status === 'Ready' 
                                ? '🟢 Ready for Pickup' 
                                : '📦 Received'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.pickupStatus === 'Picked Up' ? (
                          <div>
                            <span className="text-green-600 text-xs">✓ Picked</span>
                            <p className="text-xs text-gray-400">{item.pickupDate}</p>
                          </div>
                        ) : item.status === 'Cleared' ? (
                          <span className="text-gray-400 text-xs">Payment Done</span>
                        ) : item.status === 'Ready' ? (
                          <span className="text-blue-500 text-xs">Waiting for pickup</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Processing</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">₹{item.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {laundryItems.length > 0 && (
                <tfoot className="bg-indigo-50 border-t border-indigo-100">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right font-medium text-gray-600">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-lg font-bold text-orange-600">
                      ₹{calculateTotalAmount()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Payment Section - Shows if there is any pending amount */}
        {calculateTotalAmount() > 0 && !showPayment && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowPayment(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💰 Click here for Payment
            </button>
          </div>
        )}

        {/* Payment Details */}
        {showPayment && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-700">💳 Payment Details</h3>
              <button 
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">Total Amount to Pay:</p>
              <p className="text-4xl font-bold text-orange-600 mb-6">₹{calculateTotalAmount()}</p>
              
              <div className="border-t border-indigo-200 pt-4 mt-4">
                <div className="mb-3">
                  <p className="text-gray-600 mb-1">📱 UPI ID</p>
                  <p className="font-mono font-semibold text-indigo-600 text-lg">rishidalwadi2811@okicici</p>
                </div>
                <div className="mb-3">
                  <p className="text-gray-600 mb-1">📞 Mobile Number</p>
                  <p className="font-mono font-semibold text-indigo-600 text-lg">9265999304</p>
                </div>
                <p className="text-sm text-gray-400 mt-3">Pay using any UPI app (Google Pay, PhonePe, Paytm)</p>
              </div>
              
              <div className="mt-6 border-t border-indigo-200 pt-4">
                <p className="font-medium text-gray-700 mb-3">After payment, upload screenshot:</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Payment Screenshot</label>
                    <input
                      type="file"
                      id="screenshot"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Upload screenshot of payment (PNG, JPG)</p>
                  </div>
                  
                  <button 
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                    onClick={handlePaymentSubmit}
                  >
                    ✅ Submit Payment Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}