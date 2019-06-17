<template>
  <div class="main">
    <!---------------------面包屑标题------------------------>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/listHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员/订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <space height="8"></space>
    <!--------------------------------新增按钮---------------------->
    <el-row>
      <el-button type="primary" v-if="false" size="small">新增</el-button>
      <space height="32" v-else></space>
    </el-row>
    <router-link to="/listOrder" icon="el-icon-notebook-2">
      <el-button style="float:right">返回上一级</el-button>
    </router-link>
    <space height="10"></space>
    <!------------------------------主列表--------------------------->
    <el-table
      :data="totalData.commodityList"
      :stripe="true"
      :border="true"
      width="100%"
      size="medium"
    >
      <el-table-column        
        prop="P1"
        label="商品ID"
        width="100"
      ></el-table-column>
      <el-table-column        
        prop="name"
        label="商品名称"
        width="100"
      ></el-table-column>
      <el-table-column        
        prop="price"
        label="商品单价"
        width="100"
      ></el-table-column>
      <el-table-column        
        prop="byCount"
        label="商品数量"
        width="100"
      ></el-table-column>
      <el-table-column        
        prop="freight"
        label="运费"
        width="100"
      ></el-table-column>
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
      <tr>
        <td>收货地址</td>
        <td>{{totalData.postAddress.address}}</td>
      </tr>

      <tr>
        <td>收货人电话</td>
        <td>{{totalData.postAddress.phone}}</td>
      </tr>

      <tr>
        <td>收货人</td>
        <td>{{totalData.postAddress.name}}</td>
      </tr>

      <tr>
        <td>订单创建时间</td>
        <td>{{totalData.CreateTime | formatDate}}</td>
      </tr>

      <tr>
        <td>订单修改时间</td>
        <td>{{totalData.UpdateTime | formatDate}}</td>
      </tr>

      <tr>
        <td>订单状态</td>
        <td>{{State}}</td>
      </tr>

      <tr>
        <td>订单商品总数</td>
        <td>{{totalCount}}</td>
      </tr>

      <tr>
        <td>订单总价</td>
        <td>{{totalMoney}}</td>
      </tr>

      <tr>
        <td>运费</td>
        <td>{{totalFreight}}</td>
      </tr>

      <tr>
        <td>合计</td>
        <td>{{allTotalMoney}}</td>
      </tr>
    </table>
    <space height="8"></space>

    <el-form ref="form" v-model="form" label-width="80px">
      <el-form-item label="订单状态">
        <el-select placeholder="修改订单状态" v-model="form.region">
          <el-option label="已下单,未付款" value="1"></el-option>
          <el-option label="已付款,未发货" value="2"></el-option>
          <el-option label="已发货" value="3"></el-option>
          <el-option label="已完成" value="4"></el-option>
          <el-option label="已取消" value="5"></el-option>
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
      form: {
        region: ""
      },
      totalMoney: 0, //订单总金额
      totalCount: 0, //订单商品总数量
      totalFreight: 0, //订单总运费
      totalData: 0, //查询的数据列表
      allTotalMoney: 0, //订单总金额+订单总运费=总金额
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

          this.totalData = list[0];
          this.totalMoney = 0;
          this.totalCount = 0;
          this.totalFreight = 0;
         
          this.totalData.commodityList.forEach(commodityEach => {
            //订单总金额
            this.totalMoney += commodityEach.price * commodityEach.byCount;
            //订单的商品总数量
            this.totalCount += parseInt(commodityEach.byCount);
            //订单运费totalFreight
            this.totalFreight += parseInt(commodityEach.freight);
          });
          this.allTotalMoney = this.totalMoney + this.totalFreight;

          if (this.totalData.status == 1) {
            this.State = "已下单,未付款";
          } else if (this.totalData.status == 2) {
            this.State = "已付款,未下单";
          } else if (this.totalData.status == 3) {
            this.State = "已发货";
          } else if (this.totalData.status == 4) {
            this.State = "已完成";
          } else if (this.totalData.status == 5) {
            this.State = "已取消";
          }
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    updateCommodityStatus() {
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
          if (code == 0) {
            if (this.form.region == 1) {
              alert("修改订单成功");
              this.totalData.status = 1;
              this.State = "已下单,未付款";
            } else if (this.form.region == 2) {
              alert("修改订单成功");
              this.totalData.status = 2;
              this.State = "已付款,未下单";
            } else if (this.form.region == 3) {
              alert("修改订单成功");
              this.totalData.status = 3;
              this.State = "已发货";
            } else if (this.form.region == 4) {
              alert("修改订单成功");
              this.totalData.status = 4;
              this.State = "已完成";
            } else if (this.form.region == 5) {
              alert("修改订单成功");
              this.totalData.status = 5;
              this.State = "已取消";
            }
            this.form.region = "";
            this.getOrder();
          }
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
            alert("数量不能小于1");
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
          alert(message);
          this.getOrder();
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    }
  },
  computed: {
    row() {
      //来自vuex的当前行数据
      return this.$store.state.obj;
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