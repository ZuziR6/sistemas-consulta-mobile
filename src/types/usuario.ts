// Quem entra no app. Gravado em @consultas:usuarios e em @consultas:sessao.

import { Papel } from "./papel";

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    senha: string;
    papel: Papel;
    medicoId?: number;
    cpf?: string;
    telefone?: string;
};