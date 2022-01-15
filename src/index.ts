import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./contants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async() => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();
    // const post = orm.em.create(Post,{title: 'my first post'});
    // await orm.em.persistAndFlush(post);
    // const post = await orm.em.find(Post,{});
    // console.log(post);
}

main();
