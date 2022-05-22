import { API, Task } from "../system/api";
import { LocalStorageModel } from "./local-storage.model";

export class TaskModel
{
    private id = 0;
    private tasks: Map<number, Task> = new Map();
    constructor(private model: LocalStorageModel<Task[]>)
    {
        this.id = Math.max(...this.model.data.map(item => item.id), 0);
        this.model.data.forEach(task => this.tasks.set(task.id, task));
    }
    /** Создать новую задачу, логин подставляется автоматически */
    async newTask(description: string, text: string, date: number)
    {
        const task: Task = {
            id: ++this.id,
            description,
            login: API.authorization.login,
            text,
            date: date || new Date().getTime(),
            isDone: false
        }
        this.model.data.push(task);
        this.model.update();
        this.tasks.set(task.id, task);
    }
    /** Обновить задачу */
    async updateTask(id: number, isDone: boolean)
    {
        const task = this.tasks.get(id);
        if(task)
            task.isDone = isDone;
        this.model.update();
    }
    /** Удалить задачу */
    async removeTask(id: number)
    {
        this.tasks.delete(id);
        for(let i = 0; i < this.model.data.length; i++)
            if(this.model.data[i].id === id)
            {
                this.model.data.splice(i, 1);
                break;
            }
        this.model.update();
    }
    /** Получить список задач на день */
    async getTaskByDate(date: number): Promise<Task[]>
    {
        const out: Task[] = [];
        const beginDate = date;
        const endDate = date + 24 * 60 * 60 * 1000;
        this.forEach(task => {
            if(task.date >= beginDate && task.date < endDate)
                out.push(task);
        });
        return out;
    }
    /** Получить список дней, в которых есть задачи */
    async getEventsForAll(): Promise<number[]>
    {
        const out: number[] = [];
        this.forEach(task => out.push(task.date));
        return out;
    }
    /** Проход по всем задачам в базе */
    private forEach(func: (task: Task) => void)
    {
        for(let i = 0; i < this.model.data.length; i++) {
            const task = this.model.data[i];
            if(task.login === API.authorization.login)
                func(task);
        }
    }
}