// Home deixou de listar a clínica inteira e de abrir o Admin.
// Agora recorta pelo usuário logado: paciente vê as suas; médico vê a agenda.

import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Consulta } from "../interfaces/consulta";
import { Usuario } from "../types/usuario";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas } from "../services/storage";
import { consultasDoUsuario } from "../utils/consultasDoUsuario";

type HomeProps = {
    usuario: Usuario;
    onSair: () => void;
    navigation: { navigate: (screen: string) => void };
};

export default function Home({ usuario, onSair, navigation }: HomeProps) {
    const [consultas, setConsultas] = useState<Consulta[]>([]);

    useFocusEffect(
        useCallback(() => {
            carregarConsultas();
        }, [usuario])
    );

    async function carregarConsultas() {
        const todas = await obterConsultas();
        setConsultas(consultasDoUsuario(todas, usuario));
    }

    async function atualizarStatus(
        consultaId: number,
        status: "confirmada" | "cancelada"
    ) {
        const todas = await obterConsultas();
        const atualizadas = todas.map((consulta) =>
            consulta.id === consultaId ? { ...consulta, status } : consulta
        );
        await salvarConsultas(atualizadas);
        setConsultas(consultasDoUsuario(atualizadas, usuario));
    }

    const ehPaciente = usuario.papel === "paciente";

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Olá, {usuario.nome}</Text>
                    <Text style={styles.subtitulo}>
                        {ehPaciente ? "Minhas consultas" : "Agenda do consultório"}
                    </Text>
                    <Text style={styles.papel}>
                        {ehPaciente ? "Paciente" : "Médico"} · {consultas.length} consulta(s)
                    </Text>
                </View>

                <View style={styles.acoes}>
                    {ehPaciente ? (
                        <View style={styles.botaoAcao}>
                            <Button
                                title="Agendar consulta"
                                onPress={() => navigation.navigate("Agendar")}
                                color="#4CAF50"
                            />
                        </View>
                    ) : null}
                    <View style={styles.botaoAcao}>
                        <Button title="Sair" onPress={onSair} color="#F44336" />
                    </View>
                </View>

                {consultas.length === 0 ? (
                    <View style={styles.vazio}>
                        <Text style={styles.vazioTexto}>
                            {ehPaciente
                                ? "Nenhuma consulta agendada ainda"
                                : "Nenhuma consulta na sua agenda"}
                        </Text>
                        {ehPaciente ? (
                            <Button
                                title="Agendar agora"
                                onPress={() => navigation.navigate("Agendar")}
                            />
                        ) : null}
                    </View>
                ) : (
                    consultas.map((consulta) => (
                        <ConsultaCard
                            key={consulta.id}
                            consulta={consulta}
                            onConfirmar={
                                ehPaciente
                                    ? undefined
                                    : () => atualizarStatus(consulta.id, "confirmada")
                            }
                            onCancelar={() => atualizarStatus(consulta.id, "cancelada")}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}