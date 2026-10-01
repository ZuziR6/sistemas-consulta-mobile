// Aula 01/10/2026
// Lista completa de consultas. Admin confirma, cancela e edita data.

import React, { useCallback, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { ConsultaCard, SeletorData } from "../components";
import { Consulta } from "../interfaces/consulta";
import { StatusConsulta } from "../types/statusConsulta";
import {
    atualizarConsulta,
    atualizarStatusConsulta,
} from "../utils/sincronizarConsulta";
import { validarDataAgenda } from "../utils/dataConsulta";
import { obterConsultas, salvarConsultas } from "../services/storage";
import { styles } from "../styles/admin.styles";

const STATUS_EDITAVEL: StatusConsulta[] = [
    "agendada",
    "confirmada",
    "cancelada",
];

export default function AdminConsultas() {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [data, setData] = useState<Date | null>(null);
    const [observacoes, setObservacoes] = useState("");
    const [status, setStatus] = useState<StatusConsulta>("agendada");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const lista = await obterConsultas();
        setConsultas(lista);
    }

    async function gravar(lista: Consulta[]) {
        await salvarConsultas(lista);
        setConsultas(lista);
    }

    async function mudarStatus(consultaId: number, novoStatus: StatusConsulta) {
        const atuais = await obterConsultas();
        await gravar(atualizarStatusConsulta(atuais, consultaId, novoStatus));
        setSucesso(
            novoStatus === "cancelada"
                ? "Consulta cancelada."
                : "Status da consulta atualizado."
        );
        setEditandoId(null);
    }

    function abrirEdicao(consulta: Consulta) {
        setEditandoId(consulta.id);
        setData(consulta.data);
        setObservacoes(consulta.observacoes ?? "");
        setStatus(consulta.status);
        setErro("");
        setSucesso("");
    }

    async function salvarEdicao() {
        if (!editandoId || !data) {
            setErro("Escolha uma data no calendário.");
            return;
        }

        const erroData = validarDataAgenda(data);
        if (erroData && status !== "cancelada") {
            setErro(erroData);
            return;
        }

        const atuais = await obterConsultas();
        await gravar(
            atualizarConsulta(atuais, editandoId, {
                data,
                observacoes: observacoes.trim(),
                status,
            })
        );
        setSucesso("Consulta atualizada.");
        setEditandoId(null);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text style={styles.secaoTitulo}>Todas as consultas</Text>
                {sucesso ? <Text style={styles.textoSucesso}>{sucesso}</Text> : null}

                {consultas.length === 0 ? (
                    <Text style={styles.vazio}>Nenhuma consulta gravada.</Text>
                ) : (
                    consultas.map((consulta) => (
                        <View key={consulta.id}>
                            <ConsultaCard
                                consulta={consulta}
                                onConfirmar={
                                    consulta.status === "agendada"
                                        ? () => mudarStatus(consulta.id, "confirmada")
                                        : undefined
                                }
                                onCancelar={
                                    consulta.status === "cancelada"
                                        ? undefined
                                        : () => mudarStatus(consulta.id, "cancelada")
                                }
                                onEditar={() => abrirEdicao(consulta)}
                            />

                            {editandoId === consulta.id ? (
                                <View style={styles.secao}>
                                    <Text style={styles.campoRotulo}>Data</Text>
                                    <SeletorData selecionada={data} onSelecionar={setData} />
                                    <Text style={styles.campoRotulo}>Status</Text>
                                    {STATUS_EDITAVEL.map((item) => (
                                        <View key={item} style={styles.botao}>
                                            <Button
                                                title={item}
                                                onPress={() => setStatus(item)}
                                                color={status === item ? "#79059C" : "#9E9E9E"}
                                            />
                                        </View>
                                    ))}
                                    <Text style={styles.campoRotulo}>Observações</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={observacoes}
                                        onChangeText={setObservacoes}
                                        placeholder="Observações"
                                    />
                                    {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
                                    <View style={styles.botao}>
                                        <Button
                                            title="Salvar consulta"
                                            onPress={salvarEdicao}
                                            color="#79059C"
                                        />
                                    </View>
                                    <View style={styles.botao}>
                                        <Button
                                            title="Fechar edição"
                                            onPress={() => setEditandoId(null)}
                                            color="#455A64"
                                        />
                                    </View>
                                </View>
                            ) : null}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}