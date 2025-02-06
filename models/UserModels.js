import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Plese add a full name"]
    },
    email:{
        type:String,
        required: [true,"Plese add an email"],
        unique: true,
        trim: true,
    },
    password:{
        type:String,
        required: [true,"Plese add password"],
        minlength:[6,"Password must be at least 6 characters"],
        unique: true,
        trim: true,
    },
    image: {
        type:String,
    },
    isAdmin: {
        type:Boolean,
        default:false,
    },likedMovies: [
        {
       type:mongoose.Schema.Types.ObjectId,
       ref:"Movie",
        },
    ],
},
      { 
         timestamps:true,
    }
        );


  
        export default mongoose.model("User",UserSchema);