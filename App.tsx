import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Admin } from "./src/screens";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#79059C" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Minhas Consultas" }}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{ title: "Painel Administrativo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


