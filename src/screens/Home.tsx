import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Especialidade } from "../types/especialidade";
import { Paciente } from "../types/paciente";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";

export default function Home() {
    const cardiologia: Especialidade = {
        id: 1,
        nome: "Cardiologia",
        descricao: "Cuidados com o coração",
    };

    const medico1: Medico = {
        id: 1,
        nome: "Dr. Roberto Silva",
        crm: "CRM12345",
        especialidade: cardiologia,
        ativo: true,
    };

    const paciente1: Paciente = {
        id: 1,
        nome: "Carlos Andrade",
        cpf: "123.456.789-00",
        email: "carlos@email.com",
        telefone: "(11) 98765-4321",
    };

    const [consulta, setConsulta] = useState<Consulta>({
        id: 1,
        medico: medico1,
        paciente: paciente1,
        data: new Date(2026, 7, 27),
        valor: 350,
        status: "agendada",
        observacoes: "Consulta de rotina",
    });

    function confirmarConsulta() {
        setConsulta({
            ...consulta,
            status: "confirmada",
        });
    }

    function cancelarConsulta() {
        setConsulta({
            ...consulta,
            status: "cancelada",
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Sistema de Consultas</Text>
                    <Text style={styles.subtitulo}>Consulta #{consulta.id}</Text>
                </View>
                <ConsultaCard
                    consulta={consulta}
                    onConfirmar={confirmarConsulta}
                    onCancelar={cancelarConsulta}
                />
            </ScrollView>
        </View>
    );
}
