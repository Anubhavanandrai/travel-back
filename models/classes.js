import mongoose from "mongoose";

const classschema = new mongoose.Schema({

  tripname: {
    type: String,
   
  },

  availableseat: {
    type: Number,
  
  },

  email: {
    type: String,
    required: true,
  },

 description:{
    type: String,
   
  },

  fee: {
    type: Number,
   
  },
  currentuser:{
    type: String,
    required:true
  },
  isApproved:{
    type:Boolean,
    default:false
  },
   status:{
    type:Boolean,
    default:false
   },

  file:{
    type:String
  }

});

export const Class= mongoose.model("Class",classschema) 