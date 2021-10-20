let express = require("express");
//cnpm install formidable --save  //接收post提交的文件数据
let formidable = require("formidable");
let path = require("path");
let { YuanGong } = require("../database/user.js");
// 建立一个路由对象
let router = new express.Router();
//添加页面渲染
router.get("/revise", async(req, res) => {
    // console.log(req.query);
    let isUser = await YuanGong.findOne({
        _id: req.query.id
    });
    res.render("userlist/revise.ejs", { isUser });
});
// 点击修改按钮提交数据
router.post("/dorevise", async(req, res) => {

    const form = new formidable.IncomingForm();
    //将上传的文件存放在public目录下边的upload文件夹中
    form.uploadDir = path.join(__dirname, "../", "public", "upload");
    //保留后缀名
    form.keepExtensions = true;
    form.parse(req, async(err, fields, files) => {
        console.log(fields);
        console.log(files);
        if (!files.pic.name) { //条件成立说明没有修改图片
            let id = fields.id;
            let isUser = await YuanGong.findOne({
                _id: id
            });
            // 将修改的用户信息更新到数据库中
            await YuanGong.updateOne(isUser, {...fields });
            // 重定向页面到用户信息页面
            res.redirect("/api/userlist");
        } else {
            let id = fields.id;
            let isUser = await YuanGong.findOne({
                _id: id
            });
            // 将修改的用户信息更新到数据库中
            await YuanGong.updateOne(isUser, {...fields, pic: files.pic.path.split("public")[1] });
            // 重定向页面到用户信息页面
            res.redirect("/api/userlist");
        }
    })
});
// 暴露内容
module.exports = router;