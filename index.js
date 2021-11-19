const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Binance = require('node-binance-api');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const User = require('./models/user')
const Note = require('./models/note')
let data = [];


  const db = mongoose.connection;
app.use(session({ secret: 'notagoodsecret' }))
 
mongoose.connect('mongodb://localhost:27017/web-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })



app.use(session({ secret: 'secret' }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

function catchAsync() {
    return (req, res, next) => {
        catchAsync(req, res, next).catch(next);
    }
}
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

app.get('/',async(req,res)=>{
    const id =req.session.user_id;
    const foundUser = await User.findById(id).populate('note');
    if(foundUser){
        res.render('home',{foundUser});
    }

    else{res.render('home2');}
       
    
   
})


app.get('/register',(req,res)=>{
    res.render("authorizations/register")
})
app.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;
    const newUser = new User({username,password});
    await newUser.save();
    req.session.user_id = newUser._id;
    res.render('home')
   console.log(req.body)
})


app.get('/new',async(req,res)=>{
    
    res.render("new")
})
app.post('/new',async(req,res)=>{
    const id =req.session.user_id;
    const foundUser = await User.findById(id);
    const newNote = new Note(req.body);
    foundUser.note.push(newNote)
    newNote.user = foundUser
    foundUser.save()
    newNote.save()
    res.render("home")
})
app.get('/edit',async(req,res)=>{
    
    res.render("edit")
})
app.put('/:id',async(req,res)=>{
    const id =req.session.user_id;
    const foundUser = await User.findById(id).populate('note');

    const newNote = await Note.findByIdAndUpdate
    res.render("edit")
})
app.get('/login',(req,res)=>{
    res.render("authorizations/login")
})
app.post('/login',async(req,res)=>{
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.render('home');
    }
    else {
        res.redirect('/login')
    }

})
app.get('/logout', (req, res) => {
    res.render("authorizations/logout")
})
app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login');
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
})