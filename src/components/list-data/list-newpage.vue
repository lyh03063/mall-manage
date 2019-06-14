<template>
  <div class="main">
    <!---------------------面包屑标题------------------------>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/listHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{row.twoTitle}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{row.threeTitle}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{row.orderTitle}}</el-breadcrumb-item>
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
      :data="row.order.commodityList"
      :stripe="true"
      :border="true"
      width="100%"
      size="medium"
    >
      <el-table-column
        v-for="order in row.orderItems"
        :key="order.prop"
        :prop="order.prop"
        :label="order.label"
        :width="order.width"
      ></el-table-column>
      <el-table-column label="修改数量" width>
        <el-button
          title="编辑"
          icon="el-icon-edit"
          size="mini"
          circle
          @click="$refs.listDialogs.showModify(scope.row)"
        ></el-button>
        <el-button
          title="删除"
          icon="el-icon-close"
          size="mini"
          circle
          @click="confirmDelete(scope.row.P1)"
        ></el-button>
      </el-table-column>
    </el-table>
    <!-------------------------------分割线----------------------------------->
    <div>
      <div style="float:right">订单创建时间:{{row.order.CreateTime | formatDate}}</div>
      <space height="8"></space>
      <div style="float:right">订单修改时间:{{row.order.UpdateTime | formatDate}}</div>
      <space height="8"></space>
      <div style="float:right">订单状态:{{row.order.state}}</div>
      <space height="8"></space>
      <div style="float:right">收货地址:{{row.order.postAddress.address}}</div>
      <space height="8"></space>
      <div style="float:right">收货人电话:{{row.order.postAddress.phone}}</div>
      <space height="8"></space>
      <div style="float:right">收货人:{{row.order.postAddress.name}}</div>
      <space height="8"></space>
      <div style="float:right">订单商品总数:{{totalCount}}</div>
      <space height="8"></space>
      <div style="float:right">订单总价:{{totalMoney}}</div>
      <space height="8"></space>
      <div style="float:right">运费:{{totalFreight}}</div>
      <space height="8"></space>
      <div style="float:right">合计:{{allCount}}</div>
      <space height="8"></space>
      <!-- <el-button type="primary" style="float:right" v-if="row.order.status==1">等待客户支付</el-button> -->
      <el-button type="primary" style="float:right" v-if="row.order.status==2" @click="updatePrlList(3)">发货</el-button>
      <el-button type="success" style="float:right" v-if="row.order.status==3" @click="updatePrlList(4)">完成订单</el-button>    
      <!-- <el-button type="success" style="float:right" v-if="row.order.status==4">订单已完成</el-button> -->
      <!-- <el-button type="danger" style="float:right" disabled v-if="row.order.status==5">订单已取消</el-button> -->
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import listDialogs from "./list-dialogs";
import { ALPN_ENABLED } from 'constants';
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
      Objparma: {
        brandMuti: [],
        pageIndex: 1, //第1页
        pageSize: 10 //每页10条
      },
      totalMoney: 0,
      totalCount: 0,
      totalFreight: 0,
      allCount: 0,
    };
  },
  methods: {
    getProList() {
       this.totalMoney=0
       this.totalCount=0
       this.totalFreight=0
      //当前订单   
      for (let index = 0;index < this.row.order.commodityList.length;index++ ) {  
        //订单总金额,
        this.totalMoney +=
          this.row.order.commodityList[index].price *
          this.row.order.commodityList[index].byCount;
          
        //订单的商品总数量
        this.totalCount += parseInt(this.row.order.commodityList[index].byCount);

       //订单运费totalFreight
        this.totalFreight += parseInt(this.row.order.commodityList[index].freight);               
      }
      this.allCount = this.totalMoney+this.totalFreight
      
    },
    updatePrlList(condition) {
      axios({
        //请求接口
        method: "post",
        url: this.url.modify,
        data: {
          findJson: {
            P1: this.row.order.P1
          },
          modifyJson: {
            status: condition
          }
        } //传递参数
      })
        .then(response => {         
          console.log("第一次请求结果", response.data);
          let { code, message } = response.data; //解构赋值
          if(code == 0 ){
            if (condition == 3) {
              alert("订单发货成功");
              this.row.order.status = 3
              this.row.order.state="已发货"
            }else {
              alert("订单已完成")
             this.row.order.status = 4
              this.row.order.state="已完成"
            }         
          }    
              
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
  },
  computed: {
    row() {
      //来自vuex的当前行数据
      return this.$store.state.obj;
    }
  },
  activated() {
    this.getProList();   
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
<style>
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