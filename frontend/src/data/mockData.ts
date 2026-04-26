export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  is_available?: boolean;
}

export const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

export const products: Product[] = [
  {
    id: '1',
    name: 'Aloo Paratha',
    description: 'Fresh flatbread stuffed with spiced potatoes',
    price: 40,
    category: 'Breakfast',
    image: '/images/aloo_paratha_1776686202620.png'
  },
  {
    id: '2',
    name: 'Noodles',
    description: 'Spicy stir-fried noodles with vegetables',
    price: 60,
    category: 'Snacks',
    image: '/images/noodles_1776686218976.png'
  },
  {
    id: '3',
    name: 'Paneer Curry',
    description: 'Rich cottage cheese in aromatic gravy',
    price: 80,
    category: 'Lunch',
    image: '/images/paneer_curry_1776686238357.png'
  },
  {
    id: '4',
    name: 'Coffee',
    description: 'Freshly brewed hot coffee',
    price: 20,
    category: 'Beverages',
    image: '/images/coffee.png'
  },
  {
    id: '5',
    name: 'Tea',
    description: 'Hot masala chai with aromatic spices',
    price: 15,
    category: 'Beverages',
    image: '/images/tea.png'
  },
  {
    id: '6',
    name: 'Curd',
    description: 'Fresh homemade yogurt',
    price: 25,
    category: 'Lunch',
    image: '/images/curd.png'
  },
  {
    id: '7',
    name: 'Fried Rice',
    description: 'Flavorful rice with vegetables and spices',
    price: 70,
    category: 'Lunch',
    image: '/images/friedrice.png'
  },
  {
    id: '8',
    name: 'Sandwich',
    description: 'Grilled vegetable sandwich with chutney',
    price: 50,
    category: 'Snacks',
    image: '/images/sandwhich.png'
  },
  {
    id: '9',
    name: 'Pizza',
    description: 'Cheesy pizza with fresh toppings',
    price: 100,
    category: 'Snacks',
    image: '/images/pizza_1776686255931.png'
  },
  {
    id: '10',
    name: 'Chips',
    description: 'Crispy golden fried potato chips',
    price: 30,
    category: 'Snacks',
    image: '/images/chips.png'
  }
];
