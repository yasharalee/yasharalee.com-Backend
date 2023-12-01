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
        "NoReply",
        normalizedEmail,
        `Your message has been received dear ${fullName}`,
        message
      );

      mailing.sendEmail(
        "new-message",
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

const getMesagesByUser = (req, res) => {
  const { user } = req;
  try {
    if (user) {
      return res.status(200).json({
        success: true,
        messageingThread: user.messageingThread,
        err: null,
      });
    } else {
      throw "No User Found";
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      MessagingThread: null,
      err: "Something went wrong, please try again later",
    });
  }
};


module.exports = {
  createMessage,
  getMessage,
  getNewMesages,
  createAnonymousMessage,
  createAdminMessage,
  getMesagesByUser,
};
