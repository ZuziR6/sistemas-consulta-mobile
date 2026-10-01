// Aula 01/10/2026
// Contadores do dashboard. Não grava storage. Só lê arrays já carregados.

import { Consulta } from "../interfaces/consulta";
import { Medico } from "../interfaces/medico";
import { Usuario } from "../types/usuario";

export type PainelClinica = {
    medicos: number;
    pacientes: number;
    consultasAgendadas: number;
    consultasConfirmadas: number;
    consultasCanceladas: number;
    consultasTotal: number;
};

export function montarPainel(entrada: {
    usuarios: Usuario[];
    medicos: Medico[];
    consultas: Consulta[];
}): PainelClinica {
    const pacientes = entrada.usuarios.filter(
        (usuario) => usuario.papel === "paciente"
    ).length;

    const consultasAgendadas = entrada.consultas.filter(
        (consulta) => consulta.status === "agendada"
    ).length;

    const consultasConfirmadas = entrada.consultas.filter(
        (consulta) => consulta.status === "confirmada"
    ).length;

    const consultasCanceladas = entrada.consultas.filter(
        (consulta) => consulta.status === "cancelada"
    ).length;

    return {
        medicos: entrada.medicos.length,
        pacientes,
        consultasAgendadas,
        consultasConfirmadas,
        consultasCanceladas,
        consultasTotal: entrada.consultas.length,
    };
}