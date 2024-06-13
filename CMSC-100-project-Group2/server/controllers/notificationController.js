import Notification from "../models/Notification.js";
import User from "../models/User.js";

// return a list of all notifications
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.send({success: true, notifications});
    } catch (err) {
        res.send({success: false, errMessage: err.message});
    }
}

// return a list of notifications of the user
const getNotificationOfUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.query.userId});

        if (!user) {
            throw new Error("User does not exist!");
        }

        const notifObjects = await Notification.find({ _id: { $in: user.notifications } });
        res.send({success: true, notifications: notifObjects});
    } catch (err) {
        res.send({success: false, errMessage: err.message});
    }
}

// set notification read to true
const notificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {_id: req.body.notificationId},
            {isRead: true},
            {new: true}
        )
        res.send({success: true, notification});
    } catch (err) {
        res.send({success: false, errMessage: err.message});
    }
}

// delete notification
const deleteNotification = async (req, res) => {
    try {
        
        const deletedDocument = await Notification.findOneAndDelete(
            {
                _id: req.body.notificationId,
            }
        )

        if (!deletedDocument) {
            throw new Error("Notification not found");
        }

        const user = await User.findOneAndUpdate(
            {_id: deletedDocument.userId},
            {$pull: {notifications: req.body.notificationId}}
        );

        if (!user) {
            throw new Error("The user with that notification does not exist anymore");
        }

        res.send({success: true});
    } catch (err) {
        res.send({success: false, errMessage: err.message});
    }
}

export default {getAllNotifications, getNotificationOfUser, notificationRead, deleteNotification};