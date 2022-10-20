import DatabaseExpressionChain from "./core-db-expression-chain"

export interface DatabaseExpressionChainList {
    [columnName: string]: DatabaseExpressionChain;
}

export interface DatabaseCallStackComponent {
    methodName: string,
    methodChainableWithWhere?: boolean,
    
}
