import React from "react";
import { VStack, Icon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from "@expo/vector-icons";
export function Pools() {
  const navigation = useNavigation();

  function handleNavigateToFind() {
    navigation.navigate("find");
  }

  return (
    <VStack bgColor="gray.900" flex={1}>
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          onPress={handleNavigateToFind}
          leftIcon={
            <Icon as={Octicons} name="search" color="white" size="md" />
          }
        />
      </VStack>
    </VStack>
  );
}
