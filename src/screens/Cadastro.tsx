// Aula 24/09/2026
// Cadastro com login, email e, no médico, email gravado também no objeto Medico.

import React, { useEffect, useState } from "react";
import {
    Button,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ListaSelecao } from "../components";
import { Papel } from "../types/papel";
import { Usuario } from "../types/usuario";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import {
    obterEspecialidades,
    obterMedicos,
    obterUsuarios,
    salvarMedicos,
    salvarUsuarios,
} from "../services/storage";
import { styles } from "../styles/auth.styles";

type CadastroProps = {
    onEntrou: (usuario: Usuario) => void;
    onIrLogin: () => void;
};

type ErrosCadastro = {
    nome?: string;
    login?: string;
    email?: string;
    senha?: string;
    crm?: string;
    especialidade?: string;
};

export default function Cadastro({ onEntrou, onIrLogin }: CadastroProps) {
    const [nome, setNome] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [papel, setPapel] = useState<Papel>("paciente");
    const [crm, setCrm] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [especialidadeId, setEspecialidadeId] = useState<number | null>(null);
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [erros, setErros] = useState<ErrosCadastro>({});

    useEffect(() => {
        async function carregar() {
            const lista = await obterEspecialidades();
            setEspecialidades(lista);
        }
        carregar();
    }, []);

    async function cadastrar() {
        const nomeLimpo = nome.trim();
        const loginLimpo = login.trim().toLowerCase();
        const emailLimpo = email.trim().toLowerCase();
        const proximos: ErrosCadastro = {};

        if (!nomeLimpo) {
            proximos.nome = "Informe o nome.";
        }
        if (!loginLimpo) {
            proximos.login = "Informe um nome de usuário.";
        }
        if (!emailLimpo) {
            proximos.email = "Informe o email.";
        }
        if (!senha) {
            proximos.senha = "Informe a senha.";
        }
        if (papel === "medico" && !crm.trim()) {
            proximos.crm = "Informe o CRM.";
        }
        if (papel === "medico" && !especialidadeId) {
            proximos.especialidade = "Escolha uma especialidade da lista.";
        }

        const usuarios = await obterUsuarios();
        const loginJaExiste = usuarios.some(
            (usuario) => (usuario.login ?? "").toLowerCase() === loginLimpo
        );
        const emailJaExiste = usuarios.some((usuario) => usuario.email === emailLimpo);

        if (loginLimpo && loginJaExiste) {
            proximos.login = "Este nome de usuário já está em uso.";
        }
        if (emailLimpo && emailJaExiste) {
            proximos.email = "Este email já está cadastrado.";
        }

        setErros(proximos);
        if (Object.keys(proximos).length > 0) {
            return;
        }

        let medicoId: number | undefined;

        if (papel === "medico") {
            const especialidade = especialidades.find((item) => item.id === especialidadeId);
            if (!especialidade) {
                setErros({ especialidade: "Escolha uma especialidade da lista." });
                return;
            }

            const medicos = await obterMedicos();
            const novoMedico: Medico = {
                id: Date.now(),
                nome: nomeLimpo,
                crm: crm.trim(),
                email: emailLimpo,
                especialidade,
                ativo: true,
            };
            await salvarMedicos([...medicos, novoMedico]);
            medicoId = novoMedico.id;
        }

        const novoUsuario: Usuario = {
            id: Date.now(),
            nome: nomeLimpo,
            login: loginLimpo,
            email: emailLimpo,
            senha,
            papel,
            medicoId,
            cpf: papel === "paciente" ? cpf.trim() || "não informado" : undefined,
            telefone: papel === "paciente" ? telefone.trim() || undefined : undefined,
        };

        await salvarUsuarios([...usuarios, novoUsuario]);
        onEntrou(novoUsuario);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.cartao}>
                    <Text style={styles.titulo}>Cadastrar</Text>
                    <Text style={styles.texto}>
                        Paciente usa email pessoal (@email.com). Médico usa email da clínica e esse email também entra no objeto Medico.
                    </Text>

                    <Text style={styles.rotulo}>Quem está se cadastrando?</Text>
                    <View style={styles.linhaPapeis}>
                        <Pressable
                            style={[styles.papel, papel === "paciente" && styles.papelAtivo]}
                            onPress={() => setPapel("paciente")}
                        >
                            <Text style={styles.papelTexto}>Paciente</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.papel, papel === "medico" && styles.papelAtivo]}
                            onPress={() => setPapel("medico")}
                        >
                            <Text style={styles.papelTexto}>Médico</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.rotulo}>Nome</Text>
                    <TextInput
                        style={[styles.input, erros.nome && styles.inputErro]}
                        placeholder="Nome completo"
                        value={nome}
                        onChangeText={setNome}
                    />
                    {erros.nome ? <Text style={styles.textoErro}>{erros.nome}</Text> : null}

                    <Text style={styles.rotulo}>Usuário</Text>
                    <TextInput
                        style={[styles.input, erros.login && styles.inputErro]}
                        placeholder="Nome de usuário para o login"
                        autoCapitalize="none"
                        value={login}
                        onChangeText={setLogin}
                    />
                    {erros.login ? <Text style={styles.textoErro}>{erros.login}</Text> : null}

                    <Text style={styles.rotulo}>Email</Text>
                    <TextInput
                        style={[styles.input, erros.email && styles.inputErro]}
                        placeholder={papel === "medico" ? "nome@clinica.com" : "nome@email.com"}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {erros.email ? <Text style={styles.textoErro}>{erros.email}</Text> : null}

                    <Text style={styles.rotulo}>Senha</Text>
                    <TextInput
                        style={[styles.input, erros.senha && styles.inputErro]}
                        placeholder="Senha"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />
                    {erros.senha ? <Text style={styles.textoErro}>{erros.senha}</Text> : null}

                    {papel === "paciente" ? (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="CPF (opcional)"
                                value={cpf}
                                onChangeText={setCpf}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Telefone (opcional)"
                                value={telefone}
                                onChangeText={setTelefone}
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.rotulo}>CRM</Text>
                            <TextInput
                                style={[styles.input, erros.crm && styles.inputErro]}
                                placeholder="CRM"
                                value={crm}
                                onChangeText={setCrm}
                            />
                            {erros.crm ? <Text style={styles.textoErro}>{erros.crm}</Text> : null}
                            <Text style={styles.rotulo}>Especialidade (escolha, não digite)</Text>
                            <ListaSelecao
                                itens={especialidades.map((item) => ({
                                    id: item.id,
                                    titulo: item.nome,
                                    subtitulo: item.descricao,
                                }))}
                                selecionadoId={especialidadeId}
                                onSelecionar={setEspecialidadeId}
                            />
                            {erros.especialidade ? (
                                <Text style={styles.textoErro}>{erros.especialidade}</Text>
                            ) : null}
                        </>
                    )}

                    <View style={styles.botao}>
                        <Button title="Criar conta e entrar" onPress={cadastrar} color="#79059C" />
                    </View>
                    <Text style={styles.link} onPress={onIrLogin}>
                        Já tem conta? Entrar
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}