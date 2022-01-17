//获取url参数
var id = GetQueryString("videoId");

var time = GetQueryString("shareTime");
var type = GetQueryString("type");
var authorization = GetQueryString("authorization");

// var _id = arr[1];
var domain =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;

var vm = new Vue({
  el: "#app",
  data: {
    id: id,
    time: time,
    content: false,
    type: type,
    commentLists: [],
    videourl: "",
    isVideoEnd: false,
    videoImg: "",
  },
  created: function created() {
    var _this = this;
    //视频
    axios
      .get(
        domain +
          "/gourdbaby/app/v1/api/video/sharedetail" ,
        {
          //参数列表
          params: { videoId: id, shareTime: time, type: type },
          //请求头配置
          headers: { "App-Type": 'pc,1.1.0,share,browser,h5' ,
          "Authorization":authorization
        },
        }
      )
      .then(function (res) {
        if (res.data.code === 0) {
          _this.content = res.data.data;
          _this.videoImg=res.data.data.videoImg+'?authorization='+ authorization;
          _this.videourl = res.data.data.videoUrl +'?authorization='+ authorization;
          
        } else {
          alert(res.data.msg);
        }
      })
      .catch(function (err) {
        // _this.videourl = "https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4"
      //  alert(err);
      });
  },
  methods: {
    videoOnended: function () {
      this.isVideoEnd = true;
    },
  },
});

