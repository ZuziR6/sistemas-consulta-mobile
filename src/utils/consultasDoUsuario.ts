// Aula 01/10/2026
// Recorte da lista: paciente vê as próprias; médico vê a agenda;
// admin recebe o array inteiro.

import { Consulta } from "../interfaces/consulta";
import { Usuario } from "../types/usuario";

export function consultasDoUsuario(
    consultas: Consulta[],
    usuario: Usuario
): Consulta[] {
    if (usuario.papel === "admin") {
        return consultas;
    }

    if (usuario.papel === "paciente") {
        return consultas.filter(
            (consulta) => consulta.paciente.email === usuario.email
        );
    }

    return consultas.filter(
        (consulta) => consulta.medico.id === usuario.medicoId
    );
}