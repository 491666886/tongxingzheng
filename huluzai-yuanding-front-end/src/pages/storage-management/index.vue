<template>
	<div class="storage-bg">
		<div class="wrapper" v-loading="isQuering">
			<div class="line">
				<div class="frag" ref="echart1"/>
				<div class="frag" ref="echart2"/>
			</div>
			<div class="line">
				<div class="month" v-loading="monthQuerying">
					<div class="select">
						年份：
						<el-select v-model="selectedYear" @change="handleYearChange">
							<el-option
								v-for="(op, idx) in yearOptions"
								:key="idx"
								:value="op.value"
								:label="op.label"
							/>
						</el-select>
					</div>
					<div class="frag" ref="echart3"/>
				</div>
				<div class="frag" ref="echart4"/>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts';
	import {
		getList,
		getListByYear
	} from '../../api/kindergarten/storage';
	import {
		getUserInfo,
		showMsgbox
	} from '../../utils';

	const now = new Date();
	const now_year = now.getFullYear();
	export default {
    data() {
      return {
				chart1: '',
	      chart2: '',
	      chart3: '',
	      chart4: '',
	      selectedYear: now_year,
	      yearOptions: [
	      	{
		        value: `${now_year - 3}`,
		        label: now_year - 3,
	        },
		      {
			      value: `${now_year - 2}`,
				    label: now_year - 2,
	        },
		      {
		        value: `${now_year - 1}`,
			      label: now_year - 1,
	        },
		      {
		        value: `${now_year}`,
			      label: now_year,
	        },
		      {
		        value: `${now_year + 1}`,
			      label: now_year + 1,
	        },
		      {
		        value: `${now_year + 2}`,
			      label: now_year + 2,
	        },
		      {
		        value: `${now_year + 3}`,
			      label: now_year + 3,
	        }],
	      isQuering: false,
	      monthQuerying: false
      }
    },
	  mounted() {
    	this.getData();
	  },
	  methods: {
    	getData() {
    		this.isQuering = true;
				getList({
					schoolId: getUserInfo().schoolId
				}).then((res) => {
					const data1 = {
						used: res.usedStorageNum,
						remain: res.storageNumRemain,
						all: res.storageNum
					}
					const data2 = res.updateTypespaceUsageVOS?res.updateTypespaceUsageVOS:[];
					const data3 = res.monthSpaceUsageVOS?res.monthSpaceUsageVOS:[];
					const data4 = res.gradeClassspaceUsageVOS?res.gradeClassspaceUsageVOS:[];
					const el1 = this.$refs.echart1;
					this.chart1 = echarts.init(el1);
					this.chart1.clear();
					const chart1_option = {
						title: {
							left: 20,
							top: 16,
							text: '空间总量和已用空间占比统计',
							textStyle: {
								fontSize: 20,
								color: '#222',
							}
						},
						legend: {
							left: 40,
							bottom: 50,
							orient: 'vertical',
							formatter(name) {
								if (name === '已用') {
									return `${name}：${data1.used}T`
								} else if (name === '剩余') {
									return `${name}：${data1.remain}T`
								} else {
									return `${name}：${data1.all}T`
								}
							},
							data: ['已用', '剩余', {
								name: '总量',
								icon: 'none'
							}]
						},
						color: ['#65A6FD', '#FFB476'],
						series: [{
							type: 'pie',
							radius: 140,
							clockwise: false,
							top: 110,
							left: 250,
							right: 160,
							bottom: 50,
							label: {
								position: 'outside',
								formatter: '{b} {c}T'
							},
							labelLine: {
								show: true,
								length: 20,
								length2: 20,
							},
							emphasis: {
								label: {
									show: true,
									fontSize: '20',
									fontWeight: 'bold'
								}
							},
							data: [
								{
									value: data1.used,
									name: '已用'
								},
								{
									value: data1.remain,
									name: '剩余'
								},
								{
									// value: 0,
									name: '总量',
									label: {
										show: false,
									},
									labelLine: {
										show: false
									}
								},
							]
						}]
					}
					const chart2_option = {
						title: {
							left: 20,
							top: 16,
							text: '各上传方式空间使用情况',
							textStyle: {
								fontSize: 20,
								color: '#222',
							}
						},
						legend: {
							left: 40,
							bottom: 40,
							orient: 'vertical',
							formatter(name) {
								const item = data2.find(itm => itm.type === name);
								return `${name}：${item.size}G ${item.percent}%`
							},
							data: data2.map(itm => itm.type)
						},
						color: ['#FFDA6A', '#FFB476', '#65A6FD'],
						series: [{
							type: 'pie',
							radius: 140,
							top: 110,
							left: 250,
							right: 160,
							bottom: 50,
							label: {
								position: 'outside',
								formatter: '{b} {c}G'
							},
							labelLine: {
								show: true,
								length: 20,
								length2: 20,
							},
							emphasis: {
								label: {
									show: true,
									fontSize: '20',
									fontWeight: 'bold'
								}
							},
							data: data2.map(itm => ({
								value: itm.size,
								name: itm.type
							}))
						}]
					}
					const chart3_option = {
						title: {
							left: 20,
							top: 16,
							text: '月度空间使用情况',
							textStyle: {
								fontSize: 20,
								color: '#222',
							}
						},
						xAxis: {
							type: 'category',
							data: data3.map(item => `${item.month}月`),
						},
						yAxis: {
							type: 'value',
							name: '(G)',
							nameLocation: 'end',
						},
						grid: {
							top: 100,
							left: 100,
							width: 560,
							height: 242,
							containLabel: true,
						},
						series: [{
							data: data3.map(itm => itm.size),
							type: 'bar',
							label: {
								show: true,
								position: 'top'
							},
							itemStyle: {
								color: '#65A6FD',
								shadowOffsetX: 5,
								shadowOffsetY: 5,
								shadowColor: 'rgba(0, 0, 0, 0.3)'
							},
							backgroundStyle: {
								color: '#65A6FD',
								shadowOffsetX: 5,
								shadowOffsetY: 5
							}
						}]
					}
					const chart4_option = {
						title: {
							left: 20,
							top: 16,
							text: '各班空间使用情况',
							textStyle: {
								fontSize: 20,
								color: '#222',
							}
						},
						legend: {
							left: 40,
							bottom: 50,
							orient: 'vertical',
							formatter(name) {
								const item = data4.find(itm => itm.className === name);
								return `${name}：${item.size}G ${item.percent}%`
							},
							data: data4.map(itm => itm.className)
						},
						series: [{
							type: 'pie',
							radius: 140,
							top: 110,
							left: 250,
							right: 160,
							bottom: 50,
							label: {
								position: 'outside',
								formatter: '{b} {c}G'
							},
							labelLine: {
								show: true,
								length: 20,
								length2: 20,
							},
							emphasis: {
								label: {
									show: true,
									fontSize: '20',
									fontWeight: 'bold'
								}
							},
							data: data4.map(itm => ({
								value: itm.size,
								name: itm.className
							}))
						}]
					}
					this.chart1.setOption(chart1_option);
					const el2 = this.$refs.echart2;
					this.chart2 = echarts.init(el2);
					this.chart2.clear();
					this.chart2.setOption(chart2_option);
					const el3 = this.$refs.echart3;
					this.chart3 = echarts.init(el3);
					this.chart3.clear();
					this.chart3.setOption(chart3_option);
					const el4 = this.$refs.echart4;
					this.chart4 = echarts.init(el4);
					this.chart4.clear();
					this.chart4.setOption(chart4_option);
					this.isQuering = false;
				}).catch((msg) => {
					this.isQuering = false;
					showMsgbox(msg);
				})
	    },
		  handleYearChange(value) {
			  this.monthQuerying = true;
    		getListByYear({
			    schoolId: getUserInfo().schoolId,
			    year: value
		    }).then((res) => {
			    const option = {
				    title: {
					    left: 20,
						    top: 16,
						    text: '月度空间使用情况',
						    textStyle: {
						    fontSize: 20,
							    color: '#222',
					    }
				    },
				    xAxis: {
					    type: 'category',
						    data: res.map(item => `${item.month}月`),
				    },
				    yAxis: {
					    type: 'value',
						    name: '(G)',
						    nameLocation: 'end',
				    },
				    grid: {
					    top: 100,
						    left: 100,
						    width: 560,
						    height: 242,
						    containLabel: true,
				    },
				    series: [{
					    data: res.map(itm => itm.size),
					    type: 'bar',
					    label: {
						    show: true,
						    position: 'top'
					    },
					    itemStyle: {
						    color: '#65A6FD',
						    shadowOffsetX: 5,
						    shadowOffsetY: 5,
						    shadowColor: 'rgba(0, 0, 0, 0.3)'
					    },
					    backgroundStyle: {
						    color: '#65A6FD',
						    shadowOffsetX: 5,
						    shadowOffsetY: 5
					    }
				    }]
			    }
			    const el3 = this.$refs.echart3;
			    this.chart3 = echarts.init(el3);
			    this.chart3.clear();
			    this.chart3.setOption(option);
			    this.monthQuerying = false;
		    })
		  }
	  }
  };
</script>
<style lang="scss" scoped>
	.storage-bg {
		width: 100%;
		height: 100%;
		overflow: auto;
		.wrapper {
			padding: 40px 45px 40px 40px;
			width: 1680px;
			box-sizing: border-box;
		}
		.line {
			display: flex;
			width: 100%;
			box-sizing: border-box;
		}
		.select {
			position: absolute;
			z-index: 1;
			left: 500px;
			top: 30px;
			right: 30px;
			display: flex;
			align-items: center;
			white-space: nowrap;
			.el-select {
				margin-left: 3px;
			}
		}
		.line + .line {
			margin-top: 40px;
		}
		.month {
			height: 440px;
			width: 780px;
			position: relative;
		}
	}
	.frag {
		height: 440px;
		width: 780px;
		box-shadow: 0 3px 15px 0 rgba(44,24,3,0.15);
	}
	.frag + .frag {
		margin-left: 35px;
	}
	.month + .frag {
		margin-left: 35px;
	}
</style>
