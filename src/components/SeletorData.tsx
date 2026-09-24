// Aula 24/09/2026
// Datepicker da agenda. Só os dias da janela (amanhã até 2 meses) aceitam clique.

import React from "react";
import { Pressable, Text, View } from "react-native";
import {
    dataEstaNaJanela,
    formatarDataBR,
    mesmaDataCivil,
    mesesDaJanela,
} from "../utils/dataConsulta";
import { styles } from "../styles/seletorData.styles";

type SeletorDataProps = {
    selecionada: Date | null;
    onSelecionar: (data: Date) => void;
};

const ROTULOS = ["D", "S", "T", "Q", "Q", "S", "S"];

function diasDoMes(mes: Date): (Date | null)[] {
    const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const ultimo = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
    const celulas: (Date | null)[] = [];

    for (let i = 0; i < primeiro.getDay(); i += 1) {
        celulas.push(null);
    }

    for (let dia = 1; dia <= ultimo.getDate(); dia += 1) {
        celulas.push(new Date(mes.getFullYear(), mes.getMonth(), dia));
    }

    return celulas;
}

export default function SeletorData({
    selecionada,
    onSelecionar,
}: SeletorDataProps) {
    const meses = mesesDaJanela();

    return (
        <View>
            {meses.map((mes) => (
                <View key={`${mes.getFullYear()}-${mes.getMonth()}`} style={styles.mes}>
                    <Text style={styles.tituloMes}>
                        {mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </Text>
                    <View style={styles.semana}>
                        {ROTULOS.map((rotulo, indice) => (
                            <Text key={`${rotulo}-${indice}`} style={styles.rotuloDia}>
                                {rotulo}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.grade}>
                        {diasDoMes(mes).map((dia, indice) => {
                            if (!dia) {
                                return <View key={`vazio-${indice}`} style={styles.dia} />;
                            }

                            const habilitado = dataEstaNaJanela(dia);
                            const ativo = selecionada ? mesmaDataCivil(dia, selecionada) : false;

                            return (
                                <View key={dia.toISOString()} style={styles.dia}>
                                    <Pressable
                                        disabled={!habilitado}
                                        onPress={() => onSelecionar(dia)}
                                        style={[
                                            styles.diaBotao,
                                            ativo && styles.diaAtivo,
                                            !habilitado && styles.diaInativo,
                                        ]}
                                    >
                                        <Text
                                            style={[styles.diaTexto, ativo && styles.diaTextoAtivo]}
                                        >
                                            {dia.getDate()}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ))}
            <Text style={styles.selecionada}>
                {selecionada
                    ? `Data escolhida: ${formatarDataBR(selecionada)}`
                    : "Clique em um dia habilitado."}
            </Text>
        </View>
    );
}