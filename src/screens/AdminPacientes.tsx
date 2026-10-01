// Aula 01/10/2026
// Catálogo de pacientes. Grava Usuario e sincroniza a cópia nas consultas.

import React, { useCallback, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Usuario } from "../types/usuario";
import { pacienteDoUsuario } from "../utils/pacienteDoUsuario";
import { sincronizarPacienteNasConsultas } from "../utils/sincronizarConsulta";
import {
    obterConsultas,
    obterUsuarios,
    salvarConsultas,
    salvarUsuarios,
} from "../services/storage";
import { styles } from "../styles/admin.styles";

export default function AdminPacientes() {
    const [pacientes, setPacientes] = useState<Usuario[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [nome, setNome] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const usuarios = await obterUsuarios();
        setPacientes(usuarios.filter((usuario) => usuario.papel === "paciente"));
    }

    function abrirEdicao(usuario: Usuario) {
        setEditandoId(usuario.id);
        setNome(usuario.nome);
        setLogin(usuario.login);
        setEmail(usuario.email);
        setCpf(usuario.cpf ?? "");
        setTelefone(usuario.telefone ?? "");
        setErro("");
        setSucesso("");
    }

    async function salvar() {
        if (!editandoId) {
            return;
        }

        const nomeLimpo = nome.trim();
        const loginLimpo = login.trim().toLowerCase();
        const emailLimpo = email.trim().toLowerCase();

        if (!nomeLimpo || !loginLimpo || !emailLimpo) {
            setErro("Nome, usuário e email são obrigatórios.");
            return;
        }

        if (loginLimpo === "admin") {
            setErro("Este nome de usuário é reservado.");
            return;
        }

        const usuarios = await obterUsuarios();
        const loginEmUso = usuarios.some(
            (usuario) =>
                usuario.id !== editandoId &&
                (usuario.login ?? "").toLowerCase() === loginLimpo
        );
        const emailEmUso = usuarios.some(
            (usuario) => usuario.id !== editandoId && usuario.email === emailLimpo
        );

        if (loginEmUso) {
            setErro("Este nome de usuário já está em uso.");
            return;
        }
        if (emailEmUso) {
            setErro("Este email já está cadastrado.");
            return;
        }

        const atualizados = usuarios.map((usuario) =>
            usuario.id === editandoId
                ? {
                    ...usuario,
                    nome: nomeLimpo,
                    login: loginLimpo,
                    email: emailLimpo,
                    cpf: cpf.trim() || "não informado",
                    telefone: telefone.trim() || undefined,
                }
                : usuario
        );

        const salvo = atualizados.find((usuario) => usuario.id === editandoId);
        if (!salvo) {
            setErro("Paciente não encontrado.");
            return;
        }

        await salvarUsuarios(atualizados);

        const consultas = await obterConsultas();
        await salvarConsultas(
            sincronizarPacienteNasConsultas(consultas, pacienteDoUsuario(salvo))
        );

        setPacientes(atualizados.filter((usuario) => usuario.papel === "paciente"));
        setSucesso("Paciente atualizado. Consultas sincronizadas.");
        setEditandoId(null);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text style={styles.secaoTitulo}>Pacientes</Text>
                {sucesso ? <Text style={styles.textoSucesso}>{sucesso}</Text> : null}

                {pacientes.length === 0 ? (
                    <Text style={styles.vazio}>Nenhum paciente cadastrado.</Text>
                ) : (
                    pacientes.map((paciente) => (
                        <View key={paciente.id} style={styles.item}>
                            <Text style={styles.itemTitulo}>{paciente.nome}</Text>
                            <Text style={styles.itemTexto}>
                                {paciente.login} · {paciente.email}
                            </Text>
                            <Text style={styles.itemTexto}>
                                CPF {paciente.cpf ?? "não informado"}
                            </Text>
                            {editandoId === paciente.id ? (
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        value={nome}
                                        onChangeText={setNome}
                                        placeholder="Nome"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={login}
                                        onChangeText={setLogin}
                                        autoCapitalize="none"
                                        placeholder="Usuário"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        placeholder="Email"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={cpf}
                                        onChangeText={setCpf}
                                        placeholder="CPF"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={telefone}
                                        onChangeText={setTelefone}
                                        placeholder="Telefone"
                                    />
                                    {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
                                    <View style={styles.botao}>
                                        <Button title="Salvar paciente" onPress={salvar} color="#79059C" />
                                    </View>
                                    <View style={styles.botao}>
                                        <Button
                                            title="Fechar edição"
                                            onPress={() => setEditandoId(null)}
                                            color="#455A64"
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.botao}>
                                    <Button
                                        title="Editar"
                                        onPress={() => abrirEdicao(paciente)}
                                        color="#79059C"
                                    />
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}