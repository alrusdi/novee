import { Account } from './Account';
import { StorageManager } from '../storage/StorageManager';

export class AccountManager {
    private static accounts: Array<Account>;

    static getById(accountId: string): Account | undefined {
        return AccountManager.accounts.find((a) => a.id === accountId);
    }

    static getByOpenId(openId: string): Account | undefined {
        return AccountManager.accounts.find((a) => a.openId === openId);
    }

    static create(openId: string, nickname: string): Account {
        const acc = new Account(openId);
        acc.nickname = nickname;
        AccountManager.accounts.push(acc);
        AccountManager.save(acc);
        return acc;
    }

    static save(account: Account) {
        const key = 'accounts:' + account.id;
        StorageManager.get().set(key, JSON.stringify(account));
    }

    static async loadAll(next = () => {}) {
        const storage = StorageManager.get();
        storage.getAll('accounts:*', (data: Array<string>) => {
            const accounts = data.map((acc) => JSON.parse(acc));
            AccountManager.accounts = accounts;
            console.log('Loaded ' + accounts.length + ' accounts from db');
            next();
        })
    }
}
