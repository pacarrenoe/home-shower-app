// scripts/seedItems.js

const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const items = [
  // ======================
  // COCINA
  // ======================
  {
    name: 'Air Fryer Digital',
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_614545-MLA93968602747_102025-R.webp',
    description: 'Ideal para cocinar más rápido',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Falabella', price: 70000, url: 'https://www.falabella.com' },
      { id: '2', store: 'MercadoLibre', price: 65000, url: 'https://www.mercadolibre.cl' },
    ],
  },
  {
    name: 'Licuadora Oster',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    description: 'Potente y resistente',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Paris', price: 45000, url: 'https://www.paris.cl' },
      { id: '2', store: 'Ripley', price: 42000, url: 'https://www.ripley.cl' },
    ],
  },
  {
    name: 'Set de Ollas 7 piezas',
    image: 'https://images.unsplash.com/photo-1604908177522-402c8b5a8b1e',
    description: 'Acero inoxidable',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Falabella', price: 120000, url: 'https://www.falabella.com' },
      { id: '2', store: 'Easy', price: 110000, url: 'https://www.easy.cl' },
    ],
  },

  // ======================
  // DORMITORIO
  // ======================
  {
    name: 'Sábanas 800 Hilos',
    image: 'https://images.unsplash.com/photo-1582582494700-29b63e0d3b36',
    description: 'Alta calidad',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Falabella', price: 92000, url: 'https://www.falabella.com' },
      { id: '2', store: 'Amazon', price: 85000, url: 'https://www.amazon.com' },
    ],
  },
  {
    name: 'Plumón King',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    description: 'Abrigo para invierno',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Paris', price: 80000, url: 'https://www.paris.cl' },
      { id: '2', store: 'Ripley', price: 75000, url: 'https://www.ripley.cl' },
    ],
  },

  // ======================
  // BAÑO
  // ======================
  {
    name: 'Juego de Toallas Premium',
    image: 'https://images.unsplash.com/photo-1581579185169-9c3a7cdd5a8d',
    description: 'Algodón 100%',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Falabella', price: 35000, url: 'https://www.falabella.com' },
      { id: '2', store: 'Ikea', price: 30000, url: 'https://www.ikea.com' },
    ],
  },

  // ======================
  // HOGAR / DECORACIÓN
  // ======================
  {
    name: 'Lámpara de Pie',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d1d',
    description: 'Estilo moderno',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Ikea', price: 40000, url: 'https://www.ikea.com' },
      { id: '2', store: 'Sodimac', price: 38000, url: 'https://www.sodimac.cl' },
    ],
  },
  {
    name: 'Alfombra Living',
    image: 'https://images.unsplash.com/photo-1598300053653-2d4b6c4d1c8f',
    description: '2x3 metros',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Easy', price: 90000, url: 'https://www.easy.cl' },
      { id: '2', store: 'Ikea', price: 85000, url: 'https://www.ikea.com' },
    ],
  },

  // ======================
  // TECNOLOGÍA
  // ======================
  {
    name: 'Smart TV 55"',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6',
    description: '4K UHD',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'Ripley', price: 450000, url: 'https://www.ripley.cl' },
      { id: '2', store: 'Falabella', price: 430000, url: 'https://www.falabella.com' },
    ],
  },
  {
    name: 'Parlante Bluetooth',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
    description: 'Portátil',
    status: 'wanted',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    options: [
      { id: '1', store: 'MercadoLibre', price: 50000, url: 'https://www.mercadolibre.cl' },
      { id: '2', store: 'Paris', price: 48000, url: 'https://www.paris.cl' },
    ],
  },

  // ======================
  // YA TENIDO
  // ======================
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