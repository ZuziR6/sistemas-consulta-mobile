// Aula 17/09/2026
// Persistência local: usuários, sessão e o catálogo mockado.
// Sem JSX: recebe dado, grava string; lê string, devolve dado.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ESPECIALIDADES, MEDICOS, USUARIOS_DEMO } from "../data/data";
import { Consulta } from "../interfaces/consulta";
import { Medico } from "../interfaces/medico";
import { Especialidade } from "../types/especialidade";
import { Usuario } from "../types/usuario";

const KEYS = {
    VERSAO: "@consultas:versao",
    ESPECIALIDADES: "@consultas:especialidades",
    MEDICOS: "@consultas:medicos",
    CONSULTAS: "@consultas:consultas",
    USUARIOS: "@consultas:usuarios",
    SESSAO: "@consultas:sessao",
};

const VERSAO_CATALOGO = "2";

export async function salvarEspecialidades(especialidades: Especialidade[]) {
    try {
        await AsyncStorage.setItem(
            KEYS.ESPECIALIDADES,
            JSON.stringify(especialidades)
        );
    } catch (erro) {
        console.error("Erro ao salvar especialidades:", erro);
    }
}

export async function obterEspecialidades(): Promise<Especialidade[]> {
    try {
        const dados = await AsyncStorage.getItem(KEYS.ESPECIALIDADES);
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao obter especialidades:", erro);
        return [];
    }
}

export async function salvarMedicos(medicos: Medico[]) {
    try {
        await AsyncStorage.setItem(KEYS.MEDICOS, JSON.stringify(medicos));
    } catch (erro) {
        console.error("Erro ao salvar médicos:", erro);
    }
}

export async function obterMedicos(): Promise<Medico[]> {
    try {
        const dados = await AsyncStorage.getItem(KEYS.MEDICOS);
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao obter médicos:", erro);
        return [];
    }
}

export async function salvarConsultas(consultas: Consulta[]) {
    try {
        await AsyncStorage.setItem(KEYS.CONSULTAS, JSON.stringify(consultas));
    } catch (erro) {
        console.error("Erro ao salvar consultas:", erro);
    }
}

export async function obterConsultas(): Promise<Consulta[]> {
    try {
        const dados = await AsyncStorage.getItem(KEYS.CONSULTAS);
        if (dados) {
            const consultas = JSON.parse(dados);
            return consultas.map((consulta: Consulta) => ({
                ...consulta,
                data: new Date(consulta.data),
            }));
        }
        return [];
    } catch (erro) {
        console.error("Erro ao obter consultas:", erro);
        return [];
    }
}

export async function salvarUsuarios(usuarios: Usuario[]) {
    try {
        await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
    } catch (erro) {
        console.error("Erro ao salvar usuários:", erro);
    }
}

export async function obterUsuarios(): Promise<Usuario[]> {
    try {
        const dados = await AsyncStorage.getItem(KEYS.USUARIOS);
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao obter usuários:", erro);
        return [];
    }
}

export async function salvarSessao(usuario: Usuario) {
    try {
        await AsyncStorage.setItem(KEYS.SESSAO, JSON.stringify(usuario));
    } catch (erro) {
        console.error("Erro ao salvar sessão:", erro);
    }
}

export async function obterSessao(): Promise<Usuario | null> {
    try {
        const dados = await AsyncStorage.getItem(KEYS.SESSAO);
        return dados ? JSON.parse(dados) : null;
    } catch (erro) {
        console.error("Erro ao obter sessão:", erro);
        return null;
    }
}

export async function limparSessao() {
    try {
        await AsyncStorage.removeItem(KEYS.SESSAO);
    } catch (erro) {
        console.error("Erro ao limpar sessão:", erro);
    }
}

function emailPacienteDemo(email: string): string {
    return email === "maria@clinica.com" ? "maria@email.com" : email;
}

export async function semearDadosIniciais() {
    try {
        const versao = await AsyncStorage.getItem(KEYS.VERSAO);

        if (versao !== VERSAO_CATALOGO) {
            await salvarEspecialidades(ESPECIALIDADES);
            await salvarMedicos(MEDICOS);
            await AsyncStorage.setItem(KEYS.VERSAO, VERSAO_CATALOGO);
        }

        const usuarios = await obterUsuarios();
        if (usuarios.length === 0) {
            await salvarUsuarios(USUARIOS_DEMO);
        } else if (usuarios.some((usuario) => usuario.email === "maria@clinica.com")) {
            await salvarUsuarios(
                usuarios.map((usuario) => ({
                    ...usuario,
                    email: emailPacienteDemo(usuario.email),
                }))
            );
        }

        const sessao = await obterSessao();
        if (sessao && sessao.email === "maria@clinica.com") {
            await salvarSessao({ ...sessao, email: "maria@email.com" });
        }

        const consultas = await obterConsultas();
        if (consultas.some((consulta) => consulta.paciente.email === "maria@clinica.com")) {
            await salvarConsultas(
                consultas.map((consulta) => ({
                    ...consulta,
                    paciente: {
                        ...consulta.paciente,
                        email: emailPacienteDemo(consulta.paciente.email),
                    },
                }))
            );
        }
    } catch (erro) {
        console.error("Erro ao semear dados iniciais:", erro);
    }
}