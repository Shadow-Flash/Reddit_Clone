import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver {
    @Query(() => String)
    hello() {
        return "Welcome to Hello World !!";
    }
    
    @Query(() => String)
    noice() {
        return "Noice Thing to have you here !";
    }
}