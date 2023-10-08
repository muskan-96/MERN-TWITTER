const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    profileImg:{
        type: String,
        default: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    location: {
        type: String,
      
    },
    Dob: {
        type: Date
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }],
      following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }]

    }, { timestamps: true });
// Register the User model
mongoose.model('User', userSchema);

// Export the User model
module.exports = mongoose.model('User');