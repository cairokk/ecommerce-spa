import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


const usePedidoStore = create(
    devtools((set) => ({
        pedidos: [],
        setPedidos: (pedidos) => set({ pedidos }),
        addPedido: (pedido) => set((state) => ({ pedidos: [...state.pedidos, pedido] }))
    })));

export default usePedidoStore;  
