
const bcrypt = require("bcryptjs")
const usersCollection = require('../db').collection("users")
const validator = require("validator")
let User = function(data){
    this.data = data
    this.errors = []
}


User.prototype.cleanUp = function(){
    if(typeof(this.data.username) != "string"){ this.data.username = ""}
    if(typeof(this.data.email) != "string"){ this.data.email = ""}
    if(typeof(this.data.password) != "string"){ this.data.password = ""}

    //get rid of any bogus properties
    this.data = {
        username:this.data.username.trim().toLowerCase(),
        email:this.data.email.trim().toLowerCase(),
        password:this.data.password
    }
}

//registration validation
User.prototype.validate = function(){
  if( this.data.username == ""){ this.errors.push("You must provide a username")}
  if( this.data.username != "" && !validator.isAlphanumeric(this.data.username)){ this.errors.push("Username can contain only letters and numbers")}
  if( this.data.email == ""){ this.errors.push("You must provide a valid email")}
  if(!validator.isEmail(this.data.email)){ this.errors.push("You must provide a valid email")}
  if( this.data.password == ""){ this.errors.push("You must provide a password")}
  if( this.data.password > 50){ this.errors.push("Password cyn not be longer tjhan 50")}
}

//tato metoda patri pod usera a je efektivnejsie ich vytvarat takto ako vo vnutry objktu, vyhneme sa duplikacii a nacitanie stranky bude rychlejsie
User.prototype.register = function(){
    //Step #1 validate user data
    this.cleanUp()
    this.validate()
    //Step #2 only if there are no validation errors save data to dataase
        if ( !this.errors.length ){
            //hash user password
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            usersCollection.insertOne(this.data)
        }
}

User.prototype.login = function(){
  return new Promise((resolve, reject)=>{
    usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
        // compare sync je metoda ktora ti umozni porovnat napr zahashovany password 
        if(attemptedUser &&  bcrypt.compareSync(this.data.password, attemptedUser.password)){
            resolve('Congrats')
        }else{
           reject('Invalid user data')
        }
    }).catch(function(){
        // atch is used when something is wrong with server
        reject("please try again later")
    })
  })
}

module.exports = User