// Aula 24/09/2026
// Lê src/data/banco.json e monta os objetos tipados.
// Sem JSX. Sem AsyncStorage. O JSON é o catálogo inicial versionado no repositório.

import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Usuario } from "../types/usuario";
import banco from "./banco.json";

export const ESPECIALIDADES: Especialidade[] = banco.especialidades;

function especialidadePorId(id: number): Especialidade {
    const encontrada = ESPECIALIDADES.find((item) => item.id === id);
    if (!encontrada) {
        throw new Error(`Especialidade ${id} não existe no banco.json.`);
    }
    return encontrada;
}

export const MEDICOS: Medico[] = banco.medicos.map((item) => ({
    id: item.id,
    nome: item.nome,
    crm: item.crm,
    email: item.email,
    especialidade: especialidadePorId(item.especialidadeId),
    ativo: item.ativo,
}));

export const USUARIOS_DEMO: Usuario[] = banco.usuarios.map((item) => ({
    id: item.id,
    nome: item.nome,
    login: item.login,
    email: item.email,
    senha: item.senha,
    papel: item.papel as Usuario["papel"],
    medicoId: "medicoId" in item ? item.medicoId : undefined,
    cpf: "cpf" in item ? item.cpf : undefined,
    telefone: "telefone" in item ? item.telefone : undefined,
}));