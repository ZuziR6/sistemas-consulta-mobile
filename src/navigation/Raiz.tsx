// O App.tsx não decide mais a pilha. Esta raiz escolhe Auth ou App
// depois de semear o catálogo e ler a sessão.

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Usuario } from "../types/usuario";
import {
    limparSessao,
    obterSessao,
    salvarSessao,
    semearDadosIniciais,
} from "../services/storage";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import Agendar from "../screens/Agendar";
import { styles as estilosCarregar } from "../styles/carregando.styles";

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const opcoesCabecalho = {
    headerStyle: { backgroundColor: "#79059C" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold" as const },
};

function StackAuth({
    onEntrou,
}: {
    onEntrou: (usuario: Usuario) => void;
}) {
    return (
        <AuthStack.Navigator screenOptions={opcoesCabecalho}>
            <AuthStack.Screen name="Login" options={{ title: "Login" }}>
                {({ navigation }) => (
                    <Login
                        onEntrou={onEntrou}
                        onIrCadastro={() => navigation.navigate("Cadastro")}
                    />
                )}
            </AuthStack.Screen>
            <AuthStack.Screen name="Cadastro" options={{ title: "Cadastro" }}>
                {({ navigation }) => (
                    <Cadastro
                        onEntrou={onEntrou}
                        onIrLogin={() => navigation.navigate("Login")}
                    />
                )}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    );
}

function StackApp({
    usuario,
    onSair,
}: {
    usuario: Usuario;
    onSair: () => void;
}) {
    return (
        <AppStack.Navigator screenOptions={opcoesCabecalho}>
            <AppStack.Screen name="Home" options={{ title: "Minhas Consultas" }}>
                {({ navigation }) => (
                    <Home usuario={usuario} onSair={onSair} navigation={navigation} />
                )}
            </AppStack.Screen>
            <AppStack.Screen name="Agendar" options={{ title: "Agendar consulta" }}>
                {({ navigation }) => (
                    <Agendar usuario={usuario} navigation={navigation} />
                )}
            </AppStack.Screen>
        </AppStack.Navigator>
    );
}

function TelaCarregando() {
    return (
        <View style={estilosCarregar.container}>
            <ActivityIndicator color="#fff" />
            <Text style={estilosCarregar.texto}>Carregando...</Text>
        </View>
    );
}

export default function Raiz() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [pronto, setPronto] = useState(false);

    useEffect(() => {
        async function iniciar() {
            await semearDadosIniciais();
            const sessao = await obterSessao();
            setUsuario(sessao);
            setPronto(true);
        }
        iniciar();
    }, []);

    async function entrar(usuarioLogado: Usuario) {
        await salvarSessao(usuarioLogado);
        setUsuario(usuarioLogado);
    }

    async function sair() {
        await limparSessao();
        setUsuario(null);
    }

    if (!pronto) {
        return <TelaCarregando />;
    }

    return usuario ? (
        <StackApp usuario={usuario} onSair={sair} />
    ) : (
        <StackAuth onEntrou={entrar} />
    );
}