import { create } from 'zustand'

const useCartaoStore = create((set) => ({
    selecionado: null,
    selecionarCartao: (id) => set({ selecionado: id }),
    cartoes: [],
    adicionarCartao: (cartao) =>
        set((state) => ({
            cartoes: [
                ...state.cartoes,
                {
                    ...cartao,
                    id: crypto.randomUUID(),
                },
            ],
        })),
}))

export default useCartaoStore
