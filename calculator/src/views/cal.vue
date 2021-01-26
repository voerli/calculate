<template>
  <div class="wrap">
    <div class="header">
      <div class="search">
        <el-row :gutter="gutter" class="rows">
          <el-select v-model="value" placeholder="请选择分期类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-col :span="6"
            ><el-input v-model="total" placeholder="请输入本金"></el-input
          ></el-col>
          <el-col :span="6"
            ><el-input v-model="rate" placeholder="请输入年利率"></el-input
          ></el-col>
          <el-col :span="6"
            ><el-input v-model="year" placeholder="请输入期数"></el-input
          ></el-col>
        </el-row>
      </div>
      <div class="btns">
        <el-button type="primary">计算</el-button>
        <el-button>清除</el-button>
      </div>
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
          <el-table-column prop="accumulation" label="利息累计">
          </el-table-column>
        </el-table>
      </div>
      <div class="border"></div>
      <div class="right">
        <div class="l-title">等额本金</div>
        <el-table :data="tableDatas" style="width: 100%">
          <el-table-column prop="date" label="期次" width="50">
          </el-table-column>
          <el-table-column prop="pai" label="偿还本息"> </el-table-column>
          <el-table-column prop="interest" label="偿还利息"> </el-table-column>
          <el-table-column prop="principal" label="偿还本金"> </el-table-column>
          <el-table-column prop="accumulation" label="利息累计">
          </el-table-column>
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
      total: 500000,
      rate: 0.0588, //年利率
      year: 3,
      tableData: [
        {
          accumulation: 0,
        },
      ],
      tableDatas: [
        {
          accumulation: 0,
          principal:0
        },
      ],
    };
  },
  mounted() {
    this.rate = this.rate / 12;
    this.count();
  },
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
    count() {
      this.debj();
      this.debx();
    },
    // 等额本金
    debj() {
      for (let i = 1; i <= this.year; i++) {
        //剩余本金
        let total = this.total
        // 每月月供额
        let pai = (this.total / this.year + (total - 0) * this.rate).toFixed(2);
        //偿还利息
        let interest = (total * this.rate).toFixed(2);
        //偿还本金
        let principal = (total - this.year).toFixed(2);
           //利息累计
          let accumulation = (
          parseFloat(this.tableDatas[i - 1].accumulation) + parseFloat(interest)
        ).toFixed(2);
        let obj = { date: i, pai, interest, principal,accumulation };
     
        this.tableDatas.push(obj);
        
      }
      this.tableDatas.splice(0, 1);
    },/*  */
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
</style>