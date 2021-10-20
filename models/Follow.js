const usersCollection = require('../db').db().collection("users")
const followsCollection = require('../db').db().collection("follows")
const ObjectID = require('mongodb').ObjectID
const User = require('./User')

let Follow = function(followedUsername, authorId) {
  this.followedUsername = followedUsername
  this.authorId = authorId
  this.errors = []
}

Follow.prototype.cleanUp = async function() {
  if (typeof(this.followedUsername) != "string") {this.followedUsername = ""}
}

Follow.prototype.validate = async function() {
  // followedUsername must exist in database
  let followedAccount = await usersCollection.findOne({username: this.followedUsername})
  if (followedAccount) {
    this.followedId = followedAccount._id
  } else {
    this.errors.push("You cannot follow a user that does not exist.")
  }
}

Follow.prototype.create = function() {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    await this.validate()
    if (!this.errors.length) {
      await followsCollection.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

Follow.isVisitorFollowing = async function(followedId, visitorId){
  let followDoc = await followsCollection.findOne({followedId: followedId, authorId: new ObjectID(visitorId)})
  if(followDoc){
    return true
  }else{
    return false
  }
}

Follow.getFollowersById = function(id){
  return new Promise(async (resolve, reject) => {
    try{
      let followers = await followsCollection.aggregate([
        {$match: {followedId: id}},
        {$lookup: {
          from:"users",
          localField:"authorId",
          foreignField:  "_id", 
          as: "userDoc"
        }},
        {$project: {
          username:{$arrayElemAt: ["$userDoc.username", 0]},
          email:{$arrayElemAt: ["$userDoc.email", 0]}
        }}
      ]).toArray()
      followers = followers.map(function(follower){
        //create a user
        let user = new User( follower, true)
        return {username: follower.username, avatar:user.avatar}
      })
      resolve(followers)
    }catch{
      reject()
    }
  })
}

Follow.getFollowing = function(id){
  return new Promise(async (resolve, reject) => {
    try{
      let followers = await followsCollection.aggregate([
        {$match: {authorID: id}},
        {$lookup: {
          from:"users",
          localField:"followedId",
          foreignField:  "_id", 
          as: "userDoc"
        }},
        {$project: {
          username:{$arrayElemAt: ["$userDoc.username", 0]},
          email:{$arrayElemAt: ["$userDoc.email", 0]}
        }}
      ]).toArray()
      followers = followers.map(function(follower){
        //create a user
        let user = new User( follower, true)
        return {username: follower.username, avatar:user.avatar}
      })
      resolve(followers)
    }catch{
      reject()
    }
  })
}

module.exports = Follow