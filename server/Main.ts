import * as dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import passport from 'passport';
import { setupPassport } from './PassportSetup';
import path from 'path';
import { Dispatcher } from './api/Dispatcher';
import { AccountManager } from './account/AccountManager';
import { StorageManager } from './storage/StorageManager';
import { GameManager } from './game/GamesManager';

const app = express();
const port = process.env.PORT || 8080;
const baseDir = path.resolve(path.join(__dirname + '../../../'))

// parse application/json
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'novee-ts-session',
    keys: ['key1', 'key2']
}));

app.use("/dist", express.static(baseDir + '/dist'));
app.use("/assets", express.static(baseDir + '/assets'));

const handleFile = (res: any, fileName: string = '/client/index.html') => {
    res.sendFile(path.join(baseDir, fileName));
}

const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.user) {
        next();
    } else {
        if (req.originalUrl.includes('/invite/')) {
            req.session.returnTo = req.originalUrl;
        };
        handleFile(res, '/client/anonymous.html');
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Entry point for client application
app.get('/', isLoggedIn, (_, res) => {
    handleFile(res, '/client/index.html');
});

app.get('/invite/*', isLoggedIn, (_, res) => {
    handleFile(res, '/client/index.html');
});

app.get('/game/*', isLoggedIn, (_, res) => {
    handleFile(res, '/client/index.html');
});

// Auth Routes
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/failed', (_, res) => res.send('You are Failed to log in!'))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    (req: any, res) => {
        // Successful authentication
        let redirectTo = '/';
        if (req.session.returnTo)
        {
            redirectTo = req.session.returnTo;
        }
        res.redirect(redirectTo);
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


// API routes
app.get('/api/*', isLoggedIn, (req, res) => {
    const accounId = (req.user || "").toString()
    const resp = Dispatcher.handleGetRequest(accounId, req.url)
    res.json(resp);
});

app.post('/api/*', isLoggedIn, (req, res) => {
    const accounId = (req.user || "").toString()
    const resp = Dispatcher.handlePostRequest(accounId, req.url, req.body)
    res.json(resp);
});

// Start the express server
app.listen(port, async () => {

    // Add google auth credentials
    await setupPassport();
    
    StorageManager.init(process.env.STORAGE_CONNECTION_STRING || "");
    AccountManager.loadAll(() => {
        GameManager.loadAll();
    });

    console.log(`server started at http://localhost:${ port }`);
});
