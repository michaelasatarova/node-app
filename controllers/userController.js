
const User = require('../models/User')
exports.login = function(){
    
}

exports.logout = function(){

}

exports.register = function(req, res){
    //console.log(req.body)
    let user = new User()
    res.send('Thanx for register')
}

exports.home = function(req, res){
    res.render('home-guest')
}