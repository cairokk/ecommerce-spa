import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


const useProdutoStore = create(
    devtools((set) => ({
        produtos: [],
        setProdutos: (produtos) => set({ produtos }),
        addProduto: (produto) => set((state) => ({ produtos: [...state.produtos, produto] })),
        removeProduto: (id) => set((state) => ({ produtos: state.produtos.filter((produto) => produto.id !== id) })),
        clearProdutos: () => set({ produtos: [] }),
    })));

export default useProdutoStore;