import jwt from "jsonwebtoken";
import User from "../models/User.js";

// return a list of users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })
      .populate('adviser', 'firstName lastName')
      .populate('applications')
      .populate('notifications')
      .exec();

    res.send({ success: true, users });
  } catch (err) {
    res.send({ success: false, errMessage: err.message });
  }
}

// check if email or student id already exists
const checkIfUserExists = async (req, res) => {
  try {
    const user = await User.findOne(
      {
        $or: [{ email: req.body.email }, { studentNumber: req.body.studentNumber }]
      }
    );

    if (user) {
      res.send({success: true, result: true});
    } else {
      res.send({success: true, result: false});
    }
  } catch (err) {
    res.send({success: false, errMessage: err.message});
  }
}

// register a user (POST)
const registerUser = async (req, res) => {
  try {
      const newUser = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        studentNumber: req.body.studentNumber,
        userType: req.body.userType,
        email: req.body.email,
        password: req.body.password,
        applications: [],
        adviser: null,
        notifications: []
      });

      await newUser.save();
      res.send({ success: true }); // Send success response
  } catch (err) {
      res.send({ success: false, errMessage: err.message}); // Send error response
  }
};

// user log in (POST)
const loginUser = async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  await User.findOne({email})
  .then(user => {

      // scenario 1: user does not exist
      if (!user) {
          return res.send({ success: false, errMessage: "User does not exist!" });
      }

      user.comparePassword(password, (err, isMatch) => {
      // scenario 2: wrong password
      if (err || !isMatch) {
          return res.send({ success: false, errMessage: "Wrong password" });
      } else {
          // scenario 3: success
          // create a token
          const tokenPayload = {_id: user._id};
          const token = jwt.sign(tokenPayload,"THIS_IS_A_SECRET_STRING"); // best practice: hide the string
          const username = (user.middleName) ? user.firstName+' '+user.middleName[0]+' '+user.lastName : user.firstName+' '+user.lastName;
          return res.send({ success: true, token, username: username, userType: user.userType, studentNumber: user.studentNumber});
      }
      });
  })
};


// check if a user is logged in (POST)
const checkIfLoggedIn = async (req, res) => {
  // scenario 1: no cookies
  if (!req.cookies || !req.cookies.authToken) {
    return res.send({isLoggedIn: false});
  }

  // token is present, validate it
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err) {
        // scenario 2: error validating token
        return res.send({isLoggedIn: false});
      }

      const userId = tokenPayload._id; // token contains userId

      // check if user exists
      const user = User.findById(userId);
      if (!user) {
        // scenario 3: if failed to find user based on id in the token
        return res.send({isLoggedIn: false});
      }

      // scenario 4: success
      return res.send({isLoggedIn: true});
    }
  );
};

// find user by student id (old version)
const findUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId
    });

    res.send({success: true, user});
  } catch (err) {
    res.send({errMessage: "Error finding user"});
  }
}

// set user adviser
const setAdviser = async (req, res) => {

  try {

    // check if adviser exists
    const adviser = await User.findOne({
      studentNumber: req.body.adviserId,
      userType: "Adviser"
    });
  
    if (!adviser) {
      throw new Error("Adviser not found");
    }
    
    // update the student
    const updatedStudent = await User.findOneAndUpdate(
      {
        studentNumber: req.body.studentId,
        userType: "Student"
      },
      {
        adviser: adviser._id
      },
      { new: true }
    );

    if (!updatedStudent) {
      throw new Error("Student not found");
    }

    res.send({success: true, updatedStudent: updatedStudent});
  } catch (err) {
    res.send({errMessage: err.message});
  } 
}

// // set user adviser (old)
// const setAdviser = async (req, res) => {

//   try {

//     // check if adviser exists
//     const adviser = await User.findOne({
//       _id: req.body.adviserId,
//       userType: "Adviser"
//     });
  
//     if (!adviser) {
//       throw new Error("Adviser not found");
//     }
    
//     // update the student
//     const updatedStudent = await User.findOneAndUpdate(
//       {
//         _id: req.body.studentId,
//         userType: "Student"
//       },
//       {
//         adviser: req.body.adviserId
//       },
//       { new: true }
//     );

//     res.send({success: true, updatedStudent: updatedStudent});
//   } catch (err) {
//     res.send({errMessage: err.message});
//   } 
// }

// edit user (firstName, middleName, lastName)
const editUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId
    });

    if (!user) {
      throw new Error("User not found");
    }

    const toUpdate = {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.body.userId
      },
      toUpdate,
      { new: true }
    );

    res.send({success: true, updatedUser: updatedUser});
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, errMessage: err.message }); // Send error response
  }
}

// delete a user
const deleteUser = async (req, res) => {
  let deleteStudentAdviser = false;
  let deletedAdviser = null;

  try {
    await User.findOneAndDelete({
      _id: req.body.userId
    }).exec()
    .then(deleted => {
      if (deleted) {
        if (deleted.userType === "Adviser") {
          deleteStudentAdviser = true;
          deletedAdviser = deleted;
        }
      }
    })

    // also delete the student's adviser field
    if (deleteStudentAdviser) {
      const student = await User.findOneAndUpdate(
        {adviser: deletedAdviser._id},
        {adviser: null},
        {new: true}
      );
    }

    res.send({success: true});
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, errMessage: err.message }); // Send error response
  }
}



export default {registerUser, loginUser, checkIfLoggedIn, findUserById, setAdviser, editUser, getAllUsers, checkIfUserExists, deleteUser};
