import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { Share } from "react-native";
import React, { useEffect, useState } from "react";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setOptionSelected] = useState<
    "Seus palpites" | "Ranking dos grupos"
  >("Seus palpites");
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );

  const toast = useToast();

  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function handleCodeShare() {
    try {
      await Share.share({
        message: `Olha o código do bolão: ${poolDetails.code}`,
      });
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível compartilhar o código do bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const poolDetailsResponse = await api.get(`/pools/${id}`);
      const poolDetails = poolDetailsResponse.data.pools;
      setPoolDetails(poolDetails);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível buscar os detalhes do bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={selectedOption === "Seus palpites"}
              onPress={() => setOptionSelected("Seus palpites")}
            />
            <Option
              title="Ranking dos grupos"
              isSelected={selectedOption === "Ranking dos grupos"}
              onPress={() => setOptionSelected("Ranking dos grupos")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} onShare={handleCodeShare} />
      )}
    </VStack>
  );
}
