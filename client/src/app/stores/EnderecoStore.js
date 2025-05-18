import { create } from 'zustand'

const useEnderecoStore = create((set) => ({
    enderecos: [],
    selecionadoEndereco: null,
    adicionarEndereco: (novo) => set((state) => {
        const novoComId = { ...novo, id: Date.now().toString() }
        return {
            enderecos: [...state.enderecos, novoComId],
            selecionadoEndereco: novoComId.id
        }
    }),
    selecionarEndereco: (id) => set({ selecionadoEndereco: id }),
    removerEndereco: (id) => set((state) => {
        const novaLista = state.enderecos.filter((e) => e.id !== id)
        const novoSelecionado = state.selecionadoEndereco === id ? null : state.selecionadoEndereco
        return {
            enderecos: novaLista,
            selecionadoEndereco: novoSelecionado
        }
    }),
    clearEnderecos: () => set({ enderecos: [], selecionadoEndereco: null })
}))

export default useEnderecoStore
