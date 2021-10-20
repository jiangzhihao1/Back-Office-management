let express = require("express");
let ejs = require("ejs");
let bodyParser = require("body-parser"); //解析通过post方法提交的文本数据
let session = require("express-session"); //cnpm i express-session --save

// 引入登录页面模块
let userRouter = require("./routes/login.js");
let addRouter = require("./routes/useadd.js");
let reviseRouter = require("./routes/revise.js");
let searchRouter = require("./routes/search.js");

let app = new express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// cookie数据保存在客户端， session数据保存在服务器端。
// 配置session
app.use(session({
    secret: "this is a mimi", //用来加密的
    resave: false, //强制保存session,即使session没有变化也要强制保存,默认为true,通常写成false
    saveUninitialized: true, //强制将未初始化的session存储,默认为true,通常写成true
    cookie: { //cookie过期了,session就自动消失
        //secure:true  //https协议
        maxAge: 60 * 60 * 1000 //过期时间
    },
    rolling: true //重新记录cookie的过期时间
}));
// 配置模板引擎
app.set("view engine", "ejs");
// 配置模板路径
app.set("views", __dirname + "/views");
// 配置静态资源目录
app.use(express.static("public"));
//配置一个虚拟目录
app.use("/api", express.static("public"));


// 应用级中间件---拦截路由
app.use((req, res, next) => {
    //http://localhost:8000/api/login
    if (req.url != "/api/login" && req.url != "/api/dologin" && !req.session.username) {
        res.redirect("/api/login"); //重定向到登录页面
    } else {
        next();
    }
});



// 使用引入的模块--登录页面
app.use("/api", userRouter);

//添加
app.use("/api", addRouter);
// 修改
app.use("/api", reviseRouter);
//搜索
app.use("/api", searchRouter);

app.listen(8000, () => {
    console.log("8000running");
});