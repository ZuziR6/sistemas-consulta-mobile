// Aula 01/10/2026
// A consulta guarda cópia de médico e paciente. Se o catálogo muda,
// estas funções atualizam a cópia embarcada nas consultas.

import { Consulta } from "../interfaces/consulta";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { StatusConsulta } from "../types/statusConsulta";

export function sincronizarPacienteNasConsultas(
    consultas: Consulta[],
    paciente: Paciente
): Consulta[] {
    return consultas.map((consulta) =>
        consulta.paciente.id === paciente.id
            ? { ...consulta, paciente }
            : consulta
    );
}

export function sincronizarMedicoNasConsultas(
    consultas: Consulta[],
    medico: Medico
): Consulta[] {
    return consultas.map((consulta) =>
        consulta.medico.id === medico.id ? { ...consulta, medico } : consulta
    );
}

export function atualizarStatusConsulta(
    consultas: Consulta[],
    consultaId: number,
    status: StatusConsulta
): Consulta[] {
    return consultas.map((consulta) =>
        consulta.id === consultaId ? { ...consulta, status } : consulta
    );
}

export function atualizarConsulta(
    consultas: Consulta[],
    consultaId: number,
    campos: {
        data?: Date;
        observacoes?: string;
        status?: StatusConsulta;
    }
): Consulta[] {
    return consultas.map((consulta) =>
        consulta.id === consultaId ? { ...consulta, ...campos } : consulta
    );
}