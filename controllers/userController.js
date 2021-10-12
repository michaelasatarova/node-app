
const User = require('../models/User')

exports.login = function(req, res){
    let user = new User(req.body)
    user.login().then(function(result){
        res.send(result)
    }).catch(function(e){
        res.send(e)
    })
}

exports.logout = function(){

}

exports.register = function(req, res){
    //console.log(req.body)
    let user = new User(req.body)
    user.register()
    if(user.errors.length > 0){
        res.send(user.errors)
    }else{
        res.send("Congrats")
    }
}

exports.home = function(req, res){
    res.render('home-guest')
}