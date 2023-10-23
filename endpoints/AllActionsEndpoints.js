const Contact = require("../models/ContactSchema");
const User = require("../models/User");
const Post = require("../models/postSchema");
const { verifyAccountOwnerShip } = require("../middlewares/Authorize");

const createMessage = async (req, res) => {
    try {
        if (req.user){
            
            const user = req.user;

            const newMessage = {
                author: req.user._id,
                fullName: req.body.fullName,
                companyName: req.body.companyName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                links: req.body.links,
                preferredContactMethods: req.body.preferredContactMethods,
                message: req.body.message
            }

            user.messageingThread.push(newMessage);

            await user.save();

            res.json({ success: true, newMessage });

        }else {
            const { fullName, companyName, email, phoneNumber, links, preferredContactMethods, message } = req.body;

            const newContact = new Contact({
                fullName,
                companyName,
                email,
                phoneNumber,
                links,
                preferredContactMethods,
                message
            });

            const theMessage = await newContact.save();

            if (theMessage) {
                return res.status(201).json({
                    success: true,
                    newMessage: newContact
                });
            } else {
                return res.status(500).json({
                    success: false
                });
            }
        }

    } catch (err) {

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the contact. Please try again later."
        });
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

            messages = await Contact.find().select("_id companyName fullName message");
        }

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the contacts. Please try again later."
        });
    }
};


const getMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Contact not found."
            });
        }
        if (verifyAccountOwnerShip(req.user._id, message)){
            return res.status(200).json({
                success: true,
                data: message
            });
        }else {
           return res.status(403).send('You are unauthorized to view this contact');
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the contact. Please try again later."
        });
    }
};

const createPost = async (req, res) => {
    try {

        const { category, title, content } = req.body;

        const newPost = new Post({
            category, title, content
        });

        const obj = await newPost.save();

        if (obj) {
            return res.status(201).json({
                success: true,
                post: obj
            });
        } else {
            return res.status(500).json({
                success: false
            });
        }


    } catch (err) {

        console.error(err);
        return res.status(500).json({
            success: false,
            err,
            message: "An error occurred while creating the Post. Please try again later."
        });
    }
};


const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        if (posts) {
            return res.status(200).json({
                data: posts
            });
        } else {
            return res.status(404).json({
                success: false
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            err,
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};

const getPost = async (req, res) => {
    try {

        const id = req.params.id;

        const post = await Post.find({ _id: id });

        if (post) {
            return res.status(200).json({
                data: post
            });
        } else {
            return res.status(404).json({
                success: false
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            err,
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};

const editPost = async (req, res) => {
    try {

        const { _id, category, title, content } = req.body;

        const updatedValues = { category, title, content };

        const post = await Post.findOneAndUpdate({ _id }, updatedValues, { new: true });


        if (post) {
            return res.status(200).json({
                success: true,
                post
            });
        } else {
            return res.status(404).json({
                success: false
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            err,
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};

const deletePost = async (req, res) => {
    try {

        const { id } = req.params;


        const post = await Post.findByIdAndRemove(id);


        if (post) {
            return res.status(200).json({
                success: true
            });
        } else {
            return res.status(404).json({
                success: false
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            err,
            message: "An error occurred while retrieving the posts. Please try again later."
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
    getMessage
}
