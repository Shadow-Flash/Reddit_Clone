import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Mutation, Arg, Field, Ctx, ObjectType, Query } from "type-graphql"; 
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../contants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {em} : MyContext
    ) {
        const user = await em.findOne(User, {email});
        return {user};
    }

    @Query(() => User, { nullable: true})
    async me(
        @Ctx() {em, req}: MyContext
    ) {
        if(!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User, {id: req.session.userId});
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) return {errors};
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                username: options.username,
                password: hashedPassword,
                email: options.email,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning("*");
            user = result[0];
        }
        catch (err) {
            return {
                errors: [{
                    field: "username",
                    message: "username already exsits"
                }]
            }
        };
        req.session.userId = user.id;
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, usernameOrEmail.includes('@') ? {email: usernameOrEmail} : {username: usernameOrEmail});
        if(!user) {
            if(usernameOrEmail.includes('@')){
                return {
                    errors: [{
                        field: "email",
                        message: "email does't exists"
                    }]
                }
            }
            return {
                errors: [{
                    field: "username",
                    message: "username does't exists"
                }]
            }
        }
        const valid = await argon2.verify(user.password, password);
        if(!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }]
            }
        }
        req.session.userId = user.id;
        return {user};
    }

    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: MyContext) {
        return new Promise(resolve => req.session.destroy(err => {
            if(err) {
                resolve(false)
            }
            else {
                res.clearCookie(COOKIE_NAME);
                resolve(true);
            }
        }))
    }
} 