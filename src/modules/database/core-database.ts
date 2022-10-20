import { Database, Statement } from "bun:sqlite";
import KoapaError from "../errors/koapa-error";
import { KoapaEnv } from "../__loader__";
import { DatabaseExpressionChainState } from "./core-database-enums";
import { DatabaseCallStackComponent, DatabaseExpressionChainList } from "./core-database-types";
import DatabaseExpressionChain from "./core-db-expression-chain";
import DatabaseState from "./core-database-state";
import DatabaseCallStack from './core-database-call-stack';

/**
 * @class CoreDatabase
 * @singleton
 * @classdesc CoreDatabase is a class that provides a syncronous database connection using Bun's bundled databases. It uses SQLite3 and will act as a modular component that can be replaced for an alternative system.
 * @todo Add state to the database to allow for memory storage of previously completed queries and chaining.
 */
export default class CoreDatabase {
  private readonly _database: Database;
  private readonly _state: DatabaseState;
  private _callStack: DatabaseCallStack; // will

  private static methodSignatures = {
    select: {
      methodName: 'select',
      methodChainableWithWhere: true
    } as DatabaseCallStackComponent,
    update: {
      methodName: 'update',
      methodChainableWithWhere: true
    } as DatabaseCallStackComponent,
    delete: {
      methodName: 'delete',
      methodChainableWithWhere: true
    } as DatabaseCallStackComponent,
    insert: {
      methodName: 'insert',
      methodChainableWithWhere: false
    } as DatabaseCallStackComponent,
    where : {
      methodName: 'where',
      methodChainableWithWhere: false
    } as DatabaseCallStackComponent,
    createTable: {
      methodName: 'createTable',
      methodChainableWithWhere: false
    } as DatabaseCallStackComponent,
    dropTable: {
      methodName: 'dropTable',
      methodChainableWithWhere: false
    } as DatabaseCallStackComponent,
    dropDatabase: {
      methodName: 'dropDatabase',
      methodChainableWithWhere: false
    } as DatabaseCallStackComponent,


  };

  public constructor() {
    this._database = new Database("koapa-core.db"); // for now, all databases will be kept inline with the application, however eventually I would like to see it migrate to a hybrid system where the database is either kept on the server if in active use, and in amazon s3 if not.
    
    // State initialization //
    this._state = new DatabaseState({}); // Empty state for now, will later be DatabaseStateObject
    this._state.setStateKey('builtQuery', '');
    // End state initialization //
    
    // Call stack initialization // 
    this._callStack = new DatabaseCallStack();
    // End call stack initialization //
  }

  public get state(): DatabaseState {
    return this._state;
  }

  public get callStack(): DatabaseCallStack {
    return this._callStack;
  }

  public get database(): Database {
    return this._database;
  }

  
  /**
   * A simple check that throws an error if the most recent method in the stack is not chainable with where.
   * @returns {boolean} true if the where method can be called, throws an error if not
   */
  private expressionWhereChainableCheck(): boolean {
    console.log(this.callStack.getFullStack());
    if (this.callStack.peek().methodChainableWithWhere === true) {
      return true;
    } else {
      throw new KoapaError({
        message: "Preceding method is not chainable with where()",
        status: KoapaEnv.KoapaErrorCode.DATABASE_WHERE_EXPRESSION_NOT_CHAINABLE
      });
    }
  }

  /**
   * Executes a built query, and allows for an intermediery step to look at the query before it is executed.
   * @returns {void}
   */
  public execute(): void {
    this.database.exec(this.state.getStateKey('builtQuery'));
    this.state.setStateKey('builtQuery', null);
    this.callStack.clear();
  }


  // Printing - Logging  methods //
  public printCurrentQuery(): CoreDatabase {
    console.log(this.state.getStateKey('builtQuery'));
    return this;
  }

  public printCallStack(): CoreDatabase {
    console.log(this.callStack.getFullStack);
    return this;
  }

  // End printing and logging methods // 


  public createTable(tableName: string, columns: {
    name: string,
    type: string,
    primaryKey?: boolean,
    autoIncrement?: boolean,
    notNull?: boolean,
    unique?: boolean,
    default?: string
  }[]): CoreDatabase {
    let query = `CREATE TABLE ${tableName}
    (`;
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
    // this._database.exec(query);
    this.state.appendToStateKey('builtQuery', query);
    this.callStack.push(CoreDatabase.methodSignatures.createTable); // should be the last step because that means the call was successful
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
    // this._database.query(query);
    this.state.appendToStateKey('builtQuery', query);
    this.callStack.push(CoreDatabase.methodSignatures.insert);
    return this;
  }

  /**
   * A chained call that allows for clauses to queries. Example request:
   * db.select('users', {username}).where((columns) => {return columns.userid.});
   * @param callback The callback function that returns a boolean
   */
  public where(callback: (columns: DatabaseExpressionChainList) => any): void | Statement {
    this.expressionWhereChainableCheck(); // Will throw an error if the preceding method is not chainable with where

    /** List of all columns */
    const columnsObj = {
      userid: new DatabaseExpressionChain('userid'),
      username: new DatabaseExpressionChain('username'),
      password: new DatabaseExpressionChain('password'),
    } as DatabaseExpressionChainList;


    const callbackReturnedData = callback(columnsObj);
    if (callbackReturnedData.state === DatabaseExpressionChainState.COMPLETED) {
      // Chain was succesful, and it means we have a completed query string as the return
      const callbackReturnedQueryString = callbackReturnedData.evalToString() as string;
      console.log(callbackReturnedQueryString);

      let fullQueryString = this.state.getStateKey('builtQuery') + ` WHERE ${callbackReturnedQueryString}`;
      console.log(fullQueryString);
      this.callStack.push(CoreDatabase.methodSignatures.where);
      return this._database.run(fullQueryString);
    } else {
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
    let query = `SELECT `;
    columns.forEach((column, index) => {
      query += `${column}`;
      if (index < columns.length - 1) {
        query += `, `;
      }
    });
    query += ` FROM ${tableName}`;
    // this._database.query(query);
    
    this.state.appendToStateKey('builtQuery', query);
    this.callStack.push(CoreDatabase.methodSignatures.select);
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
    this.state.appendToStateKey('builtQuery', query);
    this.callStack.push(CoreDatabase.methodSignatures.update);
    return this;
  }

  public delete(tableName: string, columns: {
    name: string,
    value: string
  }[]): CoreDatabase {
    
    let query = `DELETE
                     FROM ${tableName}
                     WHERE `;
    columns.forEach((column, index) => {
      query += `${column.name} = '${column.value}'`;
      if (index < columns.length - 1) {
        query += `, `;
      }
    });
    this.state.appendToStateKey('builtQuery', query);
    this.callStack.push(CoreDatabase.methodSignatures.delete);
    return this;
  }

  public dropTable(tableName: string): CoreDatabase {
    this.state.appendToStateKey('builtQuery', `DROP TABLE ${tableName}`);
    this.callStack.push(CoreDatabase.methodSignatures.dropTable);
    return this;
  }

  public dropDatabase(): CoreDatabase {    
    this.state.appendToStateKey('builtQuery', `DROP DATABASE`);
    this.callStack.push(CoreDatabase.methodSignatures.dropDatabase);
    return this;
  }


}

