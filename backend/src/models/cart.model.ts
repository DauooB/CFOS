export interface CartItem {
    id: number;
    user_id: number;
    item_id: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

export interface AddToCartDTO {
    item_id: number;
    quantity?: number;
}
