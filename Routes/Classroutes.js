import express from "express"
import {Class} from "../models/classes.js" 
import  {fileuploader} from "../config/Multer.js"
import {uploadOnCloudinary} from '../config/Cloudinary.js';
import {verifyToken} from "../middleware/verifyToken.js"
import {User} from "../models/User.js"
import fs from 'fs';



const router= express.Router()


router.get('/',(req,res)=>{
    res.send("hello world")
    })

// to addd new class
router.post('/newclass',verifyToken,fileuploader.single('file'), async (req, res) => {
    const{_id}=req.user.userData;


  try {
      if (!req.file) {
          return res.status(400).json({ message: 'Please upload a file' });
      }

      const fileupl = await uploadOnCloudinary(req.file.path);
      const data = { ...req.body, file: fileupl.url,currentuser:_id };
      const newClass = new Class(data);
      const response = await newClass.save();
       
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error occurred while deleting the file:', err);
        } else {
          console.log('File deleted successfully from local filesystem');
        }
      });


      res.status(200).json({
          message: 'Class successfully added',
          data: response,
      });
  } catch (error) {
      console.log('Error occurred while adding a new class:', error);
      res.status(500).json({ message: 'Internal Server Error in adding class' });
  }
});



// to show all classes
router.get('/allclass',async(req,res)=>{
try{
   const allclasses=  await Class.find({isApproved:true})
   res.status(200).send(allclasses)  
}
catch(error){
    console.log(" Error occured while Finding all class : ",error)
}})

 


// Route to show approved classes of any user (isApproved: true)
router.get('/user-approved-class', verifyToken, async (req, res) => {
    const { _id } = req.user.userData;
    console.log(_id,"approved user k andr")
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const approvedClasses = await Class.find({ currentuser: _id, isApproved: true });
      if (approvedClasses.length === 0) {
        return res.status(404).json({ msg: 'No approved classes found for this user' });
      }
      res.status(200).json(approvedClasses);
    } catch (error) {
      console.error('Error occurred while finding user\'s approved classes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Route to show rejected classes of any user (status: true)
  router.get('/user-rejected-class', verifyToken, async (req, res) => {
    const { _id } = req.user.userData;
  
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const rejectedClasses = await Class.find({ currentuser: _id,status: true });
      res.status(200).json(rejectedClasses);
    } catch (error) {
      console.error('Error occurred while finding user\'s rejected classes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



//for admin panel
router.get('/admin/allclass',async(req,res)=>{
    try{
       const adminclasses=  await Class.find({status:false})
       res.status(200).send(adminclasses)  
    }
    catch(error){
        console.log(" Error occured while Finding all class : ",error)
    }})
    
    

// Approve class route
router.patch('/approveclass/:requiredclass', async (req, res) => {
    const Id = req.params.requiredclass;
    try {  
        const newstatus = await Class.findOneAndUpdate(
            { _id: Id },
            { $set: { isApproved: true } },
            { new: true }
        ); 
        // new: true makes the changes update in real time and new data is updated data
        console.log("approve is ", newstatus);
        res.status(200).send({
            message: "Trip approved",
            newstatus
        });
    } catch (error) {
        console.log("Error occurred while Finding required class to approve: ", error);
        res.status(500).send({
            message: "An error occurred",
            error: error.message
        });
    }
});

// Reject class route
router.patch('/rejectclass/:requiredclass', async (req, res) => {
    const Id = req.params.requiredclass;
    try {  
        const reje = await Class.findOneAndUpdate(
            { _id: Id },
            { $set: { status: true } },
            { new: true }
        ); 
        // new: true makes the changes update in real time and new data is updated data
        console.log("rejected is ", reje);
        res.status(200).send({
            message: "Trip rejected",
             reje
        });
    } catch (error) {
        console.log("Error while Rejecting class: ", error);
        res.status(500).send({
            message: "An error occurred",
            error: error.message
        });
    }
});




// Dynamic api for both approved and non approved class
router.get('/status/:query',async(req,res)=>{
    const requestedquery= req.params.query
    console.log(`Requested query: ${requestedquery}`);
         try{
            const approved= await Class.find({Status:requestedquery})
            res.status(200).json(approved)
            console.log("inside staus wala")
         }
         catch(err){console.log(`error in dynamic api of ${isApproved} status`)}        
})


// to update the given id with rights of updating all field
router.put('/update/:id', async (req, res) => {
    const requiredId = req.params.id;
    try {
        const newChange = await Class.findOneAndUpdate(
            { _id: requiredId },{
                $set: {
                    Classname: req.body.Classname,
                    Availableseat: req.body.Availableseat,
                    Email: req.body.Email,
                    Description: req.body.Description,
                    Fee: req.body.Fee,
                    Status: req.body.Status
                      }},
            { new: true}); 

        res.status(200).json(
            {
                 message: 'Class updated successfully',
                 updatedClass: newChange });
        } 
        catch (error) {
        console.error('Error while updating the class:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }});


//api to change only status or chnge single field
router.patch('/change-status/:id', async (req, res) => {
    const Id = req.params.id;
    const status=req.body.Status;
    try {
        const newstatus = await Class.findOneAndUpdate(
            { _id:Id },{
                $set: {
                    Status: req.body.Status
                      }},
            { new: true}); 
        res.status(200).json(
            {
                 message: 'status updated successfully',
                 updatedClass: newstatus });
        } 
        catch (error) {
        console.error('Error while updating the status:', error);
        res.status(500).json({ updatedmessage: 'Internal server error', error: error.message });
    }});
   


// api for searching the required journey details 
router.get("/searched-trip/:place",async(req,res)=>{
const Place=req.params.place;
console.log("place mila ya nhi :",Place)
try{
    const searchedTrip=await Class.find({$text:{$search:Place}},
        {score:{$meta:"textScore"}}).
        sort({ score: { $meta: "textScore" } });

       if(searchedTrip){
        res.status(200).json({msg:"required journey fetched",searchedTrip})
       }
}
catch(error){
    console.error("error in searching trip",error)
}})



export default router  