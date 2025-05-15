export interface Product {
    id: string;
    idFornecedor: number;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    category: string;
    origin: string;
    quantidade: number;
    intensity: 'Leve' | 'Médio' | 'Forte';
    beans: 'Arábica' | 'Robusta' | 'Blend';
}

export interface CartProduct extends Product {
    quantity: number;
}