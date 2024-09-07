import mongoose from "mongoose";

const Cartschema= new mongoose.Schema({

    CurrentUser:{
        type:String
    },
    
    JourneyDescription:{
        type:String
    },
    
    JourneyTitle:{
        type:String,
        required:true
    },
    JourneyFee:{
        type:Number,
        required:true
    },
    JourneyPic:{
        type:String
    },
    ProductQuantity:{
        type:Number
       
    }
   

})

export const Cart= mongoose.model("Cart",Cartschema)