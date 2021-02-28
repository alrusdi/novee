import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import passport from "passport";
import { setupPassport } from "./PassportSetup";
import path from "path";

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


const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send('You are not authorized to view this page. Consider <a href="/login">login</a>')
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Entry point for client application
app.get('/', isLoggedIn, (_, res) => {
    const indexFile = path.join(baseDir, '/client/index.html');
    res.sendFile(indexFile);
});

// Auth Routes
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/failed', (_, res) => res.send('You are Failed to log in!'))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    (_, res) => {
        // Successful authentication, redirect to the home page.
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

// start the express server
app.listen(port, async () => {

    // Add google auth credentials
    await setupPassport();

    console.log(`server started at http://localhost:${ port }`);
});
