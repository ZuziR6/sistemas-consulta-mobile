// Aula 24/09/2026
// Entrada por email ou nome de usuário. Feedback visível no próprio campo.

import React, { useState } from "react";
import {
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Usuario } from "../types/usuario";
import { obterUsuarios } from "../services/storage";
import { encontrarUsuario } from "../utils/encontrarUsuario";
import { styles } from "../styles/auth.styles";

type LoginProps = {
    onEntrou: (usuario: Usuario) => void;
    onIrCadastro: () => void;
};

export default function Login({ onEntrou, onIrCadastro }: LoginProps) {
    const [identificador, setIdentificador] = useState("");
    const [senha, setSenha] = useState("");
    const [erroIdentificador, setErroIdentificador] = useState("");
    const [erroSenha, setErroSenha] = useState("");
    const [erroGeral, setErroGeral] = useState("");

    async function entrar() {
        const termo = identificador.trim();
        setErroIdentificador("");
        setErroSenha("");
        setErroGeral("");

        if (!termo) {
            setErroIdentificador("Informe o email ou o nome de usuário.");
        }
        if (!senha) {
            setErroSenha("Informe a senha.");
        }
        if (!termo || !senha) {
            return;
        }

        const usuarios = await obterUsuarios();
        const encontrado = encontrarUsuario(usuarios, termo, senha);

        if (!encontrado) {
            setErroGeral("Email, usuário ou senha inválidos.");
            return;
        }

        onEntrou(encontrado);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.cartao}>
                    <Text style={styles.titulo}>Entrar</Text>
                    <Text style={styles.texto}>
                        Paciente agenda e acompanha. Médico confirma ou cancela a agenda.
                    </Text>
                    <Text style={styles.dica}>
                        Contas de laboratório{"\n"}
                        Paciente: maria ou maria@email.com / 1234{"\n"}
                        Médico: ana ou ana@clinica.com / 1234
                    </Text>
                    <Text style={styles.rotulo}>Email ou usuário</Text>
                    <TextInput
                        style={[styles.input, erroIdentificador && styles.inputErro]}
                        placeholder="Email ou usuário"
                        autoCapitalize="none"
                        keyboardType="default"
                        value={identificador}
                        onChangeText={(texto) => {
                            setIdentificador(texto);
                            setErroIdentificador("");
                            setErroGeral("");
                        }}
                    />
                    {erroIdentificador ? (
                        <Text style={styles.textoErro}>{erroIdentificador}</Text>
                    ) : null}
                    <Text style={styles.rotulo}>Senha</Text>
                    <TextInput
                        style={[styles.input, erroSenha && styles.inputErro]}
                        placeholder="Senha"
                        secureTextEntry
                        value={senha}
                        onChangeText={(texto) => {
                            setSenha(texto);
                            setErroSenha("");
                            setErroGeral("");
                        }}
                    />
                    {erroSenha ? <Text style={styles.textoErro}>{erroSenha}</Text> : null}
                    {erroGeral ? <Text style={styles.textoErro}>{erroGeral}</Text> : null}
                    <View style={styles.botao}>
                        <Button title="Entrar" onPress={entrar} color="#79059C" />
                    </View>
                    <Text style={styles.link} onPress={onIrCadastro}>
                        Não tem conta? Cadastrar
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}