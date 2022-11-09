import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";

// Singleton -> only one instance of the PrismaClient is created

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  // Colocar a secret key em um arquivo .env
  fastify.register(jwt, {
    secret: "nlwCopa2022",
  });

  fastify.register(poolRoutes);
  fastify.register(userRoutes);
  fastify.register(guessRoutes);
  fastify.register(authRoutes);
  fastify.register(gameRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
