export enum MovementType {
    ENTRADA = 'entrada',
    SAIDA = 'saida',
    AJUSTE = 'ajuste'
}

export interface StockMovement {
    id: number;
    product_id: number;
    quantity: number; // positivo para entrada, negativo para saída
    movement_type: MovementType;
    created_at: Date;
}

export interface NewStockMovement {
    product_id: number;
    quantity: number;
    movement_type: MovementType;
} 