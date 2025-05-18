export function formatarNumeroCartao(valor: string): string {
    return valor
        .replace(/\D/g, '') 
        .replace(/(.{4})/g, '$1 ') 
        .trim();
}

export function formatarValidade(valor: string): string {
    return valor
        .replace(/\D/g, '') 
        .replace(/(\d{2})(\d{0,2})/, '$1/$2') 
        .substring(0, 5); 
}

export function formatarCVV(valor: string): string {
    return valor.replace(/\D/g, '').slice(0, 4); 
}
