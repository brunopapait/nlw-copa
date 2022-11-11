import React, { useCallback, useEffect, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from "@expo/vector-icons";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);

  const navigation = useNavigation();
  const toast = useToast();

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);

      const responseListPools = await api.get("/pools");
      const poolsData = responseListPools.data.pools;

      setPools(poolsData);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível buscar os bolões !",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [fetchPools])
  );

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

      {loading && <Loading />}
      {!loading && (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PoolCard data={item} />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 20 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
