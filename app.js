let express = require('express');
let session = require('express-session');
const app = express()

let sessionOptions = session({
    secret: "Javascript is cool",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 *60*24, 
        httpOnly:true
    }
})

const router = require('./router');

qpp.use(sessionOptions)
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//sem nastviš folder kde su uložene všetky tvoje css img a ine subory
app.use(express.static('public'))
// to prve musi byt views to druhe je meno foldra kde  mas templates
app.set('views', 'views')
// to prve musi byt views engine to druhe je meno prípony pre files
app.set('view engine', 'ejs')


app.use('/', router)
//totot spojenie mame v db.js ze pocuva na ktorom porte
module.exports = app