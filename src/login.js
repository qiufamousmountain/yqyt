
const crypto = require('crypto');


const draw = (show_num) => {
    let canvas_width = document.getElementById('canvas').clientWidth;
    let canvas_height = document.getElementById('canvas').clientHeight;
    let canvas = document.getElementById("canvas");//获取到canvas的对象，演员
    let context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    let sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0,q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m";
    let aCode = sCode.split(",");
    let aLength = aCode.length;//获取到数组的长度

    for (let i = 0; i <= 3; i++) {
        let j = Math.floor(Math.random() * aLength);//获取到随机的索引值
        let deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
        let txt = aCode[j];//得到随机的一个内容
        show_num[i] = txt;
        let x = 5 + i * 13;//文字在canvas上的x坐标
        let y = 20 + Math.random() * 8;//文字在canvas上的y坐标
        context.font = "bold 23px 微软雅黑";

        context.translate(x, y);
        context.rotate(deg);

        context.fillStyle = randomColor();
        context.fillText(txt, 0, 0);

        context.rotate(-deg);
        context.translate(-x, -y);
    }
    for (let i = 0; i <= 3; i++) { //验证码上显示线条
        context.strokeStyle = randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
    }
    for (let i = 0; i <= 30; i++) { //验证码上显示小点
        context.strokeStyle = randomColor();
        context.beginPath();
        let x = Math.random() * canvas_width;
        let y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
    }
};

const randomColor = () => {//得到随机的颜色值
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
};
let show_num = [];


$(document).ready(() => {
    if ($("#dError") && $("#dError").text() != "") {
        alert("登录失败," + $("#dError").text())
    }
    //给整个窗口注册回车keydown事件
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            $("#loginBtn").click();
        }
    });
    //让帐号文本框获得焦点
    $("#username").focus();

    draw(show_num);
    $("#canvas").click(() => {
        draw(show_num);
    });




    $("#loginBtn").click(function (e) {
        let id = $("#username").val();
        if (null == username || username == '') {
            alert("账号不能为空，请填写账号");
            return false;
        }
        let password = $("#password").val();
        password = crypto.createHmac('sha256', "b4345e81163a950f")
            .update(password)
            .digest('hex')
        if (null == password || password == '') {
            alert("密码不能为空，请填写密码");
            return false;
        }
        let verCode = $("#verCode").val();
        if (null == verCode || "" == verCode) {
            alert("请先输入验证码");
            return false;
        }

        if (show_num.join('').toLocaleLowerCase() != verCode.toLocaleLowerCase()) {
            alert("验证码错误");
            return false;
        }

        let data = { id, password };

        $.ajax({
            url: '/api/userlogin',// 获取自己系统后台用户信息接口
            data,
            type: "post",
            dataType: "json",
            success: (data) => {
                if (data.code == 200) {
                    window.location.href = '/'
                } else {
                    alert(data.msg);//显示登录失败的原因
                    $("#username").val('');
                    $("#password").val('');
                    $("#verCode").val('');
                    draw(show_num);

                    console.log(data);
                }
            },

            error: (e) => {
                // alert(e.message);//显示登录失败的原因
                console.log(e);
                return false;
            }
        });

    });
});