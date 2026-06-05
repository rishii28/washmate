const calculatePendingCount = () => {
  // Count items that are NOT picked up AND NOT cleared
  let count = 0
  for (let i = 0; i < laundryItems.length; i++) {
    const item = laundryItems[i]
    if (item.pickupStatus !== 'Picked Up' && item.status !== 'Cleared' && item.status !== 'Completed') {
      count++
    }
  }
  return count
}