import { KoapaEnv, KoapaError } from "../__loader__";
import { DatabaseExpressionChainState } from "./core-database-enums";

export default class DatabaseExpressionChain {
    private readonly _columnName: string;
    private _oldExpression: string;
    private _currentExpression: string;
    private _state: DatabaseExpressionChainState = DatabaseExpressionChainState.ACTIVE;

    public constructor(columnName: string, oldExpression: string = "") {
        this._oldExpression = oldExpression ?? "";
        this._columnName = columnName;
        this._currentExpression = columnName;
    }

    public get state(): DatabaseExpressionChainState {
        return this._state;
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


    public and(databaseExpressionChain: DatabaseExpressionChain): DatabaseExpressionChain {
        if (databaseExpressionChain === undefined) {
            throw new KoapaError({
                message: "Cannot use undefined as an 'and' check paramter.",
                status: KoapaEnv.KoapaErrorCode.DATABASE_UNDEFINED_CHAIN_COMPONENT_PARAMATER
            });
        }
        databaseExpressionChain.oldExpression = this._currentExpression + ' AND ';
        this._state = DatabaseExpressionChainState.ACTIVE;
        return databaseExpressionChain;
    }

    public evalToString(): string {
        return this._currentExpression;
    }

    public greaterThan(value: any): DatabaseExpressionChain {
        if (value === undefined) {
            throw new KoapaError({
                message: "Cannot use undefined as an 'greaterThan' check paramter.",
                status: KoapaEnv.KoapaErrorCode.DATABASE_UNDEFINED_CHAIN_COMPONENT_PARAMATER
            });
        }

        if (typeof value === typeof DatabaseExpressionChain) {
            value = value.columnName;
        }
        const newExpression = this._oldExpression + `${this._currentExpression} > ${value}`;
        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;


        this._state = DatabaseExpressionChainState.COMPLETED;
        return this;
    }
    public lessThan(value: any): DatabaseExpressionChain {
        if (value === undefined) {
            throw new KoapaError({
                message: "Cannot use undefined as an 'lessThan' check paramter.",
                status: KoapaEnv.KoapaErrorCode.DATABASE_UNDEFINED_CHAIN_COMPONENT_PARAMATER
            });
        }

        if (typeof value === typeof DatabaseExpressionChain) {
            value = value.columnName;
        }
        const newExpression = this._oldExpression + `${this._currentExpression} < ${value}`;
        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;
        this._state = DatabaseExpressionChainState.COMPLETED;
        return this;
    }

    public equals(value: any): DatabaseExpressionChain {
        if (value === undefined) {
            throw new KoapaError({
                message: "Cannot use undefined as an 'equals' check paramter.",
                status: KoapaEnv.KoapaErrorCode.DATABASE_UNDEFINED_CHAIN_COMPONENT_PARAMATER
            });
        }
        if (typeof value === typeof DatabaseExpressionChain) {
            value = value.columnName;
        }

        const newExpression = this._oldExpression + `${this._currentExpression} = ${value}`;

        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;
        this._state = DatabaseExpressionChainState.COMPLETED;
        return this;
    }

    public doesNotEquals(value: any): DatabaseExpressionChain {
        if (value === undefined) {
            throw new KoapaError({
                message: "Cannot use undefined as an 'doesNotEquals' check paramter.",
                status: KoapaEnv.KoapaErrorCode.DATABASE_UNDEFINED_CHAIN_COMPONENT_PARAMATER
            });
        }
        if (typeof value === typeof DatabaseExpressionChain) {
            value = value.columnName;
        }
        const newExpression = this._oldExpression + `${this._currentExpression} != ${value}`;
        this._currentExpression = newExpression;
        this._oldExpression += this._currentExpression;
        this._state = DatabaseExpressionChainState.COMPLETED;
        return this;
    }

}