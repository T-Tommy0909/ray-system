import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import * as LocalStrategy from "passport-local";
import * as fs from "fs";
import * as crypto from "crypto";
import { prisma } from "./utils/prisma";
import { User } from "@prisma/client";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  void fastify.register(fastifyCors, {
    credentials: true,
    origin: "http://localhost:3000",
  });

  void fastify.register(fastifySecureSession, {
    key: fs.readFileSync(join(__dirname, "secret_key")),
  });
  void fastify.register(fastifyPassport.initialize());
  void fastify.register(fastifyPassport.secureSession());

  void fastifyPassport.use(
    "sessionAuth",
    new LocalStrategy.Strategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const userData = await prisma.user.findUnique({
          where: { email: email },
        });
        if (userData == undefined) {
          return done(null, false, {
            message: "ユーザー情報がありません",
          });
        }
        crypto.pbkdf2(
          password,
          userData.salt,
          310000,
          32,
          "sha256",
          (err, hashedPassword) => {
            if (err) {
              return done(err);
            }
            if (!crypto.timingSafeEqual(userData.password, hashedPassword)) {
              return done(null, false, {
                message: "メールアドレスまたはパスワードが異なります",
              });
            }
            return done(null, userData);
          }
        );
      }
    )
  );
  void fastifyPassport.registerUserSerializer(async (user: User) => user.id);
  void fastifyPassport.registerUserDeserializer(async (userId: number) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  });
};

export default app;
export { app, options };
