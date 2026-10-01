// Aula 01/10/2026
// Catálogo de médicos. Grava Medico + Usuario e sincroniza as consultas.

import React, { useCallback, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { ListaSelecao } from "../components";
import { Medico } from "../interfaces/medico";
import { Especialidade } from "../types/especialidade";
import { Usuario } from "../types/usuario";
import { sincronizarMedicoNasConsultas } from "../utils/sincronizarConsulta";
import {
    obterConsultas,
    obterEspecialidades,
    obterMedicos,
    obterUsuarios,
    salvarConsultas,
    salvarMedicos,
    salvarUsuarios,
} from "../services/storage";
import { styles } from "../styles/admin.styles";

export default function AdminMedicos() {
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [nome, setNome] = useState("");
    const [crm, setCrm] = useState("");
    const [email, setEmail] = useState("");
    const [especialidadeId, setEspecialidadeId] = useState<number | null>(null);
    const [ativo, setAtivo] = useState(true);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const [listaMed, listaUsr, listaEsp] = await Promise.all([
            obterMedicos(),
            obterUsuarios(),
            obterEspecialidades(),
        ]);
        setMedicos(listaMed);
        setUsuarios(listaUsr);
        setEspecialidades(listaEsp);
    }

    function abrirEdicao(medico: Medico) {
        setEditandoId(medico.id);
        setNome(medico.nome);
        setCrm(medico.crm);
        setEmail(medico.email);
        setEspecialidadeId(medico.especialidade.id);
        setAtivo(medico.ativo);
        setErro("");
        setSucesso("");
    }

    async function salvar() {
        if (!editandoId) {
            return;
        }

        const nomeLimpo = nome.trim();
        const crmLimpo = crm.trim();
        const emailLimpo = email.trim().toLowerCase();
        const especialidade = especialidades.find(
            (item) => item.id === especialidadeId
        );

        if (!nomeLimpo || !crmLimpo || !emailLimpo || !especialidade) {
            setErro("Nome, CRM, email e especialidade são obrigatórios.");
            return;
        }

        const emailEmUso = usuarios.some(
            (usuario) =>
                usuario.email === emailLimpo && usuario.medicoId !== editandoId
        );
        if (emailEmUso) {
            setErro("Este email já está em outra conta.");
            return;
        }

        const medicoAtualizado: Medico = {
            id: editandoId,
            nome: nomeLimpo,
            crm: crmLimpo,
            email: emailLimpo,
            especialidade,
            ativo,
        };

        const medicosAtualizados = medicos.map((medico) =>
            medico.id === editandoId ? medicoAtualizado : medico
        );
        await salvarMedicos(medicosAtualizados);

        const usuariosAtualizados = usuarios.map((usuario) =>
            usuario.medicoId === editandoId
                ? { ...usuario, nome: nomeLimpo, email: emailLimpo }
                : usuario
        );
        await salvarUsuarios(usuariosAtualizados);

        const consultas = await obterConsultas();
        await salvarConsultas(
            sincronizarMedicoNasConsultas(consultas, medicoAtualizado)
        );

        setMedicos(medicosAtualizados);
        setUsuarios(usuariosAtualizados);
        setSucesso("Médico atualizado. Consultas sincronizadas.");
        setEditandoId(null);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text style={styles.secaoTitulo}>Médicos</Text>
                {sucesso ? <Text style={styles.textoSucesso}>{sucesso}</Text> : null}

                {medicos.map((medico) => (
                    <View key={medico.id} style={styles.item}>
                        <Text style={styles.itemTitulo}>{medico.nome}</Text>
                        <Text style={styles.itemTexto}>
                            {medico.especialidade.nome} · {medico.email} · CRM {medico.crm}
                        </Text>
                        <Text style={styles.itemTexto}>
                            {medico.ativo ? "Ativo" : "Inativo"}
                        </Text>
                        {editandoId === medico.id ? (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    value={nome}
                                    onChangeText={setNome}
                                    placeholder="Nome"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={crm}
                                    onChangeText={setCrm}
                                    placeholder="CRM"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholder="Email"
                                />
                                <Text style={styles.campoRotulo}>Especialidade</Text>
                                <ListaSelecao
                                    itens={especialidades.map((item) => ({
                                        id: item.id,
                                        titulo: item.nome,
                                        subtitulo: item.descricao,
                                    }))}
                                    selecionadoId={especialidadeId}
                                    onSelecionar={setEspecialidadeId}
                                />
                                <View style={styles.botao}>
                                    <Button
                                        title={ativo ? "Desativar médico" : "Ativar médico"}
                                        onPress={() => setAtivo(!ativo)}
                                        color={ativo ? "#F44336" : "#4CAF50"}
                                    />
                                </View>
                                {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
                                <View style={styles.botao}>
                                    <Button title="Salvar médico" onPress={salvar} color="#79059C" />
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
                                    onPress={() => abrirEdicao(medico)}
                                    color="#79059C"
                                />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}