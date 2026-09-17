// Substitui o Admin que digitava especialidade e sempre pegava medicos[0].
// Aqui a consulta nasce com especialidade escolhida + médico daquela lista.

import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ListaSelecao } from "../components";
import { Consulta } from "../interfaces/consulta";
import { Medico } from "../interfaces/medico";
import { Especialidade } from "../types/especialidade";
import { Usuario } from "../types/usuario";
import { Paciente } from "../types/paciente";
import { parsearDataBR } from "../utils/dataConsulta";
import {
    obterConsultas,
    obterEspecialidades,
    obterMedicos,
    salvarConsultas,
} from "../services/storage";
import { styles } from "../styles/agendar.styles";

type AgendarProps = {
    usuario: Usuario;
    navigation: { goBack: () => void };
};

export default function Agendar({ usuario, navigation }: AgendarProps) {
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [especialidadeId, setEspecialidadeId] = useState<number | null>(null);
    const [medicoId, setMedicoId] = useState<number | null>(null);
    const [dataTexto, setDataTexto] = useState("");

    useEffect(() => {
        async function carregar() {
            const [listaEsp, listaMed] = await Promise.all([
                obterEspecialidades(),
                obterMedicos(),
            ]);
            setEspecialidades(listaEsp);
            setMedicos(listaMed);
        }
        carregar();
    }, []);

    const medicosFiltrados = medicos.filter(
        (medico) => medico.ativo && medico.especialidade.id === especialidadeId
    );

    function escolherEspecialidade(id: number) {
        setEspecialidadeId(id);
        setMedicoId(null);
    }

    async function agendar() {
        if (!especialidadeId) {
            Alert.alert("Erro", "Escolha uma especialidade");
            return;
        }

        const medico = medicosFiltrados.find((item) => item.id === medicoId);
        if (!medico) {
            Alert.alert("Erro", "Escolha um médico desta especialidade");
            return;
        }

        const data = parsearDataBR(dataTexto);
        if (!data) {
            Alert.alert("Erro", "Use a data no formato DD/MM/AAAA");
            return;
        }

        const paciente: Paciente = {
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf ?? "não informado",
            email: usuario.email,
            telefone: usuario.telefone,
        };

        const novaConsulta: Consulta = {
            id: Date.now(),
            medico,
            paciente,
            data,
            valor: 350,
            status: "agendada",
            observacoes: `Agendada pelo app (${medico.especialidade.nome})`,
        };

        const atuais = await obterConsultas();
        await salvarConsultas([...atuais, novaConsulta]);

        Alert.alert("Sucesso", "Consulta agendada", [
            { text: "OK", onPress: () => navigation.goBack() },
        ]);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.secao}>
                    <Text style={styles.titulo}>1. Escolha a especialidade</Text>
                    <Text style={styles.texto}>
                        A lista vem de src/data/data.ts. Não há campo para inventar um nome.
                    </Text>
                    <ListaSelecao
                        itens={especialidades.map((item) => ({
                            id: item.id,
                            titulo: item.nome,
                            subtitulo: item.descricao,
                        }))}
                        selecionadoId={especialidadeId}
                        onSelecionar={escolherEspecialidade}
                    />
                </View>

                <View style={styles.secao}>
                    <Text style={styles.titulo}>2. Escolha o médico</Text>
                    {!especialidadeId ? (
                        <Text style={styles.texto}>Primeiro escolha a especialidade.</Text>
                    ) : medicosFiltrados.length === 0 ? (
                        <Text style={styles.texto}>Nenhum médico ativo nesta especialidade.</Text>
                    ) : (
                        <ListaSelecao
                            itens={medicosFiltrados.map((item) => ({
                                id: item.id,
                                titulo: item.nome,
                                subtitulo: `CRM ${item.crm}`,
                            }))}
                            selecionadoId={medicoId}
                            onSelecionar={setMedicoId}
                        />
                    )}
                </View>

                <View style={styles.secao}>
                    <Text style={styles.titulo}>3. Data da consulta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/AAAA"
                        value={dataTexto}
                        onChangeText={setDataTexto}
                    />
                    <Button title="Agendar consulta" onPress={agendar} color="#79059C" />
                </View>
            </ScrollView>
        </View>
    );
}