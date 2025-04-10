"use server";

import prisma from "@/lib/prisma";

async function generateUniquePseudo(base: string) {
  let pseudo = base;
  let count = 1;
  while (await prisma.user.findUnique({ where: { pseudo } })) {
    pseudo = `${base}${count}`;
    count++;
  }
  return pseudo;
}

export async function checkAndAddUser(email: string, name: string) {
  if (!email) return;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser && name) {
      const basePseudo = name.toLowerCase().replace(/\s+/g, "-");
      const pseudo = await generateUniquePseudo(basePseudo);

      await prisma.user.create({
        data: { email, name, pseudo },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getUserInfo(identifiant: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifiant }, { pseudo: identifiant }],
      },
      select: { pseudo: true, theme: true },
    });

    return {
      pseudo: user?.pseudo,
      theme: user?.theme,
    };
  } catch (error) {
    console.error(error);
  }
}
