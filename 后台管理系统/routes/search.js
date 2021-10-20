let { YuanGong } = require("../database/user.js");

let express = require("express");
// 建立一个路由对象
let router = new express.Router();

//搜索提交数据
router.get("/search", async(req, res) => {
    // 在数据库中查找数据
    let username = req.query.username;
    // console.log(username);
    let yonghu = await YuanGong.find({
        username: new RegExp(username, "gi")
    });
    console.log(yonghu);
    if (yonghu.length == 0) {
        res.send('<script>alert("该用户不存在");location.href="/api/userlist"</script>');
    } else {
        let page = Number(req.query.page) || 1;
        let size = Number(req.query.size) || 6;
        // 查询总条数---yonghu.length
        let lengths = yonghu.length;
        console.log(lengths);
        //计算总的页数
        let zongyeshu = Math.ceil(lengths / size);
        // yonghu = [yonghu];
        yonghu = await YuanGong.find({ username: new RegExp(username, "gi") }).skip((page - 1) * size).limit(size);

        res.render("userlist/search.ejs", {
            username: username,
            yonghu: yonghu,
            lengths: lengths,
            page: page,
            size: size,
            zongyeshu: zongyeshu
        });
    }
});

// 暴露内容
module.exports = router;