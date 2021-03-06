import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Mutation, Arg, Field, Ctx, ObjectType, Query, FieldResolver, Root } from "type-graphql"; 
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../contants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import {v4} from "uuid";
import { getConnection } from "typeorm";

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

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() {req}: MyContext){
        if (req.session.userId === user.id) return user.email;
        return "";
    }
    
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, req} : MyContext
    ): Promise<UserResponse> {
        if(newPassword.length < 6) {
            return {errors:[
            {
                field: "newPassword",
                message: "lenght must be greater than 6",
            }]}
        };
        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if(!userId)
        return {errors:[
            {
                field: "token",
                message: "token expired",
            }]
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);
        if(!user) {
            return {errors:[
                {
                    field: "token",
                    message: "user no longer exists",
                }]
            } 
        }
        await User.update({id: userIdNum}, {password: await argon2.hash(newPassword)});
        await redis.del(key);
        req.session.userId = user.id;
        return {user};
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {redis} : MyContext
    ) {
        const user = await User.findOne({where:{email}});
        if(!user){
            return true;
        }
        const token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3 )// 3days till it expires
        const link = `<a href='http://localhost:3000/changepassword/${token}'>reset password</a>'`
        await sendEmail(email, link);
        return true;
    }

    @Query(() => User, { nullable: true})
    me(
        @Ctx() {req}: MyContext
    ) {
        if(!req.session.userId) {
            return null;
        }
        return User.findOne(req.session.userId);
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) return {errors};
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
                username: options.username,
                email: options.email,
                password: hashedPassword,
            })
            .returning("*")
            .execute();
            user = result.raw[0];
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
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(usernameOrEmail.includes('@') ? {where: {email: usernameOrEmail}} : {where: {username: usernameOrEmail}});
        if(!user) {
            if(usernameOrEmail.includes('@')){
                return {
                    errors: [{
                        field: "usernameOrEmail",
                        message: "email does't exists"
                    }]
                }
            }
            return {
                errors: [{
                    field: "usernameOrEmail",
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
        console.log("UserID: ---> ",req.session.userId);
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