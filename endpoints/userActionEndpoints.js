const User = require("../models/User");
const Contact = require("../models/ContactSchema");


const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    let result;
    const user = await User.findOne({ _id: id }, { loginHistory: 0 });

    if (user) {
      result = user;
    } else {
      const contact = await Contact.findOne({ _id: id });
      if (contact) {
        const messageThreadItem = {
          author: contact._id,
          messageReceiverId: null,
          _id: contact._id,
          fullName: contact.fullName,
          companyName: contact.companyName,
          phoneNumber: contact.phoneNumber,
          links: contact.links,
          preferredContactMethods: contact.preferredContactMethods,
          message: contact.message,
          read: contact.read,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        };

        result = {
          messageingThread: [messageThreadItem],
        };
      }
    }

    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      throw new Error("No user or contact found");
    }
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .send({ message: "There was an error processing your request." });
  }
};



module.exports = {
    getUserById,
}