export const validarTelefone = (telefone: string) => {
    telefone = telefone.replace(/[^\d]+/g, ''); // Remove tudo que não for número
    const regex = /^(\d{2})(\d{4,5})(\d{4})$/;
    return regex.test(telefone);
};

export const formatarTelefone = (telefone: string) => {
    telefone = telefone.replace(/[^\d]+/g, ''); // Remove tudo que não for número
    if (telefone.length <= 2) {
        return `(${telefone}`;
    } else if (telefone.length <= 6) {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2)}`;
    } else {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7, 11)}`;
    }
};
