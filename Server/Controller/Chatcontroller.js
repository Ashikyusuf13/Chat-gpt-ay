import Chat from "../Models/Chat.js"


//create the chats
export const createchats = async (req,res) => {
    try {
        const userId = req.user._id

        const chats ={
            userId,
            messages:[],
            name:"New Chat",
            userName:req.user.name
        }

        await Chat.create(chats)

        res.json({success:true,message:"Chat Created"})
    } catch (error) {
         res.json({success:false,message:error.message})
    }
}

//Api controller for getting the all chats
export const getchats = async (req,res) => {
    try {
        const userId = req.user._id;
        const chats =await Chat.find({userId}).sort({updatedAt:-1})

        res.json({success:true, chats})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//Api controller for Delete the chat
export const deletechat = async (req,res) => {
    try {
        const userId = req.user._id

        const {chatId} = req.body

       await Chat.deleteOne({_id:chatId , userId })

        res.json({success:true,message:"Chat Deleted"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
   
}