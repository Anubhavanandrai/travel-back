
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  console.log("Inside verify token middleware");
console.log("header is ",req.headers.authorization)
  //header se kuch nikalna hota h to big bracket ka use krte h
 //console.log(obj.user name); // Syntax error
//console.log(obj["user name"]); // Correct
  
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json({ msg: "Unauthorized, please log in no header" });
  }

  const token = authHeader.split(' ')[1];
// token = ["Bearer","as8730nas03623nsm?ahj@42823nnc48dskj"]
//token[1] is actual token
  console.log(token,"yhi h token")
  if (!token ) {
    console.log("Token missing in authorization header");
    return res.status(401).json({ msg: "Unauthorized, please log in" });
  }
console.log("secrte key is",process.env.SECRET_KEY)
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Invalid token");
      return res.status(401).json({ error: "Please login", err });
    }
    console.log(decoded, "Decoded user is");
    req.user = decoded;
    next(); 
  });
};
