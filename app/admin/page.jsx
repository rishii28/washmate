'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [pairs, setPairs] = useState('')
  const [singles, setSingles] = useState('0')
  const [serviceType, setServiceType] = useState('Clothes')
  const [pricePerPair, setPricePerPair] = useState('20')
  const [isAdding, setIsAdding] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [customerLaundry, setCustomerLaundry] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [clearedPayments, setClearedPayments] = useState([])
  const [approvals, setApprovals] = useState([])
  const [greeting, setGreeting] = useState('')
  const [showAnimation, setShowAnimation] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
    
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    if (password === 'admin@2811') {
      setIsLoggedIn(true)
      loadAllData()
    } else {
      alert('Wrong password')
    }
  }

  const loadAllData = () => {
    loadCustomersFromDB()
    loadPendingPayments()
    loadClearedPayments()
    loadApprovalsFromDB()
  }

  const loadCustomersFromDB = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      if (data.users) {
        const sortedCustomers = data.users.sort((a, b) => {
          if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
          if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
          return 0
        })
        setCustomers(sortedCustomers)
        setFilteredCustomers(sortedCustomers)
      }
    } catch (error) {
      console.error('Error loading customers:', error)
    }
    setLoading(false)
  }

  const loadApprovalsFromDB = async () => {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      if (data.users) {
        const pendingCustomers = data.users.filter(u => u.status === 'PENDING')
        setApprovals(pendingCustomers)
      }
    } catch (error) {
      console.error('Error loading approvals:', error)
    }
  }

  const approveCustomer = async (customerId) => {
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: customerId, status: 'ACTIVE' })
      })
      
      if (response.ok) {
        alert('✅ Customer approved successfully!')
        loadCustomersFromDB()
        loadApprovalsFromDB()
      } else {
        alert('Failed to approve customer')
      }
    } catch (error) {
      alert('Error approving customer')
    }
  }

  const rejectCustomer = async (customerId) => {
    if (confirm('Reject this customer?')) {
      try {
        const response = await fetch('/api/admin/approve-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: customerId, status: 'REJECTED' })
        })
        
        if (response.ok) {
          alert('❌ Customer rejected')
          loadCustomersFromDB()
          loadApprovalsFromDB()
        }
      } catch (error) {
        alert('Error rejecting customer')
      }
    }
  }

  const loadPendingPayments = () => {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]')
    setPendingPayments(payments)
  }

  const loadClearedPayments = () => {
    const cleared = JSON.parse(localStorage.getItem('cleared_payments') || '[]')
    setClearedPayments(cleared)
  }

  const loadCustomerLaundry = (customerId) => {
    const laundryKey = `laundry_${customerId}`
    const saved = localStorage.getItem(laundryKey)
    setCustomerLaundry(saved ? JSON.parse(saved) : [])
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = customers.filter(customer => 
      customer.name?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.includes(term)
    )
    setFilteredCustomers(filtered)
  }

  const toggleCustomerStatus = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    const newStatus = customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    const updatedCustomers = customers.map(c => 
      c.id === customerId ? { ...c, status: newStatus } : c
    )
    setCustomers(updatedCustomers)
    setFilteredCustomers(updatedCustomers)
    
    const userKey = `user_${customerId}`
    const updatedUser = updatedCustomers.find(c => c.id === customerId)
    localStorage.setItem(userKey, JSON.stringify(updatedUser))
    
    alert(`✅ Customer marked as ${newStatus}`)
  }

  const deleteCustomer = (customerId) => {
    if (confirm('⚠️ Are you sure you want to DELETE this customer? This action cannot be undone!')) {
      const updatedCustomers = customers.filter(c => c.id !== customerId)
      setCustomers(updatedCustomers)
      setFilteredCustomers(updatedCustomers)
      
      localStorage.removeItem(`user_${customerId}`)
      
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const updatedAllUsers = allUsers.filter(u => u.id !== customerId)
      localStorage.setItem('all_users', JSON.stringify(updatedAllUsers))
      
      localStorage.removeItem(`laundry_${customerId}`)
      
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null)
      }
      
      alert(`✅ Customer deleted successfully.`)
    }
  }

  const addLaundry = () => {
    if (!pairs || parseInt(pairs) <= 0) {
      alert('Please enter number of pairs')
      return
    }

    setIsAdding(true)
    
    let amount = 0
    if (serviceType === 'Clothes') {
      amount = (parseInt(pairs) * parseInt(pricePerPair)) + (parseInt(singles) * 10)
    } else if (serviceType === 'Bedsheet') {
      amount = parseInt(pairs) * 50
    } else if (serviceType === 'Blanket') {
      amount = parseInt(pairs) * 100
    }
    
    const newEntry = {
      id: Date.now(),
      date: selectedDate,
      pairs: parseInt(pairs),
      singles: parseInt(singles) || 0,
      status: 'Received',
      amount: amount,
      pickupStatus: null,
      pickupDate: null,
      serviceType: serviceType
    }
    
    const laundryKey = `laundry_${selectedCustomer.id}`
    const existing = JSON.parse(localStorage.getItem(laundryKey) || '[]')
    existing.push(newEntry)
    localStorage.setItem(laundryKey, JSON.stringify(existing))
    
    alert(`✅ Laundry added! Total: ₹${amount}`)
    
    setPairs('')
    setSingles('0')
    setServiceType('Clothes')
    setPricePerPair('20')
    setSelectedDate(new Date().toISOString().split('T')[0])
    setIsAdding(false)
    loadCustomerLaundry(selectedCustomer.id)
  }

  const markAsReady = (itemId) => {
    const updated = customerLaundry.map(item => 
      item.id === itemId ? { ...item, status: 'Ready' } : item
    )
    setCustomerLaundry(updated)
    const laundryKey = `laundry_${selectedCustomer.id}`
    localStorage.setItem(laundryKey, JSON.stringify(updated))
    alert(`✅ Status changed to Ready`)
  }

  const markPickup = (itemId) => {
    const today = new Date().toISOString().split('T')[0]
    
    const updated = customerLaundry.map(item => 
      item.id === itemId ? { 
        ...item, 
        pickupStatus: 'Picked Up', 
        pickupDate: today,
        status: 'Completed'
      } : item
    )
    setCustomerLaundry(updated)
    const laundryKey = `laundry_${selectedCustomer.id}`
    localStorage.setItem(laundryKey, JSON.stringify(updated))
    alert(`✅ Pickup recorded for ${today}`)
  }

  const sendEmailToCustomer = async (email, name, amount, transactionId = null, paymentType = 'ONLINE') => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          name: name,
          amount: amount,
          paymentDate: new Date().toLocaleDateString(),
          transactionId: transactionId || (paymentType === 'CASH' ? 'Cash Payment' : null),
          paymentType: paymentType
        })
      })
      if (response.ok) {
        console.log('Email sent successfully')
        return true
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  const markCashPayment = async () => {
    if (confirm(`Mark all pending laundry as PAID for ${selectedCustomer.name}? This will clear all pending records.`)) {
      const totalAmount = customerLaundry.reduce((sum, item) => sum + item.amount, 0)
      
      await sendEmailToCustomer(selectedCustomer.email, selectedCustomer.name, totalAmount, 'Cash Payment', 'CASH')
      
      const clearedRecord = {
        id: Date.now(),
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        amount: totalAmount,
        date: new Date().toISOString().split('T')[0],
        type: 'CASH',
        status: 'CLEARED'
      }
      
      const cleared = JSON.parse(localStorage.getItem('cleared_payments') || '[]')
      cleared.push(clearedRecord)
      localStorage.setItem('cleared_payments', JSON.stringify(cleared))
      loadClearedPayments()
      
      const laundryKey = `laundry_${selectedCustomer.id}`
      localStorage.setItem(laundryKey, '[]')
      setCustomerLaundry([])
      
      alert(`✅ Cash payment recorded. ₹${totalAmount} added to revenue. Email sent to ${selectedCustomer.email}`)
    }
  }

  const clearPayment = async (payment) => {
    if (confirm(`Clear this payment of ₹${payment.amount} from ${payment.userName}? It will be added to revenue.`)) {
      
      await sendEmailToCustomer(payment.userEmail, payment.userName, payment.amount, payment.transactionId, 'ONLINE')
      
      const clearedRecord = {
        id: Date.now(),
        customerId: payment.userId,
        customerName: payment.userName,
        amount: payment.amount,
        transactionId: payment.transactionId,
        date: new Date().toISOString().split('T')[0],
        paymentDate: payment.date,
        type: 'ONLINE',
        status: 'CLEARED'
      }
      
      const cleared = JSON.parse(localStorage.getItem('cleared_payments') || '[]')
      cleared.push(clearedRecord)
      localStorage.setItem('cleared_payments', JSON.stringify(cleared))
      loadClearedPayments()
      
      const updatedPayments = pendingPayments.filter(p => p.id !== payment.id)
      localStorage.setItem('pending_payments', JSON.stringify(updatedPayments))
      setPendingPayments(updatedPayments)
      setSelectedPayment(null)
      
      const laundryKey = `laundry_${payment.userId}`
      localStorage.setItem(laundryKey, '[]')
      
      alert(`✅ Payment cleared! ₹${payment.amount} added to revenue. Email sent to ${payment.userEmail}`)
      loadCustomersFromDB()
    }
  }

  const markPaymentAsRead = (paymentId) => {
    const updatedPayments = pendingPayments.map(p => 
      p.id === paymentId ? { ...p, isRead: true } : p
    )
    localStorage.setItem('pending_payments', JSON.stringify(updatedPayments))
    setPendingPayments(updatedPayments)
    alert('✅ Payment marked as read')
  }

  const getUnreadPaymentsCount = () => {
    return pendingPayments.filter(p => !p.isRead).length
  }

  const getTotalRevenue = () => {
    return clearedPayments.reduce((sum, p) => sum + p.amount, 0)
  }

  const RefreshAnimation = () => {
    if (!showAnimation) return null
    
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center z-50 animate-fade-out">
        <div className="text-center animate-scale-in">
          <div className="text-5xl animate-bounce">🧺</div>
          <h1 className="text-2xl text-indigo-600 mt-2 animate-pulse">Quickly</h1>
          <p className="text-gray-500 text-sm mt-1 animate-fade-in">Fast, Simple & Reliable</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <RefreshAnimation />
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #ffffff, #f3e8ff)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">👑</div>
              <h1 className="text-2xl text-indigo-600">Admin Login</h1>
            </div>
            <input
              type="password"
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Login
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center"></p>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <RefreshAnimation />
      <div 
        className="min-h-screen"
        style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #ffffff, #f3e8ff)' }}
      >
        {/* Top Navbar */}
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 px-6 py-4 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              👑 Admin Panel
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button onClick={() => setIsLoggedIn(false)} className="text-red-500 hover:text-red-600">Logout</button>
            </div>
          </div>
        </nav>

        <div className="flex min-h-[calc(100vh-73px)]">
          {/* Sidebar */}
          <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-indigo-100 p-4">
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('dashboard'); setSelectedCustomer(null); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                📊 Dashboard
              </button>
              
              <button
                onClick={() => { setActiveTab('customers'); setSelectedCustomer(null); loadCustomersFromDB(); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'customers' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                👥 Customers
                {getUnreadPaymentsCount() > 0 && activeTab !== 'customers' && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{getUnreadPaymentsCount()}</span>
                )}
              </button>
              
              <button
                onClick={() => { setActiveTab('payments'); loadPendingPayments(); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'payments' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                💳 Payments
                {getUnreadPaymentsCount() > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{getUnreadPaymentsCount()}</span>
                )}
              </button>
              
              <button
                onClick={() => { setActiveTab('approvals'); loadApprovalsFromDB(); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'approvals' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                ✅ Approvals
                {approvals.length > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{approvals.length}</span>
                )}
              </button>
              
              <button
                onClick={() => { setActiveTab('revenue'); loadClearedPayments(); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'revenue' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                💰 Revenue
              </button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-indigo-100">
              <p className="text-xs text-gray-400 text-center">WashMate v1.0</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100 text-center">
                <div className="text-6xl mb-4">🧺</div>
                <h1 className="text-3xl text-gray-700 mb-2">{greeting}, Admin! 👋</h1>
                <p className="text-xl text-indigo-600 mb-4">Let's start maintaining your laundry!</p>
                <p className="text-gray-400">Use the sidebar to manage customers, approvals, payments, and track revenue.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">👥</div>
                    <p className="text-gray-700">{customers.filter(c => c.status === 'ACTIVE').length} Active</p>
                    <p className="text-sm text-gray-400">Total: {customers.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">⏳</div>
                    <p className="text-gray-700">{approvals.length} Pending</p>
                    <p className="text-sm text-gray-400">Awaiting Approval</p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">💳</div>
                    <p className="text-gray-700">{pendingPayments.length} Payments</p>
                    <p className="text-sm text-gray-400">To Review</p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="text-gray-700">₹{getTotalRevenue()}</p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Customer List */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-gray-700">👥 Customers</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { loadCustomersFromDB(); loadPendingPayments(); alert('Refreshed!'); }}
                        className="text-indigo-500 text-sm hover:text-indigo-600"
                      >
                        🔄 Refresh
                      </button>
                      <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        Active: {customers.filter(c => c.status === 'ACTIVE').length} | Total: {filteredCustomers.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="🔍 Search by name, email or phone..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredCustomers.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No customers found</p>
                    ) : (
                      filteredCustomers.map((customer, index) => {
                        const unreadPayments = pendingPayments.filter(p => p.userId === customer.id && !p.isRead).length
                        
                        return (
                          <div
                            key={customer.id}
                            onClick={() => {
                              setSelectedCustomer(customer)
                              loadCustomerLaundry(customer.id)
                              setPairs('')
                              setSingles('0')
                              setSelectedDate(new Date().toISOString().split('T')[0])
                            }}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                              selectedCustomer?.id === customer.id 
                                ? 'bg-indigo-50 border-indigo-300 shadow-md' 
                                : 'bg-gray-50 border-gray-100 hover:bg-indigo-50/50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-gray-700">
                                  {index + 1}. {customer.name}
                                </p>
                                <p className="text-sm text-gray-400">{customer.email}</p>
                                <p className="text-sm text-gray-400">{customer.phone}</p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                  customer.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {customer.status || 'ACTIVE'}
                                </span>
                                {unreadPayments > 0 && (
                                  <div className="mt-1">
                                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-red-500 ml-1">{unreadPayments}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                {selectedCustomer && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg text-gray-700">👤 Customer Details</h2>
                        <button
                          onClick={() => toggleCustomerStatus(selectedCustomer.id)}
                          className={`text-sm px-3 py-1 rounded-lg ${
                            selectedCustomer.status === 'ACTIVE' 
                              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {selectedCustomer.status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="text-gray-700">{selectedCustomer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-gray-700">{selectedCustomer.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-gray-700 text-sm">{selectedCustomer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Joining Date</p>
                          <p className="text-gray-700">{selectedCustomer.joinDate?.split('T')[0] || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => deleteCustomer(selectedCustomer.id)}
                          className="w-full bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition-all"
                        >
                          🗑️ Remove Customer
                        </button>
                      </div>
                    </div>

                    {selectedCustomer.status === 'ACTIVE' && (
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                        <h2 className="text-lg text-gray-700 mb-4">➕ Add Laundry</h2>
                        <div className="space-y-3">
                          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                            <option value="Clothes">👕 Clothes</option>
                            <option value="Bedsheet">🛏️ Bedsheet (₹50 fixed)</option>
                            <option value="Blanket">🛌 Blanket (₹100 fixed)</option>
                          </select>
                          <input type="number" value={pairs} onChange={(e) => setPairs(e.target.value)} placeholder="Number of Pairs" className="w-full px-3 py-2 border rounded-lg" />
                          {serviceType === 'Clothes' && (
                            <>
                              <input type="number" value={singles} onChange={(e) => setSingles(e.target.value)} placeholder="Single Pieces" className="w-full px-3 py-2 border rounded-lg" />
                              <select value={pricePerPair} onChange={(e) => setPricePerPair(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                <option value="20">₹20 per pair </option>
                                <option value="15">₹15 per pair </option>
                              </select>
                            </>
                          )}
                          <button onClick={addLaundry} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">➕ Add Laundry</button>
                          <button onClick={markCashPayment} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">💰 Mark Cash Payment</button>
                        </div>
                      </div>
                    )}

                    {selectedCustomer.status === 'ACTIVE' && (
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg text-gray-700">📋 Laundry Records</h2>
                          <button onClick={() => {
                            const laundryKey = `laundry_${selectedCustomer.id}`
                            localStorage.setItem(laundryKey, '[]')
                            setCustomerLaundry([])
                            alert('All records cleared!')
                          }} className="text-red-500 text-sm">Clear All</button>
                        </div>
                        {customerLaundry.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No records</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-indigo-50">
                                <tr>
                                  <th className="p-2 text-left text-gray-600">Date</th>
                                  <th className="p-2 text-left text-gray-600">Pairs</th>
                                  <th className="p-2 text-left text-gray-600">Single</th>
                                  <th className="p-2 text-left text-gray-600">Amount</th>
                                  <th className="p-2 text-left text-gray-600">Status</th>
                                  <th className="p-2 text-left text-gray-600">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {customerLaundry.map((item) => (
                                  <tr key={item.id} className="border-t">
                                    <td className="p-2 text-gray-600">{item.date}</td>
                                    <td className="p-2 text-gray-600">{item.pairs}</td>
                                    <td className="p-2 text-gray-600">{item.singles || 0}</td>
                                    <td className="p-2 text-gray-600">₹{item.amount}</td>
                                    <td className="p-2 text-gray-600">{item.pickupStatus === 'Picked Up' ? '✅ Completed' : item.status === 'Ready' ? '🟢 Ready' : '🟡 Received'}</td>
                                    <td className="p-2">
                                      {item.status === 'Received' && (
                                        <button onClick={() => markAsReady(item.id)} className="bg-indigo-500 text-white px-2 py-1 rounded text-xs">Ready</button>
                                      )}
                                      {item.status === 'Ready' && (
                                        <button onClick={() => markPickup(item.id)} className="bg-purple-500 text-white px-2 py-1 rounded text-xs">Pickup</button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-gray-700">💳 Pending Payments</h2>
                  <button
                    onClick={() => loadPendingPayments()}
                    className="text-indigo-500 text-sm hover:text-indigo-600"
                  >
                    🔄 Refresh
                  </button>
                </div>
                
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No pending payments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className={`p-4 rounded-lg border ${!payment.isRead ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{payment.userName}</p>
                            <p className="text-sm text-gray-500">Amount: ₹{payment.amount}</p>
                            <p className="text-sm text-gray-500">Date: {new Date(payment.date).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            {!payment.isRead && (
                              <button
                                onClick={() => markPaymentAsRead(payment.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                              >
                                Mark as Read
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPayment(payment)}
                              className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                            >
                              View Screenshot
                            </button>
                            <button
                              onClick={() => clearPayment(payment)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Clear Record
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Screenshot Modal */}
            {selectedPayment && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">📸 Payment Screenshot</h3>
                    <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium text-gray-800">{selectedPayment.userName}</p></div>
                    <div><p className="text-sm text-gray-500">Amount</p><p className="font-medium text-orange-600 text-lg">₹{selectedPayment.amount}</p></div>
                    <div><p className="text-sm text-gray-500 mb-2">Screenshot</p><img src={selectedPayment.screenshotData} alt="Payment Screenshot" className="w-full rounded-lg border max-h-64 object-contain bg-gray-50" /></div>
                    <div className="flex gap-2 pt-3 border-t">
                      <button onClick={() => setSelectedPayment(null)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition">Close</button>
                      <button onClick={() => { clearPayment(selectedPayment); setSelectedPayment(null); }} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">✅ Clear Record</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* APPROVALS TAB */}
            {activeTab === 'approvals' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-gray-700">✅ Pending Approvals</h2>
                  <button onClick={() => { loadCustomersFromDB(); loadApprovalsFromDB(); alert('Refreshed!'); }} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700">🔄 Refresh</button>
                </div>
                
                {approvals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No pending approvals</p>
                    <p className="text-sm text-gray-400 mt-2">New registrations will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {approvals.map((customer) => (
                      <div key={customer.id} className="p-4 bg-gray-50 rounded-lg border">
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">Registered: {new Date(customer.joinDate).toLocaleDateString()}</p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => approveCustomer(customer.id)} className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600">✅ Approve</button>
                          <button onClick={() => rejectCustomer(customer.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600">❌ Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVENUE TAB */}
            {activeTab === 'revenue' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <h2 className="text-xl font-medium text-gray-700 mb-4">💰 Revenue Summary</h2>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
                  <p className="text-gray-500 mb-2">Total Revenue</p>
                  <p className="text-4xl font-bold text-orange-600">₹{getTotalRevenue()}</p>
                  <p className="text-sm text-gray-400 mt-2">From {clearedPayments.length} transactions</p>
                </div>
                
                {clearedPayments.length === 0 ? (
                  <div className="text-center py-8"><p className="text-gray-400">No cleared payments yet</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-indigo-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm text-indigo-600">Date</th>
                          <th className="px-4 py-2 text-left text-sm text-indigo-600">Customer</th>
                          <th className="px-4 py-2 text-left text-sm text-indigo-600">Type</th>
                          <th className="px-4 py-2 text-right text-sm text-indigo-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clearedPayments.map((payment) => (
                          <tr key={payment.id} className="border-t border-indigo-50">
                            <td className="px-4 py-2 text-sm text-gray-600">{payment.date}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{payment.customerName}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{payment.type || 'ONLINE'}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-700 text-right">₹{payment.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-indigo-50 border-t border-indigo-100">
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right font-medium text-gray-700">Total:</td>
                          <td className="px-4 py-2 text-right font-bold text-orange-600">₹{getTotalRevenue()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}