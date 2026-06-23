import { Inngest } from "inngest";
import  User from "../models/User.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });


//save the userData
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{
        const{id,first_name,last_name,emails,image_url}=event.data
        const userData = {
            _id:id,
            email : emails[0].email,
            name: first_name +' '+last_name,
            image:image_url
        }
        await User.create(userData)
    }
)

//Delete user
const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-with-clerk'},
    {event:'clerk/user.deleted'},
    async({event})=>{
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }

)

//update user
const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async({event})=>{
        const{id,first_name,last_name,emails,image_url}=event.data
        const userData = {
            _id:id,
            email : emails[0].email,
            name: first_name +' '+last_name,
            image:image_url
        } 
        await User.findByIdAndUpdate(id,userData)
    }
)


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];