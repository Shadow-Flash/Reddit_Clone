import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
    let emailErr = [{
            field: "email",
            message: "email is not valid",
        }]
    if(!options.email.includes('@')) {
        if(options.email.length < 5) {
            return emailErr;
        }
        return emailErr;
    };
    if(options.username.length < 5) {
        return [
            {
            field: "username",
            message: "lenght must be greater than 5",
        }]
    };
    if(options.password.length < 6) {
        return [
        {
            field: "password",
            message: "lenght must be greater than 6",
        }]
    };

    return null;
}