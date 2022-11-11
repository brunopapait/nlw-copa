import React, { useState } from "react";
import { Heading, Text, useToast, VStack } from "native-base";
import Logo from "../assets/logo.svg";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";
import { api } from "../services/api";

export function New() {
  const [namePool, setNamePool] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  async function handlePoolCreate() {
    if (!namePool.trim()) {
      return toast.show({
        title: "Preencha o nome do bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);
      const responseCreatedResponse = await api.post("/pools", {
        title: namePool,
      });
      const { code } = responseCreatedResponse.data;

      setNamePool("");
      toast.show({
        title: `Bolão ${code} criado com sucesso !`,
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível criar o bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleChangeNamePool(value: string) {
    setNamePool(value);
  }

  return (
    <VStack bgColor="gay.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie o seu próprio bolão da copa {"\n"} e compartilhe com seus amigos
        </Heading>

        <Input
          value={namePool}
          mb={2}
          placeholder="Qual é o nome do seu bolão ?"
          onChangeText={handleChangeNamePool}
        />
        <Button
          title="CRIAR O MEU BOLÃO"
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Ao criar o seu bolão, você receberá um código único que poderá usar
          para convidar seus amigos.
        </Text>
      </VStack>
    </VStack>
  );
}
