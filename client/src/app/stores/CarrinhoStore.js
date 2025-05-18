
import { create } from 'zustand';

const useCarrinhoStore = create((set) => ({
    carrinho: {
        produtos: [],
        total: 0,
        quantidade: 0
    },
    isCartOpen: false,
    setIsCartOpen: (valor) => set({ isCartOpen: valor }),
    setCarrinho: (carrinho) => set({ carrinho }),

    addProduto: (produto) => set((state) => {
        const produtos = [...state.carrinho.produtos, { ...produto, quantidade: 1 }];
        const total = produtos.reduce((acc, item) => acc + item.discountedPrice * item.quantidade, 0);
        const quantidade = produtos.reduce((acc, item) => acc + item.quantidade, 0);
        return { carrinho: { ...state.carrinho, produtos, total, quantidade } };
    }),

    addProdutoFiltrado: (novoProduto) => set((state) => {
        const produtos = [...state.carrinho.produtos];
        const index = produtos.findIndex((p) => p.id === novoProduto.id);

        if (index !== -1) {
            const atual = produtos[index];
            const novaQuantidade = atual.quantidade + 1;

            if (novaQuantidade <= atual.estoque) {
                produtos[index] = {
                    ...atual,
                    quantidade: novaQuantidade,
                };
            }
        } else {
            produtos.push({
                ...novoProduto,
                quantidade: 1,
                estoque: novoProduto.quantidade,
            });
        }

        const total = produtos.reduce((acc, item) => acc + item.discountedPrice * item.quantidade, 0);
        const quantidade = produtos.reduce((acc, item) => acc + item.quantidade, 0);

        return {
            carrinho: {
                ...state.carrinho,
                produtos,
                total,
                quantidade,
            },
        };
    }),
    diminuirQuantidade: (id) => set((state) => {
        let produtos = state.carrinho.produtos.map((produto) =>
            produto.id === id ? { ...produto, quantidade: produto.quantidade - 1 } : produto
        ).filter((produto) => produto.quantidade > 0);

        const total = produtos.reduce((acc, item) => acc + item.discountedPrice * item.quantidade, 0);
        const quantidade = produtos.reduce((acc, item) => acc + item.quantidade, 0);
        return {
            carrinho: {
                ...state.carrinho,
                produtos,
                total,
                quantidade,
            },
        };
    }),

    removeProduto: (id) => set((state) => {
        const produtos = state.carrinho.produtos.filter((produto) => produto.id !== id);
        const total = produtos.reduce((acc, item) => acc + item.discountedPrice * item.quantidade, 0);
        const quantidade = produtos.reduce((acc, item) => acc + item.quantidade, 0);
        return { carrinho: { ...state.carrinho, produtos, total, quantidade } };
    }),

    clearCarrinho: () => set({ carrinho: { produtos: [], total: 0, quantidade: 0 } })
}));

export default useCarrinhoStore;
