// Saiu do Admin.tsx: parsear data é regra pura, não precisa de tela.

export function parsearDataBR(texto: string): Date | null {
    const partes = texto.trim().split("/");
    if (partes.length !== 3) {
        return null;
    }

    const [diaTexto, mesTexto, anoTexto] = partes;
    const dia = Number(diaTexto);
    const mes = Number(mesTexto);
    const ano = Number(anoTexto);
    const data = new Date(ano, mes - 1, dia);

    if (Number.isNaN(data.getTime())) {
        return null;
    }

    if (data.getDate() !== dia || data.getMonth() !== mes - 1 || data.getFullYear() !== ano) {
        return null;
    }

    return data;
}