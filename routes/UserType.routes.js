import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { activeUserTypeDetail, addUserType, allUserTypeDetail, changeStatusUserTypeDetail, deleteUserTypeDetail, editUserTypeDetail, singleUserTypeDetail } from "../controllers/userType.controller.js";

const userTypeRouter = Router();

userTypeRouter.route("/get-single/:id").get(verifyJWT, singleUserTypeDetail);
userTypeRouter.route("/add-user-type").post(verifyJWT,addUserType);
userTypeRouter.route("/all").get(verifyJWT, allUserTypeDetail);
userTypeRouter.route("/active").get(verifyJWT, activeUserTypeDetail);
userTypeRouter.route("/edit/:userTypeId").put(verifyJWT, editUserTypeDetail);
userTypeRouter.route("/delete/:id").delete(verifyJWT, deleteUserTypeDetail);
userTypeRouter.route("/changeStatus/:id").patch(verifyJWT, changeStatusUserTypeDetail);

export default userTypeRouter;