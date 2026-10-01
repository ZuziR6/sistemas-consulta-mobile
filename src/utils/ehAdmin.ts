// Aula 01/10/2026
// Recorte de autorização. A Raiz usa isto para escolher a pilha.

import { Usuario } from "../types/usuario";

export function ehAdmin(usuario: Usuario): boolean {
    return usuario.papel === "admin";
}