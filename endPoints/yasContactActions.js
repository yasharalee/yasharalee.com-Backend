const { json } = require("express");
const Contact = require("../models/yasContact");
const YasPost = require("../models/yas_back/yasPost");

const createMessage = async (req, res) => {
    try {
        
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

        
        await newContact.save();

        const obj = await Contact.findOne({ message });

        if(obj){
          return  res.status(201).json({
                success: true
            });
        }else {
          return  res.status(201).json({
              success: false
            });
        }
       

    } catch (err) {
       
        console.error(err);
       return  res.status(500).json({
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
            
            messages = await Contact.find().select("_id companyName fullName");
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

module.exports = getMessages;




const getMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Contact not found."
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the contact. Please try again later."
        });
    }
};

const createYasPost = async (req, res) => {
    try {

        const { category, title, content } = req.body;


        const newPost = new YasPost({
            category, title, content
        });


        await newPost.save();

        const obj = await YasPost.findOne({ title });

        if (obj) {
            return res.status(201).json({
                success: true,
                post: obj
            });
        } else {
            return res.status(201).json({
                success: false
            });
        }


    } catch (err) {

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the Post. Please try again later."
        });
    }
};


const getYasPosts = async (req, res) => {
    try {
            const posts = await YasPost.find();
            if(posts){
               return res.status(200).json({
                    data: posts
                });
            }else {
                return res.status(404).json({
                    success : false
                })
            }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};

const getYasPost = async (req, res) => {
    try {

        const id = req.params.id;

        const post = await YasPost.find({_id:id});
        
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
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};

const editYasPost = async (req, res) => {
    try {

        const { _id, category, title, content } = req.body;

        const updatedValues = { category, title, content };

        const post = await YasPost.findOneAndUpdate({ _id}, updatedValues, { new: true });


        if (post) {
            return res.status(200).json({
                success:true,
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
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};

const deleteYasPost = async (req, res) => {
    try {

        const { id } = req.params;


        const post = await YasPost.findByIdAndRemove(id);


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
            message: "An error occurred while retrieving the posts. Please try again later."
        });
    }
};


module.exports = {
    createYasPost,
    getYasPosts,
    getYasPost,
    editYasPost,
    deleteYasPost,
    createMessage,
    getMessages,
    getMessage
}
