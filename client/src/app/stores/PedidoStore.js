import {create} from 'zustand';

const usePedidoStore = create((set) => ({
    pedidos: [],
    setPedidos: (pedidos) => set({pedidos}),
    addPedido: (pedido) => set((state) => ({pedidos: [...state.pedidos, pedido]}))
}));

export default usePedidoStore;
