import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImage from "../assets/logo.svg";
import usersAvatarExampleImage from "../assets/users-avatar-example.png";
import iconeCheckedImage from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState<string>("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso, o código foi criado para área de transferência"
      );

      setPoolTitle("");
    } catch (error) {
      alert("Erro ao criar o bolão");
      console.log(error);
    }
  }

  return (
    <div className="max-w-[1124px] mx-auto grid grid-cols-2 items-center h-screen">
      <main>
        <Image src={logoImage} alt="Logo" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos !
        </h1>

        <div className="mt-10 flex items-center gap-2 ">
          <Image src={usersAvatarExampleImage} alt="" />
          <strong className="text-gray-100  text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input
            value={poolTitle}
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            onChange={(event) => setPoolTitle(event.target.value)}
            required
            placeholder="Qual o nome do seu bolão ?"
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconeCheckedImage} alt="Ícone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconeCheckedImage} alt="Ícone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação movél da NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
    revalidate: 10000, // 10 minutos
  };
};
