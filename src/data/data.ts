// Catálogo mockado. A tela NÃO digita especialidade: escolhe daqui.
// Sem JSX. Sem AsyncStorage. Só o dado inicial da clínica.

import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Usuario } from "../types/usuario";

export const ESPECIALIDADES: Especialidade[] = [
    { id: 1, nome: "Cardiologia", descricao: "Coração e vasos sanguíneos" },
    { id: 2, nome: "Dermatologia", descricao: "Pele, cabelo e unhas" },
    { id: 3, nome: "Pediatria", descricao: "Saúde de crianças e adolescentes" },
    { id: 4, nome: "Ortopedia", descricao: "Ossos, músculos e articulações" },
    { id: 5, nome: "Ginecologia", descricao: "Saúde da mulher" },
    { id: 6, nome: "Neurologia", descricao: "Cérebro, nervos e medula" },
    { id: 7, nome: "Oftalmologia", descricao: "Visão e saúde dos olhos" },
    { id: 8, nome: "Endocrinologia", descricao: "Hormônios e metabolismo" },
    { id: 9, nome: "Psiquiatria", descricao: "Saúde mental" },
    { id: 10, nome: "Clínica Geral", descricao: "Atendimento clínico de rotina" },
];

function especialidadePorId(id: number): Especialidade {
    const encontrada = ESPECIALIDADES.find((item) => item.id === id);
    if (!encontrada) {
        throw new Error(`Especialidade ${id} não existe no catálogo.`);
    }
    return encontrada;
}

export const MEDICOS: Medico[] = [
    { id: 1, nome: "Dra. Ana Souza", crm: "123456-SP", especialidade: especialidadePorId(1), ativo: true },
    { id: 2, nome: "Dr. Bruno Lima", crm: "234567-SP", especialidade: especialidadePorId(2), ativo: true },
    { id: 3, nome: "Dra. Carla Mendes", crm: "345678-SP", especialidade: especialidadePorId(3), ativo: true },
    { id: 4, nome: "Dr. Diego Alves", crm: "456789-SP", especialidade: especialidadePorId(4), ativo: true },
    { id: 5, nome: "Dra. Elena Castro", crm: "567890-SP", especialidade: especialidadePorId(5), ativo: true },
    { id: 6, nome: "Dr. Fabio Nunes", crm: "678901-SP", especialidade: especialidadePorId(6), ativo: true },
    { id: 7, nome: "Dra. Gabriela Dias", crm: "789012-SP", especialidade: especialidadePorId(7), ativo: true },
    { id: 8, nome: "Dr. Henrique Prado", crm: "890123-SP", especialidade: especialidadePorId(8), ativo: true },
    { id: 9, nome: "Dra. Isabel Freitas", crm: "901234-SP", especialidade: especialidadePorId(9), ativo: true },
    { id: 10, nome: "Dr. João Ribeiro", crm: "112233-SP", especialidade: especialidadePorId(10), ativo: true },
];

// Contas de laboratório para entrar sem cadastrar na hora da aula.
export const USUARIOS_DEMO: Usuario[] = [
    {
        id: 1,
        nome: "Maria Silva",
        email: "maria@email.com",
        senha: "1234",
        papel: "paciente",
        cpf: "123.456.789-00",
        telefone: "(11) 98765-4321",
    },
    {
        id: 2,
        nome: "Dra. Ana Souza",
        email: "ana@clinica.com",
        senha: "1234",
        papel: "medico",
        medicoId: 1,
    },
];