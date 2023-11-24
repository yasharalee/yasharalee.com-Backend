const Contact = require("../models/ContactSchema");
const User = require("../models/User");
const Post = require("../models/postSchema");
const { verifyAccountOwnerShip } = require("../middlewares/Authorize");
const mailing = require("../utils/emailUtils");

const getNewMesages = async (req, res) => {
  try {
    const usersWithUnreadMessages = await User.aggregate([
      {
        $match: {
          "messageingThread.read": false,
        },
      },
      {
        $project: {
          fullName: 1,
          _id: 1,
          messageingThread: {
            $filter: {
              input: "$messageingThread",
              as: "message",
              cond: {
                $and: [
                  { $eq: ["$$message.read", false] },
                  { $eq: ["$$message.author", "$_id"] },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          "messageingThread.0": { $exists: true },
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          unreadMessagesCount: { $size: "$messageingThread" },
        },
      },
    ]);

    const contactsWithUnreadMessages = await Contact.aggregate([
      {
        $match: {
          read: false,
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          unreadMessagesCount: { $literal: 1 },
        },
      },
    ]);

    const combinedResults = [
      ...usersWithUnreadMessages,
      ...contactsWithUnreadMessages,
    ];

    if (combinedResults.length > 0) {
      res.status(200).json({ data: combinedResults, err: null });
    } else {
      res.status(404).json({ err: "No unread messages found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Server Error. Please retry later." });
  }
};

const createAdminMessage = async (req, res) => {
  try {
    if (req.user) {
      const user = req.user;

      const newMessage = {
        author: user._id,
        messageReceiverId: req.body.messageReceiverId,
        fullName: req.body.fullName,
        companyName: req.body.companyName,
        normalizedEmail: req.body.normalizedEmail,
        phoneNumber: req.body.phoneNumber,
        links: req.body.links,
        preferredContactMethods: req.body.preferredContactMethods,
        message: req.body.message,
      };

      let targetUser;
      const tempUser = await User.findOne({ _id: req.body.messageReceiverId });
      const tempAnony = await Contact.findOne({
        _id: req.body.messageReceiverId,
      });

      if (tempUser) {
        targetUser = tempUser;

        targetUser.messageingThread.push(newMessage);

        await targetUser.save();

        return res.status(201).json({
          success: true,
          newMessage: targetUser,
          err: "Created under users message thread",
        });
      } else if (tempAnony) {
        targetUser = tempAnony;
        mailing.sendEmail(
          "Info",
          targetUser.normalizedEmail,
          `Reply: ${targetUser.message.substring(0, 15)}...`,
          req.body.message
        );
      }
    } else {
      return res.status(400).json({
        success: false,
        err: "Could not create the message",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      err: "An error occurred while creating the contact. Please try again later.",
    });
  }
};

const createMessage = async (req, res) => {
  try {
    if (req.user && req.userNameVerified === true) {
      const user = req.user;

      const newMessage = {
        author: req.user._id,
        fullName: req.body.fullName,
        companyName: req.body.companyName,
        normalizedEmail: req.body.normalizedEmail,
        phoneNumber: req.body.phoneNumber,
        links: req.body.links,
        preferredContactMethods: req.body.preferredContactMethods,
        message: req.body.message,
      };

      user.messageingThread.push(newMessage);

      await user.save();

      return res.status(201).json({
        success: true,
        newMessage,
        err: "Thank you for your time, I will be in touch shortly",
      });
    } else {
      return res.status(400).json({
        success: false,
        err: "User Name in form is defferent than records",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      err: "An error occurred while creating the contact. Please try again later.",
    });
  }
};

const createAnonymousMessage = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      normalizedEmail,
      phoneNumber,
      links,
      preferredContactMethods,
      message,
    } = req.body;

    const newContact = new Contact({
      fullName,
      companyName,
      normalizedEmail,
      phoneNumber,
      links,
      preferredContactMethods,
      message,
    });

    const theMessage = await newContact.save();

    if (theMessage) {
      mailing.sendEmail(
        "new-message",
        normalizedEmail,
        `Your message has been received dear ${fullName}`,
        message
      );

            mailing.sendEmail(
              "NoReply",
              "yashaalee@gmail.com",
              `new anonymous message from ${fullName}`,
              message
            );

      return res.status(201).json({
        success: true,
        newMessage: newContact,
        err: "Thank you for your time, I will be in touch shortly",
      });
    } else {
      return res.status(400).json({
        success: false,
        err: "Fill in all required fields.",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, err: "Server Error. Please retry later." });
  }
};

const getMessages = async (req, res) => {
  try {
    let messages;

    if (req.body && req.body.last) {
      const limit = Number(req.body.last);
      messages = await Contact.find()
        .select("_id companyName fullName")
        .sort({ createdAt: -1 })
        .limit(limit);
    } else {
      messages = await Contact.find().select(
        "_id companyName fullName message"
      );
    }

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the contacts. Please try again later.",
    });
  }
};

const getMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }
    if (verifyAccountOwnerShip(req.user._id, message)) {
      return res.status(200).json({
        success: true,
        data: message,
      });
    } else {
      return res.status(403).send("You are unauthorized to view this contact");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the contact. Please try again later.",
    });
  }
};

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
      err,
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
      err,
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
      err,
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
  createMessage,
  getMessages,
  getMessage,
  getNewMesages,
  createAnonymousMessage,
  createAdminMessage,
};
