import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const router = express.Router();

// Home route for user handling
router.get("/", (req, res) => {
  res.send("I am in user handling routes API");
});

// Route to add a new user
router.post("/addnewuser", async (req, res) => {
  try {
    const { Username, Mobile, Email, Gender, Password } = req.body;

    // Check if user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ Email }, { Username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create new user
    const newUser = new User({
      Username,
      Mobile,
      Email,
      Password: hashedPassword,
      Gender,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("User addition problem:", error);
    res.status(500).json({ error: "User addition problem" });
  }
});

router.get('/checkemail/ispresent/:email', async (req, res) => {
  const em = req.params.email;
  try {
    const emailfound = await User.findOne({ Email: em });
    if (!emailfound) {
      return res.status(204).send({ message: "No user present for given email id" });
    }
    res.status(200).send(emailfound);
  } catch (error) {
    console.log("error calling reset api:", error);
    res.status(500).send({ message: "Server error while checking email" });
  }
});




router.patch('/make_admin/:id', async (req, res) => {
  const Id = req.params.id;
  try {
      const newstatus = await User.findOneAndUpdate({ _id:Id },{
              $set: {isAdmin: true}},{ new: true}); 
      res.status(200).json(
          {
               message: "Admin Assigned",
               updatedClass: newstatus });
      } catch (error) {
      console.error('Error while  assiging to admin role:', error);
      res.status(500).json({ updatedmessage: 'Internal server error', error: error.message });
  }});
 



  //chnge password
  router.patch('/paschnge/:email', async (req, res) => {
    const Em = req.params.email;
    console.log(req.body.pass,"ab mza")
    const{pass}=req.body
    console.log(pass,"yhi hu")
    try {

      const saltRounds = 10;
      const hashedPasswor = await bcrypt.hash(pass, saltRounds);

        const newstatus = await User.findOneAndUpdate({ Email:Em},{
                $set: {Password: hashedPasswor}},{ new: true}); 
        res.status(200).json(
            {
                 message: "Password Changed",
                 updatedClass: newstatus });
        } catch (error) {
        console.error('Error while  password change:', error);
        res.status(500).json({ updatedmessage: 'Internal server error', error: error.message });
    }});
   
  



router.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    console.error("User deletion problem:", error);
    res.status(500).json({ error: "User deletion problem" });
  }
});




router.get("/get-all-users",async(req,res)=>{
  try {
    const users = await User.find();
    if(!users){
       console.log("No user found")}
       res.status(200).json(users);
    } 
    catch (error) {
      console.log(" backend :::  error while getting users ",error)
  }
})

// route for admin login

router.post("/Admin/Login", async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const admin = await User.findOne({ Username });
    if (!admin) {
      return res.status(401).json({ error: "User not found in the database" });
    }
    console.log("username found  next step");

    const passwordMatch = await bcrypt.compare(Password, admin.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password mismatch" });
    } else {
      console.log("password found  next step");
      const adminfound = admin.isAdmin;
      if (adminfound) {
        console.log("adminfound ::::::::: found  next step");
        const admintoken = jwt.sign({ userData: admin }, config.secret_key, {
          expiresIn: "24h",
        });
        console.log("admintoken is here", admintoken);
        return res.status(200).json({
          JWTtoken: admintoken,
          client: admin,
          msg: "Admin Authenticated",
        });
      }
    }
  } catch (error) {
    console.error(" Backend ::: Admin login problem: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to login a user
router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ Username });
    if (!user) {
      return res.status(401).json({ error: "User not found " });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password mismatch" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userData: user }, config.secret_key, {
      expiresIn: "24h",
    });

    res.status(200).json({
      JWTtoken: token,
      client: user,
      msg: "User Authenticated",
    });
  } catch (error) {
    console.error("Login problem:", error);
    res.status(500).json({ error: "Login problem" });
  }
});

export default router;
