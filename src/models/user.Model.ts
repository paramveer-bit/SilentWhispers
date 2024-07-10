import mongoose, {Schema,Document,model, models} from 'mongoose';


// user :- email,username,password,verified code,is verified,verifycode expirytime,messages

export interface Message extends Document{
    content : string,
    createdAt : Date
}

const messageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true
    }
})


export interface User extends Document{
    email : string,
    username : string,
    password : string,
    isVerified : boolean,
    verifyCode : string,
    verifyCodeExpiryTime : Date,
    messages : Message[],
    isAcceptingMessage : boolean
}


const userSchema : Schema<User> = new Schema({
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isVerified : {
        type : Boolean,
        required : true
    },
    verifyCode : {
        type : String,
        required : true
    },
    verifyCodeExpiryTime : {
        type : Date,
        required : true
    },
    messages : [messageSchema],
    isAcceptingMessage : {
        type : Boolean,
        required : true
    }


})

const UserModel = (models.User as mongoose.Model<User>) || model<User>('User',userSchema)
export default UserModel


