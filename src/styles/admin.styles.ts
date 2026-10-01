import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },
    cabecalho: {
        backgroundColor: "#79059C",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 6,
    },
    subtitulo: {
        fontSize: 14,
        color: "#fff",
        opacity: 0.9,
    },
    grade: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cartao: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    numero: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#79059C",
    },
    rotulo: {
        fontSize: 13,
        color: "#555",
        marginTop: 4,
    },
    secao: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    secaoTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    botao: {
        marginBottom: 10,
    },
    item: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#fafafa",
    },
    itemTitulo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    itemTexto: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
    inputErro: {
        borderColor: "#F44336",
        backgroundColor: "#FFEBEE",
    },
    textoErro: {
        fontSize: 13,
        color: "#F44336",
        marginTop: -6,
        marginBottom: 10,
    },
    textoSucesso: {
        fontSize: 14,
        color: "#2E7D32",
        fontWeight: "600",
        marginBottom: 10,
    },
    linhaBotoes: {
        marginTop: 8,
    },
    campoRotulo: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
        marginTop: 4,
    },
    vazio: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        padding: 12,
    },
});