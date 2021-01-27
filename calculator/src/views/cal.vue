<template>
  <div class="wrap">
    <div class="header">
      <div class="search">
        <el-row :gutter="gutter" class="rows">
          <el-col :span="6"
            ><el-input v-model="total" placeholder="请输入本金"></el-input
          ></el-col>
          <el-col :span="6"
            ><el-input v-model="Yrate" placeholder="请输入年利率"></el-input
          ></el-col>
           <el-col :span="6"
            ><el-input v-model="yearY" placeholder="请输入年限" @input="change"></el-input
          ></el-col>
          <el-col :span="6"
            ><el-input v-model="year" placeholder="请输入贷款期数"></el-input
          ></el-col>
        </el-row>
      </div>
      <div class="btn-wrap">
        <div class="btn-left">
          <el-input v-model="number" placeholder="计算期数" /><el-button
            type="primary"
            @click="cal"
            >利息相差额计算</el-button
          >
        </div>
        <div class="btns">
          <el-button type="primary" @click="count">计算</el-button>
          <el-button @click="clear">清除</el-button>
        </div>
      </div>
    </div>
    <div class="info" v-show="differ">
      贷款<span>{{ year }}</span
      >期，前<span>{{ number }}</span
      >期等额本息和等额本金利息相差<span>{{ differ }}</span
      >元
    </div>
    <div class="main">
      <div class="left">
        <div class="l-title">等额本息</div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="期次" width="50">
          </el-table-column>
          <el-table-column prop="pai" label="偿还本息"> </el-table-column>
          <el-table-column prop="interest" label="偿还利息"> </el-table-column>
          <el-table-column prop="principal" label="偿还本金"> </el-table-column>
          <el-table-column prop="accumulation" label="利息累计" width="100">
          </el-table-column>
        </el-table>
      </div>
      <div class="border"></div>
      <div class="right">
        <div class="l-title">等额本金</div>
        <el-table :data="tableDatas" style="width: 100%">
          <el-table-column prop="accumulation" label="利息累计" width="100" />
          <el-table-column prop="principal" label="偿还本金" />
          <el-table-column prop="interest" label="偿还利息" />
          <el-table-column prop="pai" label="偿还本息" />
          <el-table-column prop="date" label="期次" width="50" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gutter: 10,
      value: "",
      options: [
        {
          value: "1",
          label: "等额本息",
        },
        {
          value: "2",
          label: "等额本金",
        },
      ],
      total: null || 500000,
      Yrate: null || 0.0588,
      rate: null, //年利率
      yearY:null || 20,//贷款年限
      year: null || 300,//贷款期数
      number: null,
      differ: null,
      tableData: [
        {
          accumulation: 0,
        },
      ],
      tableDatas: [
        {
          accumulation: 0,
          // principal: 0,
        },
      ],
    };
  },
  mounted() {},
  // 等额本息计算公式
  // 每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
  // 总支付利息：总利息=还款月数×每月月供额-贷款本金
  // 每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
  // 每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
  // 总利息=还款月数×每月月供额-贷款本金
  // 等额本金计算公式
  // 每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
  // 每月应还本金=贷款本金÷还款月数
  // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率。
  // 每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
  // 总利息=还款月数×(总贷款额×月利率-月利率×(总贷款额÷还款月数)*(还款月数-1)÷2+总贷款额÷还款月数)
  methods: {
    clear() {
      this.total = null;
      this.Yrate = null; //年利率
      this.yearY = null;
      this.year = null;
      this.number = null;
      this.differ = null;
    },
    change(){
 if(this.yearY) this.year = this.yearY*12
    },
    count() {
      if (this.Yrate) this.rate = this.Yrate / 12;
       this.tableData = [{accumulation: 0}];
       this.tableDatas = [{accumulation: 0}];
      this.debj();
      this.debx();
    },
    cal() {
      this.count();
      if(!this.number){
        alert('请先填写计算期数')
      }
      this.differ =
        (this.tableData[this.number].accumulation -
        this.tableDatas[this.number].accumulation).toFixed(2);
    },
    // 等额本金
    debj() {
      let total = this.total;
      //偿还本金
      let principal = (total / this.year).toFixed(2);
      for (let i = 1; i <= this.year; i++) {
        // 每月月供额
        let pai = (
          this.total / this.year +
          (this.total - (this.total - total)) * this.rate
        ).toFixed(2);
        //偿还利息
        let interest = (total * this.rate).toFixed(2);
        total = total - principal;
        //利息累计
        let accumulation = (
          parseFloat(this.tableDatas[i - 1].accumulation) + parseFloat(interest)
        ).toFixed(2);
        let obj = { date: i, pai, interest, principal, accumulation };
        this.tableDatas.push(obj);
      }
      this.tableDatas.splice(0, 1);
    } /*  */,
    //等额本息
    debx() {
      //偿还本息
      let pai = (
        (this.total * (this.rate * Math.pow(1 + this.rate, this.year))) /
        (Math.pow(1 + this.rate, this.year) - 1)
      ).toFixed(2);
      for (let i = 1; i <= this.year; i++) {
        //偿还利息
        let interest = (
          (this.total *
            this.rate *
            [
              Math.pow(1 + this.rate, this.year) -
                Math.pow(1 + this.rate, i - 1),
            ]) /
          (Math.pow(1 + this.rate, this.year) - 1)
        ).toFixed(2);
        //偿还本金
        let principal = (
          (this.total * this.rate * Math.pow(1 + this.rate, i - 1)) /
          (Math.pow(1 + this.rate, this.year) - 1)
        ).toFixed(2);
        //利息累计
        let accumulation = (
          parseFloat(this.tableData[i - 1].accumulation) + parseFloat(interest)
        ).toFixed(2);
        let obj = { date: i, pai, interest, principal, accumulation };
        this.tableData.push(obj);
      }
      this.tableData.splice(0, 1);
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.search {
  padding-bottom: 20px;
}
.rows {
  padding-top: 10px;
}
.btns {
  padding-bottom: 40px;
  display: flex;
  flex-direction: row-reverse;
}
.el-button {
  margin-right: 10px;
}
.main {
  display: flex;
}
.border {
  width: 2px;
  height: auto;
  background: #409eff;
  margin: 0 30px;
}
.btn-wrap {
  display: flex;
  justify-content: space-between;
}
.btn-left {
  display: flex;
}
.btn-left button {
  flex: 0 0 auto;
  height: 40px;

  line-height: 18px;
  margin-left: 10px;
}
.info {
  color: #999;
  margin: 10px 0;
}
.info span {
  color: #ff6600;
}
</style>