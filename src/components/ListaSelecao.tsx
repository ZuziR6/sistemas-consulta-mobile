// Lista tocável. Substitui o TextInput de especialidade/médico.
// Não grava storage. Só avisa o pai qual id foi escolhido.

import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/listaSelecao.styles";

export type ItemSelecao = {
    id: number;
    titulo: string;
    subtitulo?: string;
};

type ListaSelecaoProps = {
    itens: ItemSelecao[];
    selecionadoId: number | null;
    onSelecionar: (id: number) => void;
};

export default function ListaSelecao({
    itens,
    selecionadoId,
    onSelecionar,
}: ListaSelecaoProps) {
    return (
        <View>
            {itens.map((item) => {
                const ativo = item.id === selecionadoId;
                return (
                    <Pressable
                        key={item.id}
                        onPress={() => onSelecionar(item.id)}
                        style={[styles.item, ativo && styles.itemAtivo]}
                    >
                        <Text style={styles.titulo}>{item.titulo}</Text>
                        {item.subtitulo ? (
                            <Text style={styles.subtitulo}>{item.subtitulo}</Text>
                        ) : null}
                    </Pressable>
                );
            })}
        </View>
    );
}