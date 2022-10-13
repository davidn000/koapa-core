import { Database, Statement } from "bun:sqlite";
import WhereColumn from "./core-where-column";

/**
 * @class CoreDatabase
 * @singleton
 * @classdesc CoreDatabase is a class that provides a syncronous database connection using Bun's bundled databases. It uses SQLite3 and will act as a modular component that can be replaced for an alternative system.
 */
export default class CoreDatabase {
    private _database: Database;

    public constructor() {
        this._database = new Database("koapa-core.db"); // for now, all databases will be kept inline with the application, however eventually I would like to see it migrate to a hybrid system where the database is either kept on the server if in active use, and in amazon s3 if not.
    }

    public get database(): Database {
        return this._database;
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
    public where(callback: (columns) => any) {

        const columnsObj = {
            userid: new WhereColumn('userid'),
            username: new WhereColumn('username'),
            password: new WhereColumn('password'),
        };
        callback(columnsObj);
        return this;
    }

    /**
     * Select from a table in the database using the provided columns. Example request:
     * db.select('users', {columns: ['username', 'password']});
     * @param tableName The table to select from
     * @param columns the columns to select from the table
     * @returns Bun's Statement object
     */
    public select(tableName: string, columns: string[]): CoreDatabase {
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
        this._database.exec(`DROP TABLE ${tableName}`);
        return this;
    }

    public dropDatabase(): CoreDatabase {
        this._database.exec(`DROP DATABASE`);
        return this;
    }


}