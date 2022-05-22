import { AuthorizationModel } from "../models/authorization.model"
import { LocalStorageModel } from "../models/local-storage.model"
import { RegistrationModel } from "../models/registration.model"
import { TaskModel } from "../models/task.model"

export interface Task
{
    id: number
    description: string
    text: string
    date: number
    login: string
    isDone: boolean
}

export interface User
{
    login: string
    password: string
    key?: string
}

export interface UserCookie
{
    login: string
    key: string
}

export const storage = {
    cookie: new LocalStorageModel<UserCookie>("cookie", { login: "", key: "" }),
    users: new LocalStorageModel<User[]>("users", []),
    tasks: new LocalStorageModel<Task[]>("tasks", [])
}

export const API: {
    registration: RegistrationModel
    authorization: AuthorizationModel
    tasks: TaskModel
} = {
    registration: new RegistrationModel(storage.users),
    authorization: new AuthorizationModel(storage.users, storage.cookie),
    tasks: new TaskModel(storage.tasks)
}