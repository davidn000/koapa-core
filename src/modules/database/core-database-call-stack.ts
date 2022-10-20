import { DatabaseCallStackComponent } from "./core-database-types";


/**
 * @class DatabaseCallStack
 * @description This class is used to store the call stack of the database
 */
export default class  {
  private _callStack: DatabaseCallStackComponent[];
  constructor() {
    this._callStack = [];
  }

  public getFullStack() {
    return this._callStack;
  }

  public push(valueToPush: DatabaseCallStackComponent)
  {
    this._callStack.push(valueToPush);
  }

  public pop()
  {
    this._callStack.pop()
  }

  public peek()
  {
    return this._callStack[this._callStack.length - 1];
  }

  public clear(){
    this._callStack = [];
  }
}