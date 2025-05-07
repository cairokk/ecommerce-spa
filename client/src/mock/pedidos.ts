// mocks/orders.ts
import { Pedido } from '../types/pedido';

export const pedidos: Pedido[] = [
  {
    id: '1',
    name: 'Capsulas Nespresso',
    status: 'Aguardando Pagamento',
    total: 2999.0,
    items: [
      { name: 'Kit Cápsulas Nespresso', quantity: 1, price: 2999.0 },
    ],
  },
  {
    id: '2',
    name: 'Café Orfeu Gourmet',
    status: 'Saiu para Entrega',
    total: 199.9,
    items: [
      { name: 'Orfeu Gourmet 250g', quantity: 2, price: 99.95 },
    ],
  },
];
