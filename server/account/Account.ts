import { randomId } from '../Utils';

export class Account {
    public id: string;
    public nickname: string = "";

    constructor(public openId: string) {
        this.id = randomId();
    }
}
