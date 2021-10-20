//渲染登录页面的
let md5 = require("md5"); //加密模块
let { Users, YuanGong } = require("../database/user.js");
// 渲染登录页面
exports.Login = (req, res) => {
    res.render("login/index.ejs");
};

//点击登录按钮提交数据
exports.DoLogin = async(req, res) => {
    // console.log(req.body); // { username: '张美丽', password: '123456' }
    let username = req.body.username;
    let password = md5(req.body.password); //对密码进行机密
    //登录判断用户名是否存在，如果存在，判断密码是否正确

    // 在数据库中查找数据
    let isUsername = await Users.findOne({
        username: username
    });
    let isUserPassword = await Users.findOne({
        username: username,
        password: password
    });
    if (!isUsername) {
        // 重定向到注册页面
        res.send('<script>alert("该用户不存在");location.href="/api/register"</script>');
    } else if (!isUserPassword) {
        // 重定向到登录页面
        res.send('<script>alert("登录名或登录密码不正确");location.href="/api/login"</script>');
    } else {
        //登陆成功
        req.app.locals.username = username; //全局存储一个用户名，在其他ejs模板中都可以使用了
        req.session.username = username; //创建session
        res.redirect("/api/userlist");
    };

};

//渲染注册页面
exports.Register = (req, res) => {
    res.render("register/index.ejs");
};


//点击注册按钮提交数据
exports.DoRegister = async(req, res) => {
    // console.log(req.body); //post方式提交的文本数据 {username:"haogu",password:123456}
    let username = req.body.username;
    let password = md5(req.body.password); //对密码进行加密

    //注册先判断数据库中是否存在该用户，如果有提示该用户，直接登录，否则直接注册
    let isUser = await Users.findOne({
        username: username
    });
    console.log(isUser);
    // 判断如果数据库中有没有该用户名
    if (!isUser) {
        // 建立一条新的用户信息
        let userNew = {
            username: username,
            password: password
        };
        // 将新的用户信息添加到数据库--并赋值给result
        let result = await Users.create(userNew);
        // 判断如果有这条新的的信息--重定向页面到登录页面
        if (result) {
            res.redirect("/api/login");
        }
    } else {
        // location.href="/api/login"   js中的重定向
        res.send('<script>alert("该用户已存在");location.href="/api/login"</script>');

    }
};


//用户列表
exports.UserList = async(req, res) => {
    //http://localhost:3000/admin/userlist?page=1&size=10
    //page 请求的页数
    //size 每页显示数据条数
    // console.log(req.query); //{page:1,size:10}
    // 在数据库中查找数据
    let yonghus = await YuanGong.find();
    let page = Number(req.query.page) || 1;
    let size = Number(req.query.size) || 6;
    // 查询总条数---yonghu.length
    let lengths = yonghus.length;
    // console.log(lengths);
    //计算总的页数
    let zongyeshu = Math.ceil(yonghus.length / size);
    // console.log(zongyeshu);
    //每一页相对应的数据
    let yonghu = await YuanGong.find({}).skip((page - 1) * size).limit(size);
    res.render("userlist/index.ejs", {
        yonghu: yonghu,
        lengths: lengths,
        page: page,
        size: size,
        zongyeshu: zongyeshu,
    });
}

//删除用户数据
exports.DoRemove = async(req, res) => {
    let id = req.query.id.trim();
    // console.log(isUser);
    // 将删除的用户信息从数据库中删除
    await YuanGong.findOneAndDelete({
        _id: id
    });
    // 重定向页面到用户信息页面
    res.redirect("/api/userlist");
};