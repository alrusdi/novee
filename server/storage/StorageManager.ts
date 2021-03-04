import { DataStorage } from './Base';
import { RedisStorage } from './RedisStorage';

export class StorageManager {
    private static storage: DataStorage;
    
    static init(connectionString: string) {
        if (connectionString.startsWith('redis:')) {
            StorageManager.storage = new RedisStorage(connectionString);
            return
        }
        throw new Error('Unsupported data storage for connection string:"' + connectionString + '"');
    }

    static get(): DataStorage {
        return StorageManager.storage;
    }
}