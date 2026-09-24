import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#79059C",
    },
    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },
    cartao: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#79059C",
        marginBottom: 8,
    },
    texto: {
        fontSize: 15,
        color: "#555",
        marginBottom: 16,
    },
    dica: {
        fontSize: 13,
        color: "#666",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
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
    rotulo: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
        marginTop: 8,
    },
    linhaPapeis: {
        flexDirection: "row",
        marginBottom: 12,
    },
    papel: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        marginRight: 8,
    },
    papelAtivo: {
        backgroundColor: "#F3E5F5",
        borderColor: "#79059C",
        borderWidth: 2,
    },
    papelTexto: {
        color: "#333",
        fontWeight: "600",
    },
    botao: {
        marginTop: 8,
        marginBottom: 12,
    },
    link: {
        color: "#79059C",
        textAlign: "center",
        fontWeight: "600",
        marginTop: 8,
    },
});