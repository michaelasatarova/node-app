const User = require('../models/User')
const Post = require('../models/Post')

exports.mustBeLoggedIn = function(req, res, next){
  if(req.session.user){
      next()
  }else{
    req.flash("errors", "You must be loggged in to perform this action")
    req.session.save(function(){
      res.redirect
    })
  }
}

exports.login = function(req, res) {
  let user = new User(req.body)
  user.login().then(function(result) {
    req.session.user = {avatar: user.avatar, username: user.data.username,  _id:user.data._id}
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch(function(e) {
      //ten flash posle message ak je req invalidny v oboch pripadoch sme presmerovany na / page ale zobrazi sa nam iny obsah
    req.flash('errors', e)
    req.session.save(function() {
      res.redirect('/')
    })
  })
}

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/')
  })
}

exports.register = function(req, res) {
   //console.log(req.body)
  let user = new User(req.body)
  user.register().then(() => {
    req.session.user = {username: user.data.username, avatar: user.avatar, _id:user.data._id}
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch((regErrors) => {
    regErrors.forEach(function(error) {
      req.flash('regErrors', error)
    })
    req.session.save(function() {
      res.redirect('/')
    })
  })
}

exports.home = function(req, res) {
  //when user is log in
  if (req.session.user) {
    res.render('home-dashboard')
    //when user is not log in, flash tie errory z db automaticky vymaze po pouziti
  } else {
    res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
}

exports.ifUserExists = function(req, res, next) {
  User.findByUsername(req.params.username).then(function(userDocument) {
    req.profileUser = userDocument
    next()
  }).catch(function() {
    res.render("404")
  })
}

exports.profilePostsScreen = function(req, res){
  //ask our post model for posts by a  certain id
  Post.findByAuthorId(req.profileUser._id).then((posts)=>{
    res.render('profile', {
      posts: posts, 
      profileAvatar: req.profileUser.avatar,
      profileUsername: req.profileUser.username,
      
    })
  }).catch(()=>{
    res.render("404")
  })

}