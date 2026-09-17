// Tela nova. Email + senha. Quem entra é a sessão; o catálogo já veio do seed.

import React, { useState } from "react";
import {
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Usuario } from "../types/usuario";
import { obterUsuarios } from "../services/storage";
import { styles } from "../styles/auth.styles";

type LoginProps = {
    onEntrou: (usuario: Usuario) => void;
    onIrCadastro: () => void;
};

export default function Login({ onEntrou, onIrCadastro }: LoginProps) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function entrar() {
        const emailLimpo = email.trim().toLowerCase();

        if (!emailLimpo || !senha) {
            Alert.alert("Erro", "Preencha email e senha");
            return;
        }

        const usuarios = await obterUsuarios();
        const encontrado = usuarios.find(
            (usuario) => usuario.email === emailLimpo && usuario.senha === senha
        );

        if (!encontrado) {
            Alert.alert("Erro", "Email ou senha inválidos");
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
                        Paciente: maria@email.com / 1234{"\n"}
                        Médico: ana@clinica.com / 1234
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />
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