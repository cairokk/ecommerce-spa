import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const usePerfilStore = create(
  devtools((set, get) => ({
    perfil: null,
    setPerfil: (perfil) => set({ perfil }),
    clearPerfil: () => set({ perfil: null }),

    getIdFromToken: () => {
      const token = get().perfil?.token;
      if (!token) return null;

      try {
        const payload = decodeJwtPayload(token);
        return payload?.id || null;
      } catch (e) {
        console.error("Token inválido:", e);
        return null;
      }
    },
    getRoleFromToken: () => {
      const token = get().perfil?.token;
      if (!token) return null;

      try {
        const payload = decodeJwtPayload(token);
        return payload?.role || null;
      } catch (e) {
        console.error("Token inválido:", e);
        return null;
      }
    },
  }))
);

// Utilitário dentro do mesmo arquivo ou importado
function decodeJwtPayload(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

export default usePerfilStore;
