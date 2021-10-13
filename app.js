const express = require('express');
const session = require('express-session');
const MongoStore = require ('connect-mongo');
const flash = require('connect-flash')
const app = express()

let sessionOptions = session({
    secret: "Javascript is cool",
    resave: false,
    store: MongoStore.create({client: require('./db')}),
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 *60*24, 
        httpOnly:true
    }
})

const router = require('./router');

app.use(sessionOptions)
app.use(flash())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(function(req, res, next){
    res.locals.user = req.session.user
    next()
})


//sem nastviš folder kde su uložene všetky tvoje css img a ine subory
app.use(express.static('public'))
// to prve musi byt views to druhe je meno foldra kde  mas templates
app.set('views', 'views')
// to prve musi byt views engine to druhe je meno prípony pre files
app.set('view engine', 'ejs')


app.use('/', router)
//totot spojenie mame v db.js ze pocuva na ktorom porte
module.exports = app