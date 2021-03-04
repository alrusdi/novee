import * as dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AccountManager } from './account/AccountManager';

export const setupPassport = async () => {
    passport.serializeUser((accountId, done) => {
        done(null, accountId);
    });

    passport.deserializeUser(async (accountId: string, done) => {
        done(null, accountId || 'error');
    });

    passport.use(new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_COLBACK_URL
        },
        async (_accessToken, _refreshToken, profile, done) => {
            const openId = profile.provider + ':' + profile.id;
            let account = AccountManager.getByOpenId(openId);
            if (account === undefined) {
                account = AccountManager.create(openId, profile.displayName);
            }
            const accountId = account.id;
            return done(undefined, accountId);
        }
    ));
}
