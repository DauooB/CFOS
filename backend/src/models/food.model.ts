export interface FoodItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFoodItemDTO {
  name: string;
  description?: string;
  price: number;
  category?: string;
  is_available?: boolean;
}
