const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user")
const tweetmodel = require("../models/tweetmodel")
const { JWT_SECRET } = require('../config');
const protectedResource = require('../middleware/protectedResource');

//RE
router.post("/register", (req, res) => {
    const { name, username, email, password, Dob, location, profileImg } = req.body;
    if (!name || !username || !password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    User.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "User with this email already registered" });
            }
            User.findOne({ username: username })
                .then((userInDB) => {
                    if (userInDB) {
                        return res.status(500).json({ error: "User with this name already registered" });
                    }
                    bcryptjs.hash(password, 16)
                        .then((hashedPassword) => {
                            const user = new User({ name, username, email, password: hashedPassword });
                            user.save()
                                .then((newUser) => {
                                    res.status(201).json({ result: "User Signed up Successfully!" });
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }).catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});


router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    
    User.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id,"name":userInDB.name, "userName": userInDB.username, "email": userInDB.email,"followers":userInDB.followers,"followings":userInDB.following,"Dob":userInDB.Dob,"location":userInDB.location,"profileImg":userInDB.profileImg };
                        console.log(userInfo)
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid Credentials" });
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

//API for all posts
// router.post("/createpost", protectedResource, (req, res) => {
//     const { description, image } = req.body;
//     if (!description) {
//       return res
//         .status(400)
//         .json({ error: "One or more mandatory fields are empty" });
//     }
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized access" });
//     }
//     req.user.password && (req.user.password = undefined);
//     const postObj = new tweetmodel({
//       description: description,
//       image: image,
//       created_at: Date.now(),
//       tweetedBy: req.user
//     });
//     postObj.save()
//       .then((newPost) => {
//         res.status(201).json({ post: newPost });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });

router.post("/createpost", protectedResource, (req, res) => {
    const { description, image } = req.body;
    if (!description) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    req.user.password = undefined;
    const postObj = new tweetmodel({ description: description, image: image, created_at:Date.now(), tweetedBy: req.user });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});
  
router.get("/allpost", (req, res) => {
    tweetmodel
      .find({})
      .sort({ createdAt: -1 })
      .populate("tweetedBy", "_id username profileImg")
      .then((result) => {
        res.status(200).json({ posts: result });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  

router.get("/originalperson/:id" , async(req , res)=>{
    const _id=req.params.id;
    const result = await User.findById({_id});
    
    console.log(result);
    res.status(200).send(result);
    })
  //all post 
//   delete route
router.delete("/deletepost/:postId", protectedResource, async (req, res) => {
    try {
      const postFound = await tweetmodel.findOne({ _id: req.params.postId }).populate("tweetedBy", "_id");
      if (!postFound) {
        return res.status(400).json({ error: "Post does not exist" });
      }
      if (postFound.tweetedBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not authorized to delete this post" });
      }
      await tweetmodel.deleteOne({ _id: req.params.postId });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error, failed to delete post" });
    }
  });
  router.put("/like", protectedResource, (req, res) => {
    tweetmodel
      .findByIdAndUpdate(
        req.body.tweetId,
        {
          $push: { likes: req.user._id }
        },
        {
          new: true
        }
      )
      .populate("tweetedBy", "_id fullname")
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({ likesCount: result.likes.length });
      })
      .catch(error => {
        console.error(error);
        res.status(400).send("Some error occurred while liking the tweet.");
      });
  });
  




  //Dislike

  router.put("/dislike", protectedResource, (req, res) => {
  tweetmodel
    .findByIdAndUpdate(
      req.body.tweetId,
      {
        $pull: { likes: req.user._id }
      },
      {
        new: true
      }
    )
    .populate("tweetedBy", "_id fullname")
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({ likesCount: result.likes.length });
    })
    .catch(error => {
      console.error(error);
      res.status(400).send("Some error occurred while disliking the tweet.");
    });
});

 //comment
 
router.put("/comment" , protectedResource , async(req , res)=>{

  console.log(req.body)
  console.log(req.user._id )

  const comment = { commentText: req.body.comment, created_at : Date.now() ,  commentedBy: req.user._id }
  


     try{
       const rss = await tweetmodel.findByIdAndUpdate(req.body.tweetId, {
           $push: { comments: comment }
       }, {
           new: true //returns updated record
       }).select("comments")
     
       res.status(200).json({totalcomment:rss.comments.length})

     }catch(err){
       res.status(200).json({err:"Some Error"})
     }

   
})

//retweet
 
const createReTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweetedBy = req.user.userId;

  // Finding the original tweet to retweet
  const tweetToRetweet = await tweetmodel.findOne({ _id: tweetId });

  // Creating a new tweet as a retweet
  const createNewTweetAsARetweet = await new Tweet({
    isARetweet: true,
    content: tweetToRetweet.content,
    tweetedBy: new mongoose.Types.ObjectId(tweetToRetweet.tweetedBy._id),
    thisTweetIsRetweetedBy: new mongoose.Types.ObjectId(req?.user.userId),
    image: tweetToRetweet?.image ? tweetToRetweet?.image : null,
  }).save();

  // Updating the original tweet by adding the retweeter to the retweetedBy array
  const retweet = await tweetmodel.findByIdAndUpdate(
    { _id: tweetId },
    {
      $push: {
        reTweetedBy: [tweetedBy],
      },
    }
  );

  res.json({
    message: "createReTweet",
    tweetId,
    tweetedBy,
    retweet,
    createNewTweetAsARetweet,
  });
};

  



module.exports = router