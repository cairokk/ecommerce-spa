
export interface Pedido {
    id: string;
    name: string;
    status: 'Feito' | 'Aguardando Pagamento' | 'Saiu para Entrega';
    total: number;
    items: { name: string; quantity: number; price: number }[];
}
