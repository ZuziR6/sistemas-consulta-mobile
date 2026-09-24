// Aula 24/09/2026
// Formulário de agendamento com validação visível, datepicker e montagem tipada.

import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ListaSelecao, SeletorData } from "../components";
import { Medico } from "../interfaces/medico";
import { Especialidade } from "../types/especialidade";
import { Usuario } from "../types/usuario";
import { montarConsulta } from "../utils/montarConsulta";
import { validarDataAgenda } from "../utils/dataConsulta";
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

type ErrosAgenda = {
    especialidade?: string;
    medico?: string;
    data?: string;
};

export default function Agendar({ usuario, navigation }: AgendarProps) {
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [especialidadeId, setEspecialidadeId] = useState<number | null>(null);
    const [medicoId, setMedicoId] = useState<number | null>(null);
    const [data, setData] = useState<Date | null>(null);
    const [erros, setErros] = useState<ErrosAgenda>({});
    const [sucesso, setSucesso] = useState("");

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
        setErros((prev) => ({ ...prev, especialidade: undefined, medico: undefined }));
        setSucesso("");
    }

    function escolherMedico(id: number) {
        setMedicoId(id);
        setErros((prev) => ({ ...prev, medico: undefined }));
        setSucesso("");
    }

    function escolherData(dia: Date) {
        setData(dia);
        setErros((prev) => ({ ...prev, data: validarDataAgenda(dia) ?? undefined }));
        setSucesso("");
    }

    function validarFormulario(): { medico: Medico; data: Date } | null {
        const proximos: ErrosAgenda = {};
        const medico = medicosFiltrados.find((item) => item.id === medicoId);

        if (!especialidadeId) {
            proximos.especialidade = "Escolha uma especialidade da lista.";
        }

        if (!medico) {
            proximos.medico = "Escolha um médico desta especialidade.";
        }

        if (!data) {
            proximos.data = "Escolha uma data no calendário.";
        } else {
            const erroData = validarDataAgenda(data);
            if (erroData) {
                proximos.data = erroData;
            }
        }

        setErros(proximos);

        if (proximos.especialidade || proximos.medico || proximos.data || !medico || !data) {
            return null;
        }

        return { medico, data };
    }

    async function agendar() {
        const valido = validarFormulario();
        if (!valido) {
            return;
        }

        const novaConsulta = montarConsulta({
            medico: valido.medico,
            usuario,
            data: valido.data,
        });

        const atuais = await obterConsultas();
        await salvarConsultas([...atuais, novaConsulta]);
        setSucesso("Consulta agendada. Voltando para a Home...");

        setTimeout(() => {
            navigation.goBack();
        }, 900);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.conteudo}>
                {sucesso ? (
                    <View style={styles.secaoSucesso}>
                        <Text style={styles.textoSucesso}>{sucesso}</Text>
                    </View>
                ) : null}

                <View style={[styles.secao, erros.especialidade && styles.secaoErro]}>
                    <Text style={styles.titulo}>1. Especialidade</Text>
                    <Text style={styles.texto}>
                        Campo obrigatório. A lista vem de src/data/banco.json.
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
                    {erros.especialidade ? (
                        <Text style={styles.textoErro}>{erros.especialidade}</Text>
                    ) : null}
                </View>

                <View style={[styles.secao, erros.medico && styles.secaoErro]}>
                    <Text style={styles.titulo}>2. Médico</Text>
                    {!especialidadeId ? (
                        <Text style={styles.texto}>Primeiro escolha a especialidade.</Text>
                    ) : medicosFiltrados.length === 0 ? (
                        <Text style={styles.texto}>Nenhum médico ativo nesta especialidade.</Text>
                    ) : (
                        <ListaSelecao
                            itens={medicosFiltrados.map((item) => ({
                                id: item.id,
                                titulo: item.nome,
                                subtitulo: `${item.especialidade.nome} · ${item.email} · CRM ${item.crm}`,
                            }))}
                            selecionadoId={medicoId}
                            onSelecionar={escolherMedico}
                        />
                    )}
                    {erros.medico ? <Text style={styles.textoErro}>{erros.medico}</Text> : null}
                </View>

                <View style={[styles.secao, erros.data && styles.secaoErro]}>
                    <Text style={styles.titulo}>3. Data da consulta</Text>
                    <Text style={styles.texto}>
                        Não agenda hoje nem o passado. O último dia habilitado é daqui a 2 meses.
                    </Text>
                    <SeletorData selecionada={data} onSelecionar={escolherData} />
                    {erros.data ? <Text style={styles.textoErro}>{erros.data}</Text> : null}
                </View>

                <Button title="Agendar consulta" onPress={agendar} color="#79059C" />
            </ScrollView>
        </View>
    );
}