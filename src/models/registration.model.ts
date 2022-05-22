import { API, User } from "../system/api";
import { LocalStorageModel } from "./local-storage.model";

export class RegistrationModel
{
    private users: Map<string, User> = new Map();
    constructor(private model: LocalStorageModel<User[]>)
    {
        this.model.data.forEach(user => this.users.set(user.login, user));
    }
    registration(login: string, password: string)
    {
        if(this.users.get(login)) throw new Error("This login is already in use!");
        if(!password) throw new Error("Password field must be filled!");
        
        const user = {
            login,
            password
        }
        this.model.data.push(user);
        this.model.update();
        this.users.set(user.login, user);
    }
}