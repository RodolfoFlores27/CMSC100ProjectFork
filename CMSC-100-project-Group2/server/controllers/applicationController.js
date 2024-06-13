import Application from "../models/Application.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// get all applications
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.send(applications);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
}

// add an application
const addApplication = async (req, res) => {
    try {
      const studentId = req.body.studentId; // Retrieve the studentId from the request body
  
      const newApplication = new Application({
        studentId: studentId, // Use the retrieved studentId
        status: "Pending",
        step: 1,
        remarks: [],
        studentSubmission: {
          link: req.body.link,
        },
      });
  
      const updateStudent = await User.findOneAndUpdate(
        { _id: studentId }, // Use the retrieved studentId to find the student
        { $push: { applications: newApplication._id } },
      );
  
      if (!updateStudent) {
        throw new Error("Student not found");
      }
  
      await newApplication.save();
      res.send({ success: true }); // Send success response
    } catch (err) {
      console.log(err.message);
      res.send({ success: false, errMessage: err.message }); // Send error response
    }
  };

// edit application status ("Open/Pending/Closed/Cleared")
const editApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.body.applicationId
        });

        if (!application) {
            throw new Error("Application not found");
        }

        const updatedApplication = await Application.findOneAndUpdate(
            {
                _id: req.body.applicationId
            },
            {
                status: req.body.status
            },
            { new: true }
        );

        // create a notification that the step is updated
        const newNotification = await new Notification({
            userId: updatedApplication.studentId,
            notificationMessage: req.body.notificationMessage,
        });

        const addNotificationToUser = await User.findOneAndUpdate(
            {_id: updatedApplication.studentId},
            { $push: { notifications: newNotification._id } },
        );

        if (!addNotificationToUser) {
            throw new Error("User to send notification not found");
        }

        await newNotification.save();

        res.send({success: true, updatedApplication: updatedApplication});
    } catch (err) {
        console.log(err.message);
        res.send({ success: false, errMessage: err.message }); // Send error response
    }
}

// edit application step (1-Pre adviser, 2-Adviser, 3-Clearance officer)
const editApplicationStep = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.body.applicationId
        });

        if (!application) {
            throw new Error("Application not found");
        }

        const updatedApplication = await Application.findOneAndUpdate(
            {
                _id: req.body.applicationId
            },
            {
                step: req.body.step
            },
            { new: true }
        );

        // create a notification that the step is updated
        const newNotification = await new Notification({
            userId: updatedApplication.studentId,
            notificationMessage: req.body.notificationMessage,
        });

        const addNotificationToUser = await User.findOneAndUpdate(
            {_id: updatedApplication.studentId},
            { $push: { notifications: newNotification._id } },
        );

        if (!addNotificationToUser) {
            throw new Error("User to send notification not found");
        }

        await newNotification.save();

        res.send({success: true, updatedApplication: updatedApplication});
    } catch (err) {
        console.log(err.message);
        res.send({ success: false, errMessage: err.message }); // Send error response
    }
}

// add remarks to an application
const addRemarksToApplication = async (req, res) => {
    const update = {
        $push: {
            remarks: {
                remark: req.body.remark,
                date: Date.now(),
                commenterId: req.body.commenterId,
                commenterFName: req.body.commenterFName,
                commenterMName: req.body.commenterMName,
                commenterLName: req.body.commenterLName
            }
        }
    };

    try {
        const updatedApplication = await Application.findOneAndUpdate(
            { _id: req.body.applicationId },
            update,
            {new: true}
        );

        if (!updatedApplication) {
            throw new Error("Application not found");
        }

        res.send({ success: true, updatedApplication: updatedApplication }); // Send success response
    } catch (err) {
        console.log(err.message);
        res.send({ success: false, errMessage: err.message }); // Send error response
    }
}
const getApplicationById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const application = await Application.findOne({ id });
  
      if (!application) {
        return res.status(404).json({ err: 'Application not found' });
      }
  
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ err: 'Internal server error' });
    }
  };
  

export default {getAllApplications, addApplication, editApplicationStatus, editApplicationStep, addRemarksToApplication, getApplicationById};