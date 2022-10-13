import { type } from "os";

export default class WhereColumn {
    private readonly _columnName: string;
    private _oldExpression: string;
    private _currentExpression: string;
    public constructor(columnName:string, oldExpression: string = "") {
        this._oldExpression = oldExpression;
        this._columnName = columnName;
        this._currentExpression = columnName;
    }

    public get currentExpression(): string {
        return this._currentExpression;
    }

    public get oldExpression(): string {
        return this._oldExpression;
    }
    public get columnName(): string {
        return this._columnName;
    }

    public set currentExpression(value: string) {
        this._currentExpression = value;
    }

    public set oldExpression(value: string) {
        this._oldExpression = value;
    }


    public and(whereColumn: WhereColumn): WhereColumn 
    {
        whereColumn.oldExpression = 'AND ';
        return whereColumn;
    }

    public evalToString(): string {
        return this._currentExpression;
    }
    
    public greaterThan(value: any): WhereColumn {
        if (typeof value === typeof WhereColumn) {
            value = value.columnName;
        }
        const newExpression = this._oldExpression + `${this._currentExpression} > ${value}`;
        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;
        return this;
    }

    public equals(value: any): WhereColumn {
        if (typeof value === typeof WhereColumn) {
            value = value.columnName;
        }

        const newExpression = this._oldExpression + `${this._currentExpression} = ${value}`;
        
        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;
        return this;
    }

    public doesNotEquals(value: any): WhereColumn {
        if (typeof value === typeof WhereColumn) {
            value = value.columnName;
        }
        const newExpression = this._oldExpression + `${this._currentExpression} != ${value}`;
        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;
        return this;
    }

}