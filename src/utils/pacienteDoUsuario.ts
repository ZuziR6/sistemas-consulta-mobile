// Aula 01/10/2026
// Paciente não tem chave própria no storage. Sai do Usuario.

import { Paciente } from "../types/paciente";
import { Usuario } from "../types/usuario";

export function pacienteDoUsuario(usuario: Usuario): Paciente {
    return {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf ?? "não informado",
        email: usuario.email,
        telefone: usuario.telefone,
    };
}