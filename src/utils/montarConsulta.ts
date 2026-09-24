// Aula 24/09/2026
// Monta o objeto Consulta a partir do formulário já validado.
// TypeScript confere se o retorno casa com a interface Consulta.

import { Consulta } from "../interfaces/consulta";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { Usuario } from "../types/usuario";

export function montarPacienteDaSessao(usuario: Usuario): Paciente {
    const paciente: Paciente = {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf ?? "não informado",
        email: usuario.email,
        telefone: usuario.telefone,
    };
    return paciente;
}

export function montarConsulta(entrada: {
    medico: Medico;
    usuario: Usuario;
    data: Date;
}): Consulta {
    const consulta: Consulta = {
        id: Date.now(),
        medico: entrada.medico,
        paciente: montarPacienteDaSessao(entrada.usuario),
        data: entrada.data,
        valor: 350,
        status: "agendada",
        observacoes: `Agendada pelo app (${entrada.medico.especialidade.nome})`,
    };
    return consulta;
}