// Recorte da lista: paciente vê as próprias; médico vê a agenda dele.

import { Consulta } from "../interfaces/consulta";
import { Usuario } from "../types/usuario";

export function consultasDoUsuario(
    consultas: Consulta[],
    usuario: Usuario
): Consulta[] {
    if (usuario.papel === "paciente") {
        return consultas.filter(
            (consulta) => consulta.paciente.email === usuario.email
        );
    }

    return consultas.filter(
        (consulta) => consulta.medico.id === usuario.medicoId
    );
}