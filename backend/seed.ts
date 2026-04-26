import db from './src/config/db';

async function seed() {
  try {
    // 1. Create cart_items table
    console.log('Creating cart_items table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          item_id INTEGER REFERENCES food_items(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, item_id)
      );
    `);

    // 2. Add mock data to food_items
    console.log('Seeding food_items...');
    const products = [
      { name: 'Aloo Paratha', description: 'Fresh flatbread stuffed with spiced potatoes', price: 40, category: 'Breakfast', image: '/images/aloo_paratha_1776686202620.png' },
      { name: 'Noodles', description: 'Spicy stir-fried noodles with vegetables', price: 60, category: 'Snacks', image: '/images/noodles_1776686218976.png' },
      { name: 'Paneer Curry', description: 'Rich cottage cheese in aromatic gravy', price: 80, category: 'Lunch', image: '/images/paneer_curry_1776686238357.png' },
      { name: 'Coffee', description: 'Freshly brewed hot coffee', price: 20, category: 'Beverages', image: '/images/coffee.png' },
      { name: 'Tea', description: 'Hot masala chai with aromatic spices', price: 15, category: 'Beverages', image: '/images/tea.png' },
      { name: 'Curd', description: 'Fresh homemade yogurt', price: 25, category: 'Lunch', image: '/images/curd.png' },
      { name: 'Fried Rice', description: 'Flavorful rice with vegetables and spices', price: 70, category: 'Lunch', image: '/images/friedrice.png' },
      { name: 'Sandwich', description: 'Grilled vegetable sandwich with chutney', price: 50, category: 'Snacks', image: '/images/sandwhich.png' },
      { name: 'Pizza', description: 'Cheesy pizza with fresh toppings', price: 100, category: 'Snacks', image: '/images/pizza_1776686255931.png' },
      { name: 'Chips', description: 'Crispy golden fried potato chips', price: 30, category: 'Snacks', image: '/images/chips.png' }
    ];

    for (const p of products) {
      await db.query(`
        INSERT INTO food_items (name, description, price, category, image)
        VALUES ($1, $2, $3, $4, $5)
      `, [p.name, p.description, p.price, p.category, p.image]);
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
