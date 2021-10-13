//this exports mongo db client
const postsCollection = require('../db').db().collection("posts")
const ObjectID = require('mongodb').ObjectID
const User = require('./User')

let Post = function (data, userid) {
  this.data = data
  this.errors = []
  this.userid = userid
}

// accept only string in post 
Post.prototype.cleanUp = function () {
  if (typeof (this.data.title) != "string") { this.data.title = "" }
  if (typeof (this.data.body) != "string") { this.data.body = "" }

  // get rid of any bogus properties
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: ObjectID(this.userid)
  }
}

Post.prototype.validate = function () {
  if (this.data.title == "") { this.errors.push("You must provide a title.") }
  if (this.data.body == "") { this.errors.push("You must provide post content.") }
}

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      //save post into db
      //mongo db methods return promisses we can use then- catch or async await
      postsCollection.insertOne(this.data).then(() => {
        resolve()
      }).catch(() => {
         // this happen when is db or server problem
        this.errors.push("Please try again later.")
        reject(this.errors)
      })
    } else {
      reject(this.errors)
    }
  })
}

//get single daata post from db
/* Post.findSingleById = function(id){
  return new Promise(async function(resolve, reject){
    //it has to be included because od injection attack
    if(typeof(id) !="string" || !ObjectID .isValid(id)){
      reject()
      return
    }
    //getting data
    let post = await postsCollection.findOne({_id: new ObjectID(id)})
    if(post){
      resolve(post)
    }else{
      reject()
    }
  })
} */

//get single nested data post from db , we cal look one level deeper
Post.findSingleById = function(id) {
  return new Promise(async function(resolve, reject) {
    if (typeof(id) != "string" || !ObjectID.isValid(id)) {
      reject()
      return
    }
    //get data
    let posts = await postsCollection.aggregate([
      {$match: {_id: new ObjectID(id)}},
      //users is collections
      {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
     //here you can define which data you want to return 1=true
      {$project: {
        title: 1,
        body: 1,
        createdDate: 1,
        author: {$arrayElemAt: ["$authorDocument", 0]}
      }}
    ]).toArray()

    // clean up author property in each post object
    posts = posts.map(function(post) {
      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar
      }

      return post
    })

    if (posts.length) {
      console.log(posts[0])
      resolve(posts[0])
    } else {
      reject()
    }
  })
}

module.exports = Post