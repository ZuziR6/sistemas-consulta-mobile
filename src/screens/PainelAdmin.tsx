// Aula 01/10/2026
// Dashboard do administrador. Vê a clínica inteira, não a agenda de um usuário.

import React, { useCallback, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Usuario } from "../types/usuario";
import { montarPainel, PainelClinica } from "../utils/montarPainel";
import {
    obterConsultas,
    obterMedicos,
    obterUsuarios,
} from "../services/storage";
import { styles } from "../styles/admin.styles";

type PainelAdminProps = {
    usuario: Usuario;
    onSair: () => void;
    navigation: { navigate: (screen: string) => void };
};

const painelVazio: PainelClinica = {
    medicos: 0,
    pacientes: 0,
    consultasAgendadas: 0,
    consultasConfirmadas: 0,
    consultasCanceladas: 0,
    consultasTotal: 0,
};

export default function PainelAdmin({
    usuario,
    onSair,
    navigation,
}: PainelAdminProps) {
    const [painel, setPainel] = useState<PainelClinica>(painelVazio);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const [usuarios, medicos, consultas] = await Promise.all([
            obterUsuarios(),
            obterMedicos(),
            obterConsultas(),
        ]);
        setPainel(montarPainel({ usuarios, medicos, consultas }));
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.cabecalho}>
                    <Text style={styles.titulo}>Painel administrativo</Text>
                    <Text style={styles.subtitulo}>
                        {usuario.nome} · acesso à clínica inteira
                    </Text>
                </View>

                <View style={styles.grade}>
                    <View style={styles.cartao}>
                        <Text style={styles.numero}>{painel.medicos}</Text>
                        <Text style={styles.rotulo}>Médicos cadastrados</Text>
                    </View>
                    <View style={styles.cartao}>
                        <Text style={styles.numero}>{painel.pacientes}</Text>
                        <Text style={styles.rotulo}>Pacientes cadastrados</Text>
                    </View>
                    <View style={styles.cartao}>
                        <Text style={styles.numero}>{painel.consultasAgendadas}</Text>
                        <Text style={styles.rotulo}>Consultas agendadas</Text>
                    </View>
                    <View style={styles.cartao}>
                        <Text style={styles.numero}>{painel.consultasTotal}</Text>
                        <Text style={styles.rotulo}>Consultas no total</Text>
                    </View>
                    <View style={styles.cartao}>
                        <Text style={styles.numero}>{painel.consultasConfirmadas}</Text>
                        <Text style={styles.rotulo}>Confirmadas</Text>
                    </View>
                    <View style={styles.cartao}>
                        <Text style={styles.numero}>{painel.consultasCanceladas}</Text>
                        <Text style={styles.rotulo}>Canceladas</Text>
                    </View>
                </View>

                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>Gestão</Text>
                    <View style={styles.botao}>
                        <Button
                            title="Todas as consultas"
                            onPress={() => navigation.navigate("AdminConsultas")}
                            color="#79059C"
                        />
                    </View>
                    <View style={styles.botao}>
                        <Button
                            title="Pacientes"
                            onPress={() => navigation.navigate("AdminPacientes")}
                            color="#79059C"
                        />
                    </View>
                    <View style={styles.botao}>
                        <Button
                            title="Médicos"
                            onPress={() => navigation.navigate("AdminMedicos")}
                            color="#79059C"
                        />
                    </View>
                    <View style={styles.botao}>
                        <Button
                            title="Alterar minha senha"
                            onPress={() => navigation.navigate("AdminSenha")}
                            color="#455A64"
                        />
                    </View>
                    <View style={styles.botao}>
                        <Button title="Sair" onPress={onSair} color="#F44336" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}