import express from "express"
import {Cart} from "../models/Cart.js"
import {verifyToken} from "../middleware/verifyToken.js" 

const router= express.Router()

router.get('/',(req,res)=>{
    res.send("here in cart")
    })


// api to add to cart    
router.post('/add-to-cart',verifyToken,async (req, res) => {
  console.log(req.user)

        try {
           const {Title,Description,Fee,Imageurl,Quantity}=req.body
          

           const{_id}=req.user.userData;

           console.log(_id,Title,Description,Fee)

           const newItem = new Cart({
           CurrentUser: _id,
           JourneyTitle:  Title,
           JourneyDescription: Description,
           JourneyFee: Fee,
           JourneyPic:Imageurl,
           ProductQuantity:Quantity
           
           
          });
          await newItem.save()
          res.status(200).json({
            message: "Added to cart" ,
            newItem
          })
            }
        catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ error: 'Internal server error in add to cart backend api' });
        }
    });
 
 
    


router.put('/update-quantity/:id', async (req, res) => {
      const itemId = req.params.id; // Corrected to get itemId from req.params
      const { quantity } = req.body; // Corrected to destructure quantity from req.body
    
      console.log("itemID and quantity:", itemId, quantity);
      try {
        const updatedCart = await Cart.findByIdAndUpdate(
          itemId,
          { ProductQuantity: quantity }, // Corrected to update ProductQuantity field
          { new: true } // Ensure the updated document is returned
        );
        if (!updatedCart) {
          return res.status(404).send('Item not found');
        }
        res.json({ updatedCart, message: "Quantity updated successfully" });
      } catch (err) {
        res.status(500).send('Error updating quantity');
      }
    });
    
    











// Route to view the course details on the basis of useremail
router.get('/cartdetail/:UserId', async (req, res) => {
        try {
            const requiredid = req.params.UserId
             const  details= await Cart.find({CurrentUser:requiredid});
            res.status(200).json({ cart: details});
        } catch (error) {
            console.error('Error fetching user cart items:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


//delete cart item
router.delete('/delete-cart-item/:id',async(req,res)=>{
const itemId= req.params.id

try {
    const deletedItem = await Cart.findOneAndDelete({ _id:itemId });

    if (deletedItem) {
      res.status(200).json({ message: 'Item deleted successfully', deletedItem });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
    
export default router;
