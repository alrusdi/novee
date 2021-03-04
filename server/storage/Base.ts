export interface DataStorage {
    set(key: string, dataJson: string): void;
    getAll(matchExpression: string, onSuccess: (data: Array<string>) => void): void;
}