// Aula 24/09/2026
// Login aceita email ou nome de usuário. Senha continua igual.

import { Usuario } from "../types/usuario";

export function encontrarUsuario(
    usuarios: Usuario[],
    identificador: string,
    senha: string
): Usuario | undefined {
    const termo = identificador.trim().toLowerCase();

    return usuarios.find((usuario) => {
        const mesmoLogin = (usuario.login ?? "").toLowerCase() === termo;
        const mesmoEmail = usuario.email.toLowerCase() === termo;
        return usuario.senha === senha && (mesmoLogin || mesmoEmail);
    });
}