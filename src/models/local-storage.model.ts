export class LocalStorageModel<T>
{
    public data: T;
    constructor(private key: string, defaultValue: T)
    {
        const v = localStorage.getItem(this.key);
        if(v) this.data = JSON.parse(v);
        else this.data = defaultValue;
    }
    update()
    {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }
}
