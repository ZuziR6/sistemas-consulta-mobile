import { Especialidade } from "../types/especialidade";

export interface Medico {
    id: number;
    nome: string;
    crm: string;
    email: string;
    especialidade: Especialidade;
    ativo: boolean;
}