//获取url参数
var reportId = GetQueryString("reportId");
var childId = GetQueryString("childId");
var authorization = GetQueryString("authorization");

// var _id = arr[1];
var domain =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;

// var domain ='http://172.38.50.90:8001';
// var domain ='http://172.38.90.110:8001';
axios.defaults.withCredentials = true;



new Vue({
  el: "#app",
  data: function () {
    return {
      isReportExist:true,
      childName:'',
      className:'',
      statCycle:'',
      performanceLists:[],
      avatar:'',
      description:'',
      tipsList:[],
      radarValue:[]
    };
  },
  created: function created() {
    // this.getInfo();
  },
  mounted(){
    this.getInfo().then(()=>{
      var myChart = echarts.init(document.getElementById('radar'));

      // 指定图表的配置项和数据
      var option = {
        radar: {
          shape: 'circle',
          indicator: [
            { name: '学习', max: 100},
            { name: '运动', max: 100},
            { name: '社交', max: 100},
            { name: '艺术', max: 100},
            { name: '生活', max: 100},
          ],
          splitNumber:3,
          axisLine:{
            lineStyle:{
              color:'#61290F',
              width:0.5
            },
          },
          splitLine:{
            show:true,
            lineStyle:{
              color:['#61290F'],
              width:0.3,
              type:'solid'
            }
          },
          splitArea:{
            show:false,
            // areaStyle:{
            //   color:[]
            // }
          }
        },

        series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          symbol:'none',
          symbolSize:0,
          itemStyle: {
            // normal: {
            //雷达图区域颜色
            color: 'none',
          },
          areaStyle: {
            // normal: {
            //雷达图区域颜色
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0.1,
              color: 'rgba(255,231,111, 1)'
            },
              {
                offset: 0.5,
                color: 'rgba(255,151,83, 0.9)'
              },{
                offset: 1,
                color: 'rgba(255,151,83, 1)'
              }]),
            // opacity:0,
          },
          data: [
            {
              // value: [90, 94, 97, 95, 99],
              value: this.radarValue
            }
          ]
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    })
  },
  methods: {
    getInfo(){
      return new Promise((resolve,reject)=>{
        //  ;
        axios.get(domain+'/hlzjz/api/v1/aiobserve/report/h5/'+reportId+'/'+childId,{
          headers:{
            // 'Authorization':"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodWx1emFpIiwiaWF0IjoxNjMwOTkzOTMwLCJ0ZWwiOiIxNTY2NjY2NjY2NiJ9.N8WSmxW2JdMTr5AOeZBlTBhqYHtRRP1Inh-Nd6fHqlw",
            'Authorization':authorization,
            'App-Type':"android,1.7.1,parent,unknow,11"
          }
        })
          .then(res=>{
             ;
            if(res.data.code===0){
              let data = res.data.data;
              this.childName = data.childName;
              this.avatar = data.childHead;
              this.className = data.schoolName.length+data.className.length>10?(data.schoolName+'-'+data.className).slice(0,10)+'…':(data.schoolName+'-'+data.className);
              this.description = data.description;
              this.statCycle = data.statCycle;
              this.performanceLists = data.highExplain;
              this.tipsList = data.lowExplain;
              this.radarValue = [data.learnScore,data.sportScore,data.commScore,data.artScore,data.lifeScore]
               
            }else{
              this.isReportExist = false;
              alert(res.data.msg)
            }
            resolve();
          })
          .catch(err=>{
            alert(err);
          })
      })
    }
  },
});
