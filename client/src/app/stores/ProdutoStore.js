import {create} from 'zustand';

const useProdutoStore = create((set) => ({
    produtos: [],
    setProdutos: (produtos) => set({ produtos }),
    addProduto: (produto) => set((state) => ({ produtos: [...state.produtos, produto] })),
    removeProduto: (id) => set((state) => ({ produtos: state.produtos.filter((produto) => produto.id !== id) })),
    clearProdutos: () => set({ produtos: [] }),
}));

export default useProdutoStore;