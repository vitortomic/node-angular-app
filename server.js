const express = require('express');
const fetch = require('node-fetch');

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');

const app = express();

/*
    Authentication settings
*/

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
    {
      domain: 'vitortomic.eu.auth0.com',
      clientID: 'brtY31LObGY6XFdurI4vSv0qIN05Nb8x',
      clientSecret: '8NFaBa6fzho2IW_7L6LztKUqUc18HlmvTeZNIgOSbkKxHNB0h_4Sf1rYKbZS5CVn',
      callbackURL: 'http://localhost:9000/callback'
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      return done(null, profile);
    }
);

const env = {
    AUTH0_CLIENT_ID: 'brtY31LObGY6XFdurI4vSv0qIN05Nb8x',
    AUTH0_DOMAIN: 'vitortomic.eu.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost:9000/callback'
};

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(
    session({
      secret: 'test1234',
      resave: true,
      saveUninitialized: true
    })
  );
app.use(passport.initialize());
app.use(passport.session());

/*
    Authentication settings end
*/

//serve static files
app.use(express.static('public'));
app.use('/scripts', express.static('node_modules'));


const authenticate = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req.path;
    //console.log(req.session.returnTo);
    res.redirect('/login');
}

// Perform the login
app.get(
    '/login',
    passport.authenticate('auth0', {
      clientID: env.AUTH0_CLIENT_ID,
      domain: env.AUTH0_DOMAIN,
      redirectUri: env.AUTH0_CALLBACK_URL,
      audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
      responseType: 'code',
      scope: 'openid'
    }),
    function(req, res) {
      res.redirect('/');
    }
);
  
// Perform session logout and redirect to homepage
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
  
// Perform the final stage of authentication and redirect to '/app'
app.get(
    '/callback',
    authenticate,
    function(req, res) {
      console.log(req.session.returnTo);
      res.redirect(req.session.returnTo || '/');
    }
);

app.get('/', (req,res)=>{
    //console.log(req.headers);
    res.send("asasas")
});

app.get('/links', authenticate, (req,res)=>{
    res.send('<a href="/github">Github</a><br/><a href="/json">JSON</a>'
    + '<br/><a href="/app">Home</a>');
});

//serve homepage
/*app.get('/home', (req,res)=>{
    res.sendFile('public/app/index.html', {root: __dirname });
})*/

app.get('/github', (req,res)=>{
    fetch('https://github.com/vitortomic/').then((response)=>response.text())
    .then((text)=>{
        res.send(text);
    });
});

app.get('/json', (req,res)=>{
    fetch('https://jsonplaceholder.typicode.com/posts').then((response)=>response.json())
    .then((json)=>{
        res.send(json);
    });
});

app.listen(9000);