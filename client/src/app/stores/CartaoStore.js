import { create } from 'zustand'
import { devtools } from 'zustand/middleware';


const useCartaoStore = create(
    devtools((set) => ({
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
        removerCartao: (id) =>
        set((state) => {
            const novosCartoes = state.cartoes.filter((c) => c.id !== id)
            const novoSelecionado = state.selecionado === id ? null : state.selecionado
            return {
                cartoes: novosCartoes,
                selecionado: novosCartoes.some(c => c.id === novoSelecionado) ? novoSelecionado : null,
            }
        }),
}))
)

export default useCartaoStore
