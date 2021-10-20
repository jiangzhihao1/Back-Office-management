let mongoose = require("mongoose");

// let mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/haogu").then(() => {
    console.log("用户数据库连接成功");
}).catch(err => {
    console.log(连接失败);
});

//创建集合规则
let UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    sex: {
        type: String
    },
    age: {
        type: String
    },
    identity: {
        type: String
    },
    password: {
        type: String
    },
    zhiwei: {
        type: String
    },
    gongzi: {
        type: String
    },
    shifa: {
        type: String
    },
    pic: {
        type: String
    }
});

//使用集合规则创建集合--登录人员信息-账号密码
let Users = mongoose.model("Users", UserSchema);
// 添加员工信息用户
let YuanGong = mongoose.model("YuanGong", UserSchema);

//暴露
module.exports = {
    Users,
    YuanGong
};