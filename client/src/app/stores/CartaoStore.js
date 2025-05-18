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
    }))
)

export default useCartaoStore
