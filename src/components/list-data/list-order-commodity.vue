<template>
  <div class="main">
    <!---------------------面包屑标题------------------------>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/listHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/listOrder' }">订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <space height="30"></space>
    <!--------------------------------新增按钮---------------------->
    订单用户:{{totalData.userName}}
    <space height="10"></space>
    <!------------------------------主列表--------------------------->
    <el-table
      :data="totalData.commodityList"
      :stripe="true"
      :border="true"
      width="100%"
      size="medium"
    >
      <el-table-column prop="P1" label="商品ID" width="100"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
      <el-table-column prop="price" label="商品单价" width="100"></el-table-column>
      <el-table-column prop="byCount" label="商品数量" width="100"></el-table-column>
      <el-table-column prop="freight" label="运费" width="100"></el-table-column>
      <el-table-column label="修改数量" width>
        <template slot-scope="scope">
          <el-button
            title="增加"
            icon="el-icon-plus"
            size="mini"
            circle
            type="index"
            v-if="totalData.status == 1"
            @click="updateCommodityCount(scope.row,1)"
          ></el-button>
          <el-button
            title="减少"
            icon="el-icon-minus"
            size="mini"
            circle
            @click="updateCommodityCount(scope.row,2)"
            v-if="scope.row.byCount > 1 && totalData.status == 1"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-------------------------------分割线----------------------------------->
    <space height="8"></space>
    <table class="ordertable">
      <tr v-for="item in tdData" :key="item.row">
        <td>{{item.row}}</td>
        <td>{{item.value}}</td>
      </tr>
    </table>
    <space height="8"></space>

    <el-form ref="form" v-model="form" label-width="80px">
      <el-form-item label="订单状态">
        <el-select placeholder="修改订单状态" v-model="form.region">
          <el-option
            v-for="item in statusArray"
            :key="item.value"
            :label="item.status"
            :value="item.value"
          ></el-option>
        </el-select>&nbsp;&nbsp;
        <el-button type="primary" @click="updateCommodityStatus">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import Vue from "vue";

import listDialogs from "./list-dialogs";
import { ALPN_ENABLED } from "constants";
import { all } from "q";
export default {
  components: { listDialogs }, //注册组件

  data() {
    return {
      url: {
        list: "http://120.76.160.41:3000/crossList?page=mabang-order", //列表接口
        add: "http://120.76.160.41:3000/crossList?page=mabang-order", //新增接口
        modify: "http://120.76.160.41:3000/crossModify?page=mabang-order", //修改接口
        delete: "http://120.76.160.41:3000/crossList?page=mabang-order" //删除接口
      },
      // Objparma: {
      //   brandMuti: [],
      //   pageIndex: 1, //第1页
      //   pageSize: 10 //每页10条
      // },
      statusArray: [
        { status: "已下单,未付款", value: 1 },
        { status: "已付款,未发货", value: 2 },
        { status: "已发货", value: 3 },
        { status: "已完成", value: 4 },
        { status: "已取消", value: 5 }
      ],
      tdData:[
        { row: "收货地址", value: 0 },
        { row: "收货人电话", value: 0 },
        { row: "收货人", value: 0 },
        { row: "订单创建时间", value: 0 },
        { row: "订单修改时间", value: 0 },
        { row: "订单编号", value: 0 },
        { row: "订单状态", value: 0 },
        { row: "订单商品总数", value: 0 },
        { row: "订单总价", value: 0 },
        { row: "运费", value: 0 },
        { row: "合计", value: 0 },
      ],
      form: { region: "" },
      totalData:{},
      State: "" //单前订单状态
    };
  },
  methods: {
    getOrder() {
      axios({
        method: "post",
        url: this.url.list,
        data: {
          findJson: {
            P1: this.$route.query.P1
          }
        }
      })
        .then(response => {
          console.log("第一次请求结果", response.data);
          let { list } = response.data; //解构赋值

          this.totalData = list[0]
          //初始化数据
          this.tdData[8].value = 0;
          this.tdData[7].value = 0;
          this.tdData[9].value = 0;

          this.tdData[0].value = this.totalData.postAddress.address
          this.tdData[1].value = this.totalData.postAddress.phone
          this.tdData[2].value = this.totalData.postAddress.name
          this.tdData[3].value = this.totalData.CreateTime
          this.tdData[4].value = this.totalData.UpdateTime
          this.tdData[5].value = this.totalData._id
          this.tdData[6].value = this.totalData.status 

          this.totalData.commodityList.forEach(commodityEach => {
            //订单总金额
            this.tdData[8].value += commodityEach.price * commodityEach.byCount;
            //订单的商品总数量
            this.tdData[7].value += parseInt(commodityEach.byCount);
            //订单运费totalFreight
            this.tdData[9].value += parseInt(commodityEach.freight);
          });
          this.tdData[10].value = this.tdData[8].value + this.tdData[9].value

          this.statusArray.forEach((element, index) => {
            if (this.totalData.status == index) {
              index--
              this.tdData[6].value = this.statusArray[index].status;
            }
          });
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    updateCommodityStatus() {
      if (this.form.region == "") {
        this.$message.error("请先选择订单状态");
        return;
      }
      axios({
        //请求接口
        method: "post",
        url: this.url.modify,
        data: {
          findJson: {
            P1: this.$route.query.P1
          },
          modifyJson: {
            status: this.form.region
          }
        } //传递参数
      })
        .then(response => {
          console.log("第一次请求结果", response.data);
          let { code, message } = response.data; //解构赋值
          this.statusArray.forEach((element, index) => {
            if (this.form.region == index) {
              this.tdData[6].value = this.statusArray[index].status;
              this.$message({
                message: "修改状态订单成功",
                type: "success"
              });
            }
          });

          this.form.region = "";
          this.getOrder();
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    updateCommodityCount(row, i) {
      this.totalData.commodityList.forEach(commodityEach => {
        if (commodityEach.P1 == row.P1) {
          if (i == 1) {
            commodityEach.byCount++;
          } else if (i == 2 && commodityEach.byCount > 1) {
            commodityEach.byCount--;
          } else {
            this.$message("数量不能小于1");
            return;
          }
        }
      });
      axios({
        method: "post",
        url: this.url.modify,
        data: {
          findJson: {
            P1: this.$route.query.P1
          },
          modifyJson: {
            commodityList: this.totalData.commodityList
          }
        } //传递参数
      })
        .then(response => {
          console.log("第一次请求结果", response.data);
          let { code, message } = response.data; //解构赋值
          this.$message({
            message: "修改数量成功",
            type: "success"
          });
          this.getOrder();
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    }
  },
  activated() {
    this.getOrder();
  },
  filters: {
    //过滤器
    //时间戳转日期
    formatDate(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    }
  }
};
</script>
<style scoped>
/* 表格样式start */
.ordertable table {
  width: 100%;
  margin: 15px 0;
  margin-top: 10px;
  border: 0;
}
.ordertable tr:hover {
  background-color: #fafafa;
}
.ordertable,
.ordertable td {
  color: #606266;
  width: 50%;
  font-size: 0.95em;
  text-align: left;
  padding: 4px;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}

.ordertable td:first-child {
  font-weight: bolder;
  color: #9a9599;
  padding: 10px;
  margin: 10px;
}
.ordertable tr:nth-child(2n + 1) {
  background-color: #fafafa;
}

/* 表格样式end */
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>