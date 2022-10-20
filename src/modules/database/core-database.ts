import { Database } from "bun:sqlite";
import KoapaError from "../errors/koapa-error";
import { KoapaEnv } from "../__loader__";
import { DatabaseExpressionChainState, DatabaseState } from "./core-database-enums";
import { DatabaseExpressionChainList } from "./core-database-types";
import DatabaseExpressionChain from "./core-db-expression-chain";


/**
 * @class CoreDatabase
 * @singleton
 * @classdesc CoreDatabase is a class that provides a syncronous database connection using Bun's bundled databases. It uses SQLite3 and will act as a modular component that can be replaced for an alternative system.
 * @todo Add state to the database to allow for memory storage of previously completed queries and chaining.
 */
export default class CoreDatabase {
    private _database: Database;
    private _stateStatus  : DatabaseState = DatabaseState.IDLE;
    private _expressionStack: string[]; // will



    public constructor() {
        this._database = new Database("koapa-core.db"); // for now, all databases will be kept inline with the application, however eventually I would like to see it migrate to a hybrid system where the database is either kept on the server if in active use, and in amazon s3 if not.
        this._state = {}; // Empty state for now, will later be DatabaseStateObject
        this.updateStateKey('canWhereBeCalled', false)
    }

    public get database(): Database {
        return this._database;
    }


    // State related properties //
    private _state: any;
    private checkState() {
        if (this._stateStatus === DatabaseState.IDLE) {
            return true;
        }else {
            return false;
        }
    }

    private setState(newStateObject)
    {
        this._state = newStateObject;
    }

    private updateState(newState: DatabaseState)
    {
        // Merge the new state with the old state
        this._state = {...this._state, newState};
    }

    private updateStateKey(key: string, value: any){
        this._state[key] = value;
    }

    private expressionWhereChainableCheck(): boolean {
        if (this._state.canWhereBeCalled === true) {
            return true;
        }else {
            throw new KoapaError({
                message: "Preceding method is not chainable with where()",
                status: KoapaEnv.KoapaErrorCode.DATABASE_WHERE_EXPRESSION_NOT_CHAINABLE
            });
        }
    }

    private getState(){
        return this._state;
    }

    public createTable(tableName: string, columns: {
        name: string,
        type: string,
        primaryKey?: boolean,
        autoIncrement?: boolean,
        notNull?: boolean,
        unique?: boolean,
        default?: string
    }[]): CoreDatabase {
        let query = `CREATE TABLE ${tableName} (`;
        columns.forEach((column, index) => {
            query += `${column.name} ${column.type}`;
            if (column.primaryKey) {
                query += ` PRIMARY KEY`;
            }
            if (column.autoIncrement) {
                query += ` AUTOINCREMENT`;
            }
            if (column.notNull) {
                query += ` NOT NULL`;
            }
            if (column.unique) {
                query += ` UNIQUE`;
            }
            if (column.default) {
                query += ` DEFAULT ${column.default}`;
            }
            if (index < columns.length - 1) {
                query += `, `;
            }
        });
        query += `)`;
        this._database.exec(query);
        return this;
    }

    
    /**
     * Inserts into a table in the database using the provided columns and values. Example request:
     * db.insert('users', {username: 'test', password: 'test', email: 'test'});
     * @param tableName The table to insert into
     * @param columns the key value pairs to insert into the table
     * @returns the CoreDatabase object for chaining
     */
    public insert(tableName: string, columns: Object): CoreDatabase {
        this.updateStateKey('canWhereBeCalled', false)
        let query = `INSERT INTO ${tableName} (`;
        let values = `VALUES (`;
        Object.keys(columns).forEach((column, index) => {
            query += `${column}`;
            values += `'${columns[column]}'`;
            if (index < Object.keys(columns).length - 1) {
                query += `, `;
                values += `, `;
            }
        });
        query += `) ${values})`;
        this._database.exec(query);
        return this;
    }
    
    /**
     * A chained call that allows for clauses to queries. Example request:
     * db.select('users', {username}).where((columns) => {return columns.userid.});
     * @param callback The callback function that returns a boolean
     */
    public where(callback: (columns: DatabaseExpressionChainList) => any) {
        this.expressionWhereChainableCheck();
        this.updateStateKey('canWhereBeCalled', false)

        /** List of all columns */
        const columnsObj = {
            userid: new DatabaseExpressionChain('userid'),
            username: new DatabaseExpressionChain('username'),
            password: new DatabaseExpressionChain('password'),
        } as DatabaseExpressionChainList;
        const callbackReturnedData = callback(columnsObj);
        if (callbackReturnedData.state === DatabaseExpressionChainState.COMPLETED) {
            // Chain was succesful, and it means we have a completed query string as the return
            const fullQueryString = callbackReturnedData.evalToString() as string;
            console.log(fullQueryString);
            this._database.exec(fullQueryString);
            return true;
        }else {
            throw new KoapaError(
                {
                    message: 'Error: The where clause chain was not completed. Check details for more details.', 
                    status: KoapaEnv.KoapaErrorCode.DATABASE_EXPRESSION_CHAIN_NOT_COMPLETED, 
                    details: {
                        expressionBeforeAndClause: callbackReturnedData._oldExpression,
                    }
                }
            );
        }
    }

    /**
     * Select from a table in the database using the provided columns. Example request:
     * db.select('users', {columns: ['username', 'password']});
     * @param tableName The table to select from
     * @param columns the columns to select from the table
     * @returns Bun's Statement object
     */
    public select(tableName: string, columns: string[]): CoreDatabase {
        this.updateStateKey('canWhereBeCalled', true)
        let query = `SELECT `;
        columns.forEach((column, index) => {
            query += `${column}`;
            if (index < columns.length - 1) {
                query += `, `;
            }
        });
        query += ` FROM ${tableName}`;
        this._database.query(query);
        return this;
    }

    public update(tableName: string, columns: {
        name: string,
        value: string
    }[]): CoreDatabase {
        this.updateStateKey('canWhereBeCalled', false)
        let query = `UPDATE ${tableName} SET `;
        columns.forEach((column, index) => {
            query += `${column.name} = '${column.value}'`;
            if (index < columns.length - 1) {
                query += `, `;
            }
        });
        this._database.exec(query);
        return this;
    }

    public delete(tableName: string, columns: {
        name: string,
        value: string
    }[]): CoreDatabase {
        this.updateStateKey('canWhereBeCalled', false)
        let query = `DELETE FROM ${tableName} WHERE `;
        columns.forEach((column, index) => {
            query += `${column.name} = '${column.value}'`;
            if (index < columns.length - 1) {
                query += `, `;
            }
        });
        this._database.exec(query);
        return this;
    }

    public dropTable(tableName: string): CoreDatabase {
        this.updateStateKey('canWhereBeCalled', false)
        this._database.exec(`DROP TABLE ${tableName}`);
        return this;
    }

    public dropDatabase(): CoreDatabase {
        this.updateStateKey('canWhereBeCalled', false)
        this._database.exec(`DROP DATABASE`);
        return this;
    }


}