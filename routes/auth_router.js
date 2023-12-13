const Router = require("express").Router;
const adminController = require("../controllers/admin-controller");
const clientController = require("../controllers/client-controller");
const userController = require("../controllers/user-controllers");
const vkMiniAppsController = require("../controllers/vkApp-controller");
const authMiddleware = require("../middleware/auth-middleware");
const route = new Router();
route.post("/registration", userController.registration);
route.post("/login", userController.login);
route.get("/logout", userController.logout);
route.get("/refresh", userController.refresh);
route.get("/activated/:link", userController.active);

route.post("/mainDescription", authMiddleware, adminController.mainDescription);
route.delete(
  "/deleteMainDescription",
  authMiddleware,
  adminController.deleteMainDescription
);
route.post("/descriptionPost", authMiddleware, adminController.descriptionPost);
route.delete(
  "/removeDescriptionPost",
  authMiddleware,
  adminController.removeDescriptionPost
);
route.put(
  "/updateTruckInfo",
  authMiddleware,
  adminController.updateInfoTruckWheel
);
route.put("/updateWheelInfo", authMiddleware, adminController.wheelInfo);
route.put(
  "/updateSupportsInfo",
  authMiddleware,
  adminController.updateInfoSupports
);
route.post(
  "/createNewItemInSandblast",
  authMiddleware,
  adminController.updateInfoSandblast
);
route.delete(
  "/deleteItemSandblast",
  authMiddleware,
  adminController.deleteInfoSandblast
);
route.post(
  "/addImgPowderPoint",
  authMiddleware,
  adminController.addImgOnPrintPowderPoint
);
route.delete(
  "/removeImgPowderPoint",
  authMiddleware,
  adminController.removeImgOnPrintPowderPoint
);
route.get("/getInfoAboutUser", adminController.getInfoAboutUser);

route.get("/getInfo", clientController.getInfo);

route.post("/VK/authorisationVkApp", vkMiniAppsController.authorisation);
route.post("/VK/registrationVkApp", vkMiniAppsController.registration);
route.post("/VK/sendPromoCode", vkMiniAppsController.sendDiscountPromocode);
route.post(
  "/VK/searchUserWithDiscount",
  authMiddleware,
  vkMiniAppsController.searchUserWidthDiscount
);
route.put("/VK/incrementDiscountVk", vkMiniAppsController.incrementDiscount);
route.get("/VK/getInfoFromDatabase", vkMiniAppsController.getInfoFromDatabase);
module.exports = route;
