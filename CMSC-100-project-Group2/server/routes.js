import authController from "./controllers/authController.js";
import applicationController from "./controllers/applicationController.js"
import notificationController from "./controllers/notificationController.js";

const router = (app) => {

    // allow cors
    app.use((req, res, next) => {
        // res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        next();
    });

    // auth routes
    app.post("/register", authController.registerUser);
    app.post("/login", authController.loginUser);
    app.post("/check-if-logged-in", authController.checkIfLoggedIn);
    app.get("/get-all-users", authController.getAllUsers);
    app.get("/find-user-by-id", authController.findUserById);
    app.post("/set-adviser", authController.setAdviser);
    app.post("/edit-user", authController.editUser);
    app.post("/check-if-user-exists", authController.checkIfUserExists);
    app.post("/delete-user", authController.deleteUser);
   

    // application routes
    app.get("/get-all-applications", applicationController.getAllApplications);
    app.post("/add-application", applicationController.addApplication);
    app.post("/edit-application-status", applicationController.editApplicationStatus);
    app.post("/edit-application-step", applicationController.editApplicationStep);
    app.post("/add-remarks-to-application", applicationController.addRemarksToApplication);
    
    

    // notification routes
    app.get("/get-all-notifications", notificationController.getAllNotifications);
    app.get("/get-user-notifications", notificationController.getNotificationOfUser);
    app.post("/notification-read", notificationController.notificationRead);
    app.post("/delete-notification", notificationController.deleteNotification);
}

export default router;