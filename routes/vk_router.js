const Router = require("express").Router;
const vkAppController = require("../controllers/vkApp-controller");
const vkMiniAppsController = require("../controllers/vkApp-controller");
const route = new Router();
route.post("/authorisationVkApp", vkMiniAppsController.authorisation);
route.post("/registrationVkApp", vkMiniAppsController.registration);
route.post("/sendPromoCode", vkMiniAppsController.sendDiscountPromocode);
route.post("/getUserWidthDiscount", vkMiniAppsController.getUserWidthDiscount);
route.put("/incrementDiscountVk", vkMiniAppsController.incrementDiscount);
route.get("/getInfoFromDatabase", vkAppController.getInfoFromDatabase);
module.exports = route;
