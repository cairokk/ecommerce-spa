export interface Product {
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    category: string;
    origin: string;
    intensity: 'Leve' | 'Médio' | 'Forte';
    beans: 'Arábica' | 'Robusta' | 'Blend';
}
