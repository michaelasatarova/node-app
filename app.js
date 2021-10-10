let express = require('express');
const app = express()

const router = require('./router');


app.use(express.urlencoded({extended:false}))
app.use(express.json())

//sem nastviš folder kde su uložene všetky tvoje css img a ine subory
app.use(express.static('public'))
// to prve musi byt views to druhe je meno foldra kde  mas templates
app.set('views', 'views')
// to prve musi byt views engine to druhe je meno prípony pre files
app.set('view engine', 'ejs')


app.use('/', router)

app.listen(3000);