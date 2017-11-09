const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

const app = express();


//serve static files
app.use(express.static('public'));
app.use('/scripts', express.static('node_modules'));

app.use(session({
    secret: "test1234",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// Generate Password
const saltRounds = 10
const myPlaintextPassword = 'test1234'
const salt = bcrypt.genSaltSync(saltRounds)
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

const user = {
    username: 'vitor',
    passwordHash,
    id: 1
}
  
const findUser = (username, callback)=>{
    if (username === user.username) {
        return callback(null, user)
    }
    return callback(null)
}

const authenticate = ()=>{
    return (req,res,next)=>{
        console.log(req.isAuthenticated())
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }
}

passport.serializeUser(function (user, callback) {
    callback(null, user.username)
})
  
passport.deserializeUser(function (username, callback) {
    findUser(username, callback)
})

passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          console.log('User not found')
          return done(null, false)
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
    }
))

passport.authenticationMiddleware = authenticate;

app.get('/test', passport.authenticationMiddleware(), (req,res)=>{
    res.send('hello')
})

app.post('/login', passport.authenticate('local', {failiureRedirect: '/login'}), (req,res)=>{
    res.redirect('/');
})

app.get('/login', (req,res)=>{
    res.send("login strana");
})





























app.get('/', (req,res)=>{
    res.redirect('/app');
});

app.get('/links', (req,res)=>{
    res.send('<a href="/github">Github</a><br/><a href="/json">JSON</a>'
    + '<br/><a href="/app">Home</a>');
});

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

//serve homepage
/*app.get('/home', (req,res)=>{
    res.sendFile('public/app/index.html', {root: __dirname });
})*/

app.listen(9000);