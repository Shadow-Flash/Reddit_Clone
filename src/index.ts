import "reflect-metadata"; 
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./contants";
// import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
const redis = require("redis");
import session from "express-session";
import connectRedis from "connect-redis";

const main = async() => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
        host: '127.0.0.1',
        port: 6379,
    })
    redisClient.on('error', (err: string) => {
        console.log('Error ' + err);
    });
    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true 
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
                httpOnly: true,
                // secure: true, //cookie only works in https 
                sameSite: "lax" //csfr
            },
            saveUninitialized: false,
            secret: 'blahblahblahblacksheep',
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}) => ({ em:orm.em, req, res })
    })
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: { credentials: true, origin: "localhost:2022/graphql" }});

    app.listen(2022, () => {
        console.log('server started on localhost:2022');
    })
}

main();
