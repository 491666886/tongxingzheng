//获取url参数
var code = GetQueryString("code");
var domain =
// "http://192.168.88.217:8001/"
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;
// var vm = new Vue({

// });
new Vue({
  el: "#app",
  data: function () {
    return {
      back:true,
      page:'A',
      btnColor:'#FFAF02',
      content:[],
      childName: "",
      relationName: "",
      headImageUrl: "",
      bannerimg: "",
      buttonName:'发送验证码',
      second:60,
      isDisabled:false, 
      type_options:[],
      ruleForm: {
        type: "",
        phone: "",
        verificationCode: "",
        code: code,
      },
      rules: {
        type: [
          {
            required: true,
            message: "请选择您的身份",
            trigger: 'change' 
          },
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern:
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: "请检查手机号是否正确",
            trigger: "blur",
          },
        ],
        verificationCode: [
          {
            required: true,
            message: "请填写验证码",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted(){

  },
  created: function created() {
    var _this = this;


    axios
      .get(domain + "/hlzjz/api/v1/family/invite/info", {
        //参数列表
        params: { code: code},
        //请求头配置
        // headers: {
        //   "App-Type": "pc,1.1.0,share,browser,h5",

        // },
      })
      .then(function (res) {
        if (res.data.code === 0) {
          _this.getparent();
          _this.page="A";
          _this.content = res.data.data;
          _this.childName=res.data.data.childName;
          _this.relationName=res.data.data.relationName;
          _this.bannerimg=res.data.data.headImageUrl;
          if (_this.bannerimg== null||_this.bannerimg=="" ) {
            _this.bannerimg='./static/picture/header.png'
          }

         if (res.data.data.isValid !=true) {
          _this.page="C";
         }
        } else {
          _this.page="C";
        }
      })
      .catch(function (err) {
        _this.bannerimg='./static/picture/header.png'

        // alert(err);
      });
  },
  methods: {
	   toParentsApp(){
		 
	        var u = navigator.userAgent;
	        var ua = u.toLowerCase();//获取判断用的对象
			 
	        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	        if(isAndroid){
	          //微信浏览器
	          if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	            location.href="https://a.app.qq.com/o/simple.jsp?pkgname=uni.huluzai";
	          }else{
	            location.href="http://assi.ehuluzai.com/download/apk/huluzai.apk"
	          }
	        }
	        if(isiOS){
				
	          location.href="https://apps.apple.com/cn/app/id1546045364"
	        }
	      },
    getparent(){
      let that =this
      axios
      .get(domain + "/hlzjz/api/v1/family/dic", {
      
      })
      .then(function (res) {
        if (res.data.code === 0) {
          
          that.type_options= res.data.data.relationships;
       
        } else {
          that.page="C";
        }
      })
      .catch(function (err) {
       
        alert(err);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios
          .post(domain + "/hlzjz/api/v1/family/invite/regist", {
            phone:this.ruleForm.phone,
            code:code,
            verificationCode:this.ruleForm.verificationCode,
            childId	:this.content.childId,
            relationship:this.ruleForm.type
          })
          .then((res) =>{
            if (res.data.code === 0) {
              
            this.page="B";
             
            } else {
              alert(res.data.msg);
            }
          })
          .catch(function (err) {
            alert(err);
          });
        } else {
          
          return false;
        }
      });
    },
    sendcode(formName) {
      this.$refs.ruleForm.validateField("phone", (phoneError) => {
        if (!phoneError) {
          axios
          .post(domain + "/hlzjz/api/v1/family/invite/verification/code", {
            phone:this.ruleForm.phone,
          }) .then((res) => {
               if (res.data.code === 0) {
              // let that =this
              this.isDisabled = true;
                 this.btnColor = "#C8C8C8";
                 let interval = window.setInterval(()=> {
                   this.buttonName = this.second + 's后重发';
                   --this.second;
                    
                   if (this.second < 0) {
                     this.buttonName = "重新发送";
                     this.btnColor = '#FFAF02';
                     this.second = 59;
                     this.isDisabled = false;
                     window.clearInterval(interval);
                   }
                 }, 1000);
            } else {
              alert(res.data.msg);
            }
          })
          .catch((err) => {
            alert(err);
          });
          
          // .then(function (res) {
          //   if (res.data.code === 0) {
          //     let that =this
          //     that.changepage();
              
          //     // let interval = window.setInterval(function() {
          //     //   that.buttonName = that.second ;
          //     //   --that.second;
          //     //    
          //     //   if (that.second < 0) {
          //     //     that.buttonName = "重新发送";
          //     //     that.second = 59;
          //     //     that.isDisabled = false;
          //     //     window.clearInterval(interval);
          //     //   }
          //     // }, 1000);
          //   } else {
          //     alert(res.data.msg);
          //   }
          // })
          // .catch(function (err) {
           
          //   alert(err);
          // });
       
        }
      });
    },
    changepage(){
     
      this.isDisabled = true;
       
      // return that.isDisabled
    },
  },
});
