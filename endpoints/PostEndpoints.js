const Post = require("../models/postSchema");

const createPost = async (req, res) => {
  try {
    const { category, title, content } = req.body;

    const newPost = new Post({
      category,
      title,
      content,
    });

    const obj = await newPost.save();

    if (obj) {
      return res.status(201).json({
        success: true,
        post: obj,
      });
    } else {
      return res.status(500).json({
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while creating the Post. Please try again later.",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (posts) {
      return res.status(200).json({
        data: posts,
      });
    } else {
      return res.status(404).json({
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      err,
      message:
        "An error occurred while retrieving the posts. Please try again later.",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.find({ _id: id });

    if (post) {
      return res.status(200).json({
        data: post,
      });
    } else {
      return res.status(404).json({
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the posts. Please try again later.",
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { _id, category, title, content } = req.body;

    const updatedValues = { category, title, content };

    const post = await Post.findOneAndUpdate({ _id }, updatedValues, {
      new: true,
    });

    if (post) {
      return res.status(200).json({
        success: true,
        post,
      });
    } else {
      return res.status(404).json({
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the posts. Please try again later.",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndRemove(id);

    if (post) {
      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(404).json({
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the posts. Please try again later.",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  editPost,
  deletePost,
};
