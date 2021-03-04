import { RedisClient } from 'redis';
import { DataStorage } from './Base';

export class RedisStorage implements DataStorage {
    private redisClient: RedisClient

    constructor(connectionString: string) {
        this.redisClient = new RedisClient({url: connectionString})
    }
    set(key: string, dataJson: string): void {
        this.redisClient.set(key, dataJson);
    }
    getAll(matchExpression: string, onSuccess: (data: Array<string>) => void): void {
        this.redisClient.keys(matchExpression, (err, keys) => {
            if (err) {
                console.error(err);
                onSuccess([]);
                return
            }

            if ( ! keys.length) {
                onSuccess([]);
                return;
            }

            this.redisClient.mget(keys, (err, results) => {
                if (err) {
                    console.error(err);
                    onSuccess([]);
                    return;
                }
                onSuccess(results);
            })
        });
    }
}
