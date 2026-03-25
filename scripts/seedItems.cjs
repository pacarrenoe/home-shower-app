// scripts/seedItems.js

const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const items = [
  {
    name: 'Air Fryer Digital',
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_614545-MLA93968602747_102025-R.webp',
    description: 'Ideal para cocinar más rápido',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      {
        id: '1',
        store: 'Falabella',
        price: 70000,
        url: 'https://www.falabella.com',
      },
      {
        id: '2',
        store: 'Ikea',
        price: 60000,
        url: 'https://www.ikea.com',
      },
    ],
  },
  {
    name: 'Sábanas 800 Hilos',
    image: 'https://images.unsplash.com/photo-1582582494700-29b63e0d3b36',
    description: 'Alta calidad',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      {
        id: '1',
        store: 'Falabella',
        price: 92000,
        url: 'https://www.falabella.com',
      },
      {
        id: '2',
        store: 'Amazon',
        price: 85000,
        url: 'https://www.amazon.com',
      },
    ],
  },
  {
    name: 'Cafetera Nespresso',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
    description: '',
    status: 'owned',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [],
  },
]

const seed = async () => {
  try {
    for (const item of items) {
      await db.collection('items').add(item)
    }

    console.log('✅ Items creados correctamente')
    process.exit()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seed()