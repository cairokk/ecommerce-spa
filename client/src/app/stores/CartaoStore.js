import { create } from 'zustand'
import { devtools } from 'zustand/middleware';


function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  } else {
    // Fallback manual UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

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
                        id: generateUUID(),
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
