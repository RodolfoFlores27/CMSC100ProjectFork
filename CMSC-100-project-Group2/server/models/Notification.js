import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    notificationMessage: {type: String, required: true},
    date: {
        type: Date,
        default: () => Date.now()
    },
    isRead: {type: Boolean, default: false},
});


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;