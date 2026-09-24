// Aula 24/09/2026
// Janela da agenda: a partir de amanhã até no máximo 2 meses.

export function dataCivil(data: Date): Date {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function mesmaDataCivil(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function inicioJanelaAgenda(hoje = new Date()): Date {
    const base = dataCivil(hoje);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
}

export function fimJanelaAgenda(hoje = new Date()): Date {
    const base = dataCivil(hoje);
    return new Date(base.getFullYear(), base.getMonth() + 2, base.getDate());
}

export function formatarDataBR(data: Date): string {
    return data.toLocaleDateString("pt-BR");
}

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

export function validarDataAgenda(data: Date, hoje = new Date()): string | null {
    const escolhida = dataCivil(data);
    const inicio = inicioJanelaAgenda(hoje);
    const fim = fimJanelaAgenda(hoje);

    if (escolhida.getTime() < inicio.getTime()) {
        return "Não é possível agendar para hoje nem para uma data passada.";
    }

    if (escolhida.getTime() > fim.getTime()) {
        return "A agenda abre no máximo 2 meses à frente.";
    }

    return null;
}

export function dataEstaNaJanela(data: Date, hoje = new Date()): boolean {
    return validarDataAgenda(data, hoje) === null;
}

export function mesesDaJanela(hoje = new Date()): Date[] {
    const inicio = inicioJanelaAgenda(hoje);
    const fim = fimJanelaAgenda(hoje);
    const meses: Date[] = [];
    let cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);

    while (
        cursor.getFullYear() < fim.getFullYear() ||
        (cursor.getFullYear() === fim.getFullYear() && cursor.getMonth() <= fim.getMonth())
    ) {
        meses.push(new Date(cursor));
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    return meses;
}