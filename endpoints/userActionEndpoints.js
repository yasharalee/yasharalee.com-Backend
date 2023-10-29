const User = require("../models/User");


const getUserById =async (req, res) => {
    const { id } = req.params;
    try{
        const user = await User.findOne({ _id: id }, { loginHistory: 0 });

        if(user){
            res.status(200).json({ success: true, data: user});
        }else{
            throw new Error('No user found');
        }
    }catch(err){
        console.log('Error: ', err);
        return res.status(500).send({message: 'There was an error processing your request.'});
    }
}


module.exports = {
    getUserById,
}