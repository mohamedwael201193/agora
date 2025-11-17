// Script to import Conway wallet into browser IndexedDB
// Run this in browser console

const conwayWallet = {
  chainId: 'a5cae6d03adc2cd50fcf007b89562c27ce70fda6e8dfe44e3820f0a605f3be13',
  publicKey: 'your-public-key-here', // You can get this from linera wallet show
  balance: '100000000', // 100 tokens (in smallest unit)
  network: 'conway',
  createdAt: Date.now()
};

// Open IndexedDB
const request = indexedDB.open('linera-wallet', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('wallets')) {
    db.createObjectStore('wallets', { keyPath: 'chainId' });
  }
};

request.onsuccess = function(event) {
  const db = event.target.result;
  const transaction = db.transaction(['wallets'], 'readwrite');
  const store = transaction.objectStore('wallets');
  
  store.put(conwayWallet);
  
  transaction.oncomplete = function() {
    console.log('✅ Conway wallet imported! Refresh the page.');
  };
};

request.onerror = function() {
  console.error('❌ Failed to open IndexedDB');
};
