import mongoose from "mongoose";
import bcrypt from "bcrypt";

// user schema
const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    middleName: {type: String, default: ""},
    lastName: {type: String, required: true},
    studentNumber: {type: String, required: true},  // format xxxx-xxxxx
    userType: {type: String, required: true},  // Student, Adviser, ClearanceOfficer
    email: {type: String, required: true},
    password: {type: String, required: true},
    applications: [mongoose.SchemaTypes.ObjectId],
    adviser: mongoose.SchemaTypes.ObjectId,
    notifications: [mongoose.SchemaTypes.ObjectId]
});

// pre save hook, only triggered on save, (to encrypt password)
// when user is created the first time, and password edits
userSchema.pre("save", function(next) {
    const user = this;

    if (!user.isModified("password")) return next;

    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) {return next(saltError);}

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) {return next(hashError);}

            user.password = hash;
            return next();
        })
    })
});

// custom user method
// use bcrypt built-in compare method
userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

const User = mongoose.model("User", userSchema);

export default User;