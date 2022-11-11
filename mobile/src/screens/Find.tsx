import React, { useState } from "react";
import { Heading, Text, useToast, VStack } from "native-base";
import Logo from "../assets/logo.svg";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const navigation = useNavigation();
  const toast = useToast();

  async function handleJoinPool() {
    if (!code.trim()) {
      return toast.show({
        title: "Por favor digite o código do bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    }

    if (code.length !== 6) {
      return toast.show({
        title: "Código do bolão inválido !",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);

      await api.post("/pools/join", { code });
      toast.show({
        title: "Você entrou no bolão com sucesso !",
        placement: "top",
        bgColor: "green.500",
      });
      navigation.navigate("pools");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message === "Pool not found") {
        setIsLoading(false);

        return toast.show({
          title: "Bolão não encontrado !",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (error.response?.data?.message === "You already joined this pool") {
        return toast.show({
          title: "Você já está participando deste bolão !",
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Não foi possível entrar no bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  function handleChangeCodePool(value: string) {
    setCode(value.toUpperCase());
  }

  return (
    <VStack bgColor="gay.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual é o código do bolão ?"
          value={code}
          onChangeText={handleChangeCodePool}
        />
        <Button
          title="BUSCAR BOLÃO"
          onPress={handleJoinPool}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  );
}
