import { ref, Ref } from "vue";
import { User, UserCookie } from "../system/api";
import { LocalStorageModel } from "./local-storage.model";

export class AuthorizationModel
{
    private _login: Ref<string>;
    private users: Map<string, User> = new Map();
    constructor(
        private model: LocalStorageModel<User[]>,
        private cookie: LocalStorageModel<UserCookie>
    )
    {
        this.model.data.forEach(user => this.users.set(user.login, user));
        this._login = ref("");

        if(cookie.data.login)
        try {
            this.authorizationByKey(cookie.data.login, cookie.data.key);
        }
        catch(e)
        {
            this.logout();
        }
    }
    get isLoggedIn()
    {
        return this._login.value !== "";
    }
    get login()
    {
        return this._login.value;
    }
    async logout()
    {
        this._login.value = "";
        this.cookie.data = { login: "", key: "" };
        this.cookie.update();
    }
    async authorization(login: string, password: string): Promise<true | Error>
    {
        const user = this.users.get(login);
        if(user?.password === password) {
            this._login.value = login;
            user.key = this.getKey();

            this.cookie.data.login = user.login;
            this.cookie.data.key = user.key;
            
            this.model.update();
            this.cookie.update();
            return true;
        }
        throw new Error("Login or password is not valid!");
    }
    async authorizationByKey(login: string, key: string): Promise<true | Error>
    {
        const user = this.users.get(login);
        if(user?.key && user?.key === key) {
            this._login.value = login;
            return true;
        }
        throw new Error("Key is not valid!");
    }
    private S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    private getKey(map = "S4S4-S4-S4-S4-S4-S4S4S4"):string
    {
        return map.split("S4").reduce((prev, curr) => prev + this.S4() + curr);
    }
}