import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas } from "../services/storage";

export default function Home({
    navigation,
}: {
    navigation: { navigate: (screen: string) => void };
}) {
    const [consultas, setConsultas] = useState<Consulta[]>([]);

    useFocusEffect(
        useCallback(() => {
            carregarConsultas();
        }, [])
    );

    async function carregarConsultas() {
        const consultasSalvas = await obterConsultas();
        setConsultas(consultasSalvas);
    }

    async function confirmarConsulta(consultaId: number) {
        const consultasAtualizadas = consultas.map((consulta) =>
            consulta.id === consultaId
                ? { ...consulta, status: "confirmada" as const }
                : consulta
        );
        setConsultas(consultasAtualizadas);
        await salvarConsultas(consultasAtualizadas);
    }

    async function cancelarConsulta(consultaId: number) {
        const consultasAtualizadas = consultas.map((consulta) =>
            consulta.id === consultaId
                ? { ...consulta, status: "cancelada" as const }
                : consulta
        );
        setConsultas(consultasAtualizadas);
        await salvarConsultas(consultasAtualizadas);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Minhas Consultas</Text>
                    <Text style={styles.subtitulo}>
                        {consultas.length} consulta(s) cadastrada(s)
                    </Text>
                </View>

                <View style={styles.botaoAdmin}>
                    <Button
                        title="Painel Admin"
                        onPress={() => navigation.navigate("Admin")}
                        color="#4CAF50"
                    />
                </View>

                {consultas.length === 0 ? (
                    <View style={styles.vazio}>
                        <Text style={styles.vazioTexto}>
                            Nenhuma consulta agendada ainda
                        </Text>
                        <Button
                            title="Cadastrar no Admin"
                            onPress={() => navigation.navigate("Admin")}
                        />
                    </View>
                ) : (
                    consultas.map((consulta) => (
                        <ConsultaCard
                            key={consulta.id}
                            consulta={consulta}
                            onConfirmar={() => confirmarConsulta(consulta.id)}
                            onCancelar={() => cancelarConsulta(consulta.id)}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}


