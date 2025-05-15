import {create} from 'zustand';

const useCarrinhoStore = create((set) => ({
    carrinho : {
        produtos: [],
        total: 0,
        quantidade: 0
    },
    setCarrinho: (carrinho) => set({carrinho}),
    addProduto: (produto) => set((state) => {
        const produtos = [...state.carrinho.produtos, produto];
        const total = produtos.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        const quantidade = produtos.reduce((acc, item) => acc + item.quantidade, 0);
        return {carrinho: {...state.carrinho, produtos, total, quantidade}};
    }),
    removeProduto: (id) => set((state) => {
        const produtos = state.carrinho.produtos.filter((produto) => produto.id !== id);
        const total = produtos.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        const quantidade = produtos.reduce((acc, item) => acc + item.quantidade, 0);
        return {carrinho: {...state.carrinho, produtos, total, quantidade}};
    }),
    clearCarrinho: () => set({carrinho: {produtos: [], total: 0, quantidade: 0}})
}));

export default useCarrinhoStore;
    