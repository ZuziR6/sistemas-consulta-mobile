// Aula 01/10/2026
// Troca da senha do admin logado. Não mostra a senha atual na tela.

import React, { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Usuario } from "../types/usuario";
import { obterUsuarios, salvarUsuarios } from "../services/storage";
import { styles } from "../styles/admin.styles";

type AdminSenhaProps = {
    usuario: Usuario;
    onAtualizou: (usuario: Usuario) => void;
};

export default function AdminSenha({ usuario, onAtualizou }: AdminSenhaProps) {
    const [atual, setAtual] = useState("");
    const [nova, setNova] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function salvar() {
        setErro("");
        setSucesso("");

        if (!atual || !nova || !confirmacao) {
            setErro("Preencha a senha atual, a nova e a confirmação.");
            return;
        }

        if (atual !== usuario.senha) {
            setErro("A senha atual não confere.");
            return;
        }

        if (nova.length < 4) {
            setErro("A nova senha precisa ter pelo menos 4 caracteres.");
            return;
        }

        if (nova !== confirmacao) {
            setErro("A confirmação não bate com a nova senha.");
            return;
        }

        const usuarios = await obterUsuarios();
        const atualizados = usuarios.map((item) =>
            item.id === usuario.id ? { ...item, senha: nova } : item
        );
        await salvarUsuarios(atualizados);

        const atualizado = { ...usuario, senha: nova };
        await onAtualizou(atualizado);
        setAtual("");
        setNova("");
        setConfirmacao("");
        setSucesso("Senha alterada. Use a nova senha no próximo login.");
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>Alterar senha</Text>
                    <Text style={styles.itemTexto}>
                        A senha de acesso administrativo não aparece na tela de Login.
                        Depois de alterar, o merge do catálogo preserva este valor.
                    </Text>
                    <Text style={styles.campoRotulo}>Senha atual</Text>
                    <TextInput
                        style={[styles.input, erro && styles.inputErro]}
                        value={atual}
                        onChangeText={setAtual}
                        secureTextEntry
                        placeholder="Senha atual"
                    />
                    <Text style={styles.campoRotulo}>Nova senha</Text>
                    <TextInput
                        style={styles.input}
                        value={nova}
                        onChangeText={setNova}
                        secureTextEntry
                        placeholder="Nova senha"
                    />
                    <Text style={styles.campoRotulo}>Confirmar nova senha</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmacao}
                        onChangeText={setConfirmacao}
                        secureTextEntry
                        placeholder="Confirmar nova senha"
                    />
                    {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
                    {sucesso ? <Text style={styles.textoSucesso}>{sucesso}</Text> : null}
                    <View style={styles.botao}>
                        <Button title="Salvar senha" onPress={salvar} color="#79059C" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}