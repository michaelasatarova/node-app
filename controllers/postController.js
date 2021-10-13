const Post = require('../models/Post')

// display create post page
exports.viewCreateScreen = function(req, res) {
  res.render('create-post')
}

// sent data into db
exports.create = function(req, res) {
  let post = new Post(req.body, req.session.user._id)
  post.create().then(function() {
    res.send("New post created.")
  }).catch(function(errors) {
    res.send(errors)
  })
}

// get single post data from db
exports.viewSingle = async function(req, res){
  try{
    let post = await Post.findSingleById(req.params.id)
    res.render('single-post-screen', {post: post})
  }catch{
    res.send("404 template")
  }

}

