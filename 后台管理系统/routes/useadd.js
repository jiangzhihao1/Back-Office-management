let express = require("express");

//cnpm install formidable --save  //接收post提交的文件数据
let formidable = require("formidable");
let path = require("path");
let { YuanGong } = require("../database/user.js");
// 建立一个路由对象
let router = new express.Router();
//添加页面渲染
router.get("/useadd", (req, res) => {
    res.render("userlist/useadd.ejs");
});
//点击提交按钮提交数据
router.post("/douseadd", async(req, res) => {
    // console.log(req.body);

    // 创建一个表单解析对象
    const form = new formidable.IncomingForm();
    // 将上传的文件存放在public目录下边的upload文件夹中
    form.uploadDir = path.join(__dirname, "../", "public", "upload");
    // 保留后缀名
    form.keepExtensions = true;

    form.parse(req, async(err, fields, files) => {
        // console.log(fields);
        // console.log(files);
        // console.log(files.pic.path.split("public")[1]);
        // console.log(files.pic.name == "");
        let username = fields.username.trim();
        let sex = fields.sex.trim();
        let age = fields.age.trim();
        let identity = fields.identity.trim();
        let zhiwei = fields.zhiwei.trim();
        let gongzi = fields.gongzi.trim();
        let shifa = fields.shifa.trim();
        let pic = "";
        // 判断是否有图片传入---如果有图片上传就进行覆盖
        if (files.pic.name != "") {
            pic = files.pic.path.split("public")[1];
        };
        // 验证数据库中的数据是否有重复的
        let isUser = await YuanGong.findOne({
            username: username,
            sex: sex,
            age: age,
            identity: identity,
            zhiwei: zhiwei,
            gongzi: gongzi,
            shifa: shifa
        });
        if (!isUser) {
            // 创建一个新对象--准备存入数据库中
            let userNew = {
                username: username,
                sex: sex,
                age: age,
                identity: identity,
                zhiwei: zhiwei,
                gongzi: gongzi,
                shifa: shifa,
                pic: pic
            };
            // 将新的用户信息添加到数据库--并赋值给result
            let result = await YuanGong.create(userNew);
            // 判断如果有这条新的的信息--重定向页面到登录页面
            if (result) {
                res.redirect("/api/userlist");
            }
        } else {
            // location.href="/api/login"   js中的重定向
            res.send('<script>alert("该用户已存在");location.href="/api/userlist"</script>');

        }
    })


});


// 暴露内容
module.exports = router;