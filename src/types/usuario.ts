// Aula 24/09/2026
// Conta de acesso. login é o nome de usuário. email continua obrigatório.

import { Papel } from "./papel";

export type Usuario = {
    id: number;
    nome: string;
    login: string;
    email: string;
    senha: string;
    papel: Papel;
    medicoId?: number;
    cpf?: string;
    telefone?: string;
};