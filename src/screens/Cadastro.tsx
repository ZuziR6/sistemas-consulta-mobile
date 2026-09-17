// Cadastro local. Médico escolhe especialidade da lista; não digita o nome dela.

import React, { useEffect, useState } from "react";
import {
    Alert,
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

export default function Cadastro({ onEntrou, onIrLogin }: CadastroProps) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [papel, setPapel] = useState<Papel>("paciente");
    const [crm, setCrm] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [especialidadeId, setEspecialidadeId] = useState<number | null>(null);
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

    useEffect(() => {
        async function carregar() {
            const lista = await obterEspecialidades();
            setEspecialidades(lista);
        }
        carregar();
    }, []);

    async function cadastrar() {
        const nomeLimpo = nome.trim();
        const emailLimpo = email.trim().toLowerCase();

        if (!nomeLimpo || !emailLimpo || !senha) {
            Alert.alert("Erro", "Preencha nome, email e senha");
            return;
        }

        if (papel === "medico" && (!crm.trim() || !especialidadeId)) {
            Alert.alert("Erro", "Médico precisa de CRM e de uma especialidade da lista");
            return;
        }

        const usuarios = await obterUsuarios();
        const emailJaExiste = usuarios.some((usuario) => usuario.email === emailLimpo);
        if (emailJaExiste) {
            Alert.alert("Erro", "Este email já está cadastrado");
            return;
        }

        let medicoId: number | undefined;

        if (papel === "medico") {
            const especialidade = especialidades.find((item) => item.id === especialidadeId);
            if (!especialidade) {
                Alert.alert("Erro", "Escolha uma especialidade da lista");
                return;
            }

            const medicos = await obterMedicos();
            const novoMedico: Medico = {
                id: Date.now(),
                nome: nomeLimpo,
                crm: crm.trim(),
                especialidade,
                ativo: true,
            };
            await salvarMedicos([...medicos, novoMedico]);
            medicoId = novoMedico.id;
        }

        const novoUsuario: Usuario = {
            id: Date.now(),
            nome: nomeLimpo,
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
                        A conta fica neste aparelho (AsyncStorage). Não é um servidor.
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

                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                    />
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
                            <TextInput
                                style={styles.input}
                                placeholder="CRM"
                                value={crm}
                                onChangeText={setCrm}
                            />
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