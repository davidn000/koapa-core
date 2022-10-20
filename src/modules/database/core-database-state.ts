import {DatabaseStateStatus} from "./core-database-enums";

export default class DatabaseState {
    private _state: { [prop: string]: any; };
    private _stateStatus: DatabaseStateStatus.IDLE;

    constructor(initialState: { [prop: string]: any }) {
        this._state = initialState;
    }

    // State related properties //
    public isStateIdle() {
        return this._stateStatus === DatabaseStateStatus.IDLE;
    }

    public setState(newStateObject) {
        this._state = newStateObject;
    }

    public mergeState(newState: DatabaseState | { [prop: string]: any }) {
        // Merge the new state with the old state
        newState = typeof newState === typeof DatabaseState ? newState.state : newState;
        this._state = {...this._state, newState};
    }

    public appendToStateKey(key: string, value: any) {
        this._state[key] = this._state[key] + value;
    }
    public setStateKey(key: string, value: any = null) {
        this._state[key] = value;
    }

    public  getStateKey(key: string): any
    {
        return this.state[key];
    }


    public get state() {
        return this._state;
    }


}