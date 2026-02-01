// Utility script to clean duplicate subscriptions
// Run this in browser console on localhost:3000

(() => {
  const STORAGE_KEY = 'hayahub_subscriptions';
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('No subscription data found');
      return;
    }
    
    const subscriptions = JSON.parse(data);
    console.log(`Found ${subscriptions.length} subscriptions`);
    
    // Remove duplicates by ID (keep the last one)
    const uniqueMap = new Map();
    subscriptions.forEach((sub) => {
      uniqueMap.set(sub.id, sub);
    });
    
    const cleaned = Array.from(uniqueMap.values());
    console.log(`After cleanup: ${cleaned.length} unique subscriptions`);
    console.log(`Removed ${subscriptions.length - cleaned.length} duplicates`);
    
    if (subscriptions.length !== cleaned.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      console.log('✅ Cleaned data saved. Please refresh the page.');
    } else {
      console.log('✅ No duplicates found. Data is clean.');
    }
  } catch (error) {
    console.error('Error cleaning subscriptions:', error);
  }
})();
