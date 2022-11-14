import React, { useEffect, useState } from "react";
import { useToast } from "native-base";
import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { FlatList, Share } from "react-native";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState<string>("");
  const [secondTeamPoints, setSecondTeamPoints] = useState<string>("");

  const toast = useToast();

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Preencha os placar dos palpites",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite enviado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Erro ao enviar palpites",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchGames() {
    try {
      setIsLoading(true);

      const gamesResponse = await api.get(`/pools/${poolId}/games`);
      setGames(gamesResponse.data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível buscar os jogos do bolão !",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  async function handleShareCode() {
    try {
      await Share.share({
        message: `Olha o código do bolão: ${code}`,
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

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={
        <EmptyMyPoolList code={code} onShare={handleShareCode} />
      }
    />
  );
}
