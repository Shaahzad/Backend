import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
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
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const user = mongoose.model("User", userSchema);
export default user;
