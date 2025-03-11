import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AUTH_MESSAGES } from "@/app/constants";
import { prisma } from "@/app/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValid) {
          throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        try {
          const userWithAccounts = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              accounts: {
                select: {
                  provider: true,
                },
              },
            },
          });

          token.id = user.id;
          token.email = user.email;
          token.name = user.name;

          if (account) {
            token.provider = account.provider;
          } else if (userWithAccounts?.accounts.length) {
            token.provider = userWithAccounts.accounts[0].provider;
          } else {
            token.provider = "credentials";
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
};

