const express = require('express');
const fetch = require('node-fetch');
const app = express();

//serve static files
app.use(express.static('public'));
app.use('/scripts', express.static('node_modules'));

app.get('/', (req,res)=>{
    console.log(req.headers);
    res.redirect('/app');
});

app.get('/links', (req,res)=>{
    console.log(req.headers);
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