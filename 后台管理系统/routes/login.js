let express = require("express");
// 引入../controller/login.js中的模板
let loginController = require("../controller/login.js");
// 建立一个路由对象
let router = new express.Router();

//登录页面渲染
router.get("/login", loginController.Login);
//登录提交数据
router.post("/dologin", loginController.DoLogin);

//注册页面渲染
router.get("/register", loginController.Register);

//注册提交数据
router.post("/doregister", loginController.DoRegister);

//用户列表页面渲染
router.get("/userlist", loginController.UserList);

//删除用户数据
router.get("/doremove", loginController.DoRemove);

// 暴露内容
module.exports = router;