
export enum DatabaseExpressionChainState
{
    ACTIVE,
    COMPLETED,
}

export enum DatabaseStateStatus {
    RUNNING_QUERY, // if its async, it will be in this state until the query is done
    IDLE, // default
    ERROR, // if there is an error, it will be in this state (general error)
    QUERY_SUCCESS, // if the query was successful, it will be in this state
    QUERY_ERROR, // if the query was unsuccessful, it will be in this state
}







