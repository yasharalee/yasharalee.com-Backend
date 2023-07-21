const blogPost = require("../models/blogPostSchema");
const Comment = require("../models/commentSchema");

// req.user

// user.blogPosts=BlogPost.id  => post.author=userId => commets.blogPost=blogpost.id

//post
const sendPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    if (!title || !content || !published) {
      res.status(400).json({ error: err });
    }

    // create new blog Post object and save to db
    const thePost = await blogPost.create({
      author: req.user._id,
      title,
      content,
      published,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }

  res.status(201).json({ message: "Created" });
};

//get
const MyPosts = async (req, res) => {
  try {
    const thePosts = await blogPost.find({ author: req.user._id });

    if (thePosts.length > 0) {
      res.status(200).json(thePosts);
    } else {
      res.status(404).json({ error: "No posts found for the user" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//post
const postReactions = async (req, res) => {
  try {
    const { resourceId, action } = req.body;
    const reactorId = req.user._id;

    if (!resourceId || !action) {
      throw new Error({ error: "Invalid Request" });
    }

    const foundPost = await blogPost.findOne({ _id: resourceId });

    if (foundPost !== null) {
      if (action === "like") {
        //check whether this reaction already exists or not
        if (!foundPost.likes.includes(reactorId)) {
          foundPost.likes.push(reactorId);
          if (foundPost.dislikes.includes(reactorId)) {
            let i = foundPost.dislikes.indexOf(reactorId);
            foundPost.dislikes.splice(i, 1);
          }
          await foundPost.save();
        } else {
          const index = foundPost.likes.indexOf(reactorId);
          foundPost.likes.splice(index, 1);
          await foundPost.save();
        }

        res.status(201).json({ listOfActors: foundPost.likes });
      } else {
        if (action === "dislike") {
          // Check if the reactor has already disliked the post
          const reactorDisliked = foundPost.dislikes.includes(reactorId);

          if (reactorDisliked) {
            // If the reactor has already disliked the post, remove their ID from the dislikes array
            const index = foundPost.dislikes.indexOf(reactorId);
            foundPost.dislikes.splice(index, 1);
            await foundPost.save();
          } else {
            // If the reactor has not disliked the post, add their ID to the dislikes array
            foundPost.dislikes.push(reactorId);
            if (foundPost.likes.includes(reactorId)) {
              let i = foundPost.likes.indexOf(reactorId);
              foundPost.likes.splice(i, 1);
            }
            await foundPost.save();
          }
          res.status(201).json({ listOfActors: foundPost.dislikes });
        } else if (action === "report") {
          // Check if the reactor has already reported the post
          const reactorReported = foundPost.reported.includes(reactorId);

          if (reactorReported) {
            // If the reactor has already reported the post, remove their ID from the reported array
            const index = foundPost.reported.indexOf(reactorId);
            foundPost.reported.splice(index, 1);
            await foundPost.save();
          } else {
            // If the reactor has not reported the post, add their ID to the reported array
            foundPost.reported.push(reactorId);
            await foundPost.save();
          }
          res.status(201).json({ listOfActors: foundPost.reported });
        }
      }
    } else {
      res.status(404).json({ error: "Couldn't find the Specified Post" });
    }
  } catch (err) {
    return res.status(400).json({ error: `${err}` });
  }
};

//get
const getAPost = async (req, res) => {
  const { resourceId } = req.body;

  if (!resourceId) {
    throw new Error({ error: "resourceId Id has not been sent" });
  }
  try {
    const thePost = await blogPost.findOne({ _id: resourceId });

    if (thePost != null) {
      res.status(200).json({ thePost });
    } else {
      res.status(404).json({ error: "Post Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete
const deleteAPost = async (req, res) => {
  const { resourceId } = req.body;

  if (!resourceId) {
    throw new Error("resourceId has not been sent");
  }

  try {
    const deletedPost = await blogPost.findOneAndDelete({ _id: resourceId });

    if (deletedPost) {
      // Delete all reactions for this Post
      await Comment.deleteMany({ author: req.user._id });

      res.status(200).json({ isDeleted: true });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendPost,
  MyPosts,
  postReactions,
  getAPost,
  deleteAPost,
};
