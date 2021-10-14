const express = require('express');
const session = require('express-session');
const MongoStore = require ('connect-mongo');
const flash = require('connect-flash')
const markdown = require('marked')
const app = express()
const sanitizeHTML = require('sanitize-html')

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

// this function is running for every request
app.use(function(req, res, next) {
    //markdown function available
    res.locals.filterUserHTML = function(content){
        return sanitizeHTML(markdown(content), {allowedTags:['p', 'br', 'li', 'ul', 'ol', 'strong', 'bold', 'i', 'em', 'h1','h2', 'h3', 'h4', 'h5', 'h6'], allowAttributes:{}}) 
    }

    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")
    // make current user id available on the req object
    if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}
    
    // make user session data available from within view templates
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