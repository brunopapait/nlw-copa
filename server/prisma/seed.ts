import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Bruno Papait',
      email: 'brunop@gmail.com',
      avatarUrl: 'http://github.com/brunopapait.png',
    }
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Bolão da copa',
      code: 'BOL123',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id
        },
      }
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-02T01:35:33.657Z',
      firstTeamCountryCode: 'BRA',
      secondTeamCountryCode: 'ARG',
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-03T01:35:33.657Z',
      firstTeamCountryCode: 'BRA',
      secondTeamCountryCode: 'DE',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 3,
          participant: {
            connect: {
              userId_poolId: {
                poolId: pool.id,
                userId: user.id
              }
            }
          }
        }
      }
    }
  });
}

main();