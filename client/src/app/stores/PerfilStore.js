import {create} from 'zustand';

const usePerfilStore = create((set) => ({
    perfil: null,
    setPerfil: (perfil) => set({perfil}),
    clearPerfil: () => set({perfil: null})
}));

export default usePerfilStore;