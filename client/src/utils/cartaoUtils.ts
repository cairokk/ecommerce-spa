export function formatarNumeroCartao(valor: string): string {
    return valor
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

export function formatarValidade(valor: string): string {
    const numeric = valor.replace(/\D/g, '').slice(0, 4);
    if (numeric.length < 4) {
        return numeric.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }

    const mes = parseInt(numeric.slice(0, 2), 10);
    const ano = parseInt('20' + numeric.slice(2), 10);
    const now = new Date();
    const anoAtual = now.getFullYear();
    const mesAtual = now.getMonth() + 1;

    if (mes < 1 || mes > 12) return '';
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) return '';

    return `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
}

export function formatarCVV(valor: string): string {
    return valor.replace(/\D/g, '').slice(0, 4);
}

export function validadeCartaoValida(valor: string): boolean {
    const numeric = valor.replace(/\D/g, '').slice(0, 4);
    if (numeric.length < 4) return false;

    const mes = parseInt(numeric.slice(0, 2), 10);
    const ano = parseInt('20' + numeric.slice(2), 10);
    const now = new Date();
    const anoAtual = now.getFullYear();
    const mesAtual = now.getMonth() + 1;

    if (mes < 1 || mes > 12) return false;
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) return false;

    return true;
}

export function validarCartaoCompleto(cartao: {
    nomeTitular: string;
    numero: string;
    validade: string;
    cvv: string;
}): boolean {
    const numeroValido = cartao.numero.replace(/\s/g, '').length >= 13;
    const nomeValido = cartao.nomeTitular.trim().length > 0;
    const validadeValida = validadeCartaoValida(cartao.validade);
    const cvvValido = /^[0-9]{3,4}$/.test(cartao.cvv);

    return numeroValido && nomeValido && validadeValida && cvvValido;
}
