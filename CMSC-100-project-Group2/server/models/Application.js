import mongoose from "mongoose";

const applicationSchema = mongoose.Schema({
    studentId: mongoose.SchemaTypes.ObjectId,
    status: {type: String, required: true},
    step: {type: Number, required: true},
    remarks: [{
        remark: String,
        date: Date,
        commenterId: mongoose.SchemaTypes.ObjectId,
        commenterFName: String,
        commenterMName: String,
        commenterLName: String
    }],
    studentSubmission: {
        link: String,
        date: {
            type: Date,
            default: () => Date.now()
        },
    }
});


const Application = mongoose.model("Application", applicationSchema);

export default Application;