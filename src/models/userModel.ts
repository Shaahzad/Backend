import mongoose, {Schema, Document} from "mongoose";


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
}


const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    isActive: {
        type:  Boolean,
        default: false
    }
}, {
    timestamps: true
}) 


const user = mongoose.model<IUser>("User", userSchema);
export default user