export class PagingModel<T> {
    public data: T[] = [];
    public page: number = 1;
    public limit: number = 20;
    public total: number = 0;
    public pages?: number;
    public statistic?: any;

    constructor(paging = null) {
        for (const key in paging) {
            if (paging.hasOwnProperty(key)) {
                this[key] = paging[key];
            }
        }
    }
    public selection = [20, 40, 60];

    public get begin(): number {
        return Math.min((this.page - 1) * this.limit + 1, this.total);
    }

    public get end(): number {
        return Math.min(this.page * this.limit, this.total);
    }
}


export class PagingModelAppendable<T> extends PagingModel<T> {
    public add(value: T) {
        this.data.push(value);
        this.updateTotalPage();
    }

    public edit(index: number, value: T) {
        this.data[index] = value;
    }

    public remove(index: number): T {
        if (index > this.data.length) {
            return null;
        }
        const item: T = this.data[index];
        this.data.splice(index, 1);
        this.updateTotalPage();
        return item;
    }

    public updateTotalPage() {
        this.total = this.data.length;
    }
}