<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/listHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{cf.twoTitle}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{cf.threeTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <space height="8"></space>
    <el-row>
      <el-button type="primary" size="small" @click="$store.commit('openDialogAdd',cf.listIndex)">新增</el-button>
    </el-row>
    <space height="10"></space>
    <!-------------------条件搜索框--------------------->
    <dynamicForm
      @submit1="getOrderList"
      @submit2="resetField()"
      :cf="cfSearchForm"
      :formData="Objparma"
    ></dynamicForm>
    <space height="12"></space>

    <!------------主列表--------->
    <el-table
      :data="tableData"
      border
      :stripe="true"
      :cell-style="{padding:'3px'}"
      :header-cell-style="{padding:'6px'}"
      style="width: 100%"
    >
      <el-table-column label="id" prop="P1" :width="60" type="selection"></el-table-column>
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        v-for="column in cf.columns"
        :key="column.prop"
        :formatter="column.formatter"
      ></el-table-column>

      <el-table-column label="查看订单详情" width>
        <template slot-scope="scope">
          <router-link :to="'/listnewpage?P1=' + scope.row.P1">
            <el-button
              title="订单详情"
              index="listnewpage"
              route="/listnewpage"
              icon="el-icon-notebook-2"
              circle
              size="mini"
            ></el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="changePageSize"
      :total="allCount"
      :page-sizes="[1,2,5,10]"
      style="float:right;margin:10xp 0 0 0;"
    ></el-pagination>

    <listDialogs ref="listDialogs" :cf="cf">
      <!--列表用到的各种弹窗-->
    </listDialogs>
  </div>
</template>
<script>
import Vue from "vue";
import listDialogs from "./list-dialogs";
import dynamicForm from "./dynamic-form";
export default {
  components: { listDialogs, dynamicForm }, //注册组件
  props: {
    cf: {
      //列表的配置
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      //------------------筛选表单组件配置--------------
      cfSearchForm: {
        inline: true,
        formItems: this.cf.searchFormItems,
        btns: [
          { text: "查询", event: "submit1", type: "primary" },
          { text: "取消", event: "submit2", type: "primary" }
        ]
      },
      //------------------列表的数据总量--------------
      allCount: null,
      //------------------ajax请求数据列表的传参对象--------------
      Objparma: {
        status: "",
        pageIndex: 1, //第1页
        pageSize: 10, //每页10条
        P1: ""
      },
      tableData: [] //列表数据
    };
  },
  methods: {
    showDetail(row) {
      this.$store.commit("openDialogDetail", {
        listIndex: this.cf.listIndex,
        row: row
      });
    },
    //-------------处理分页变动函数--------------
    handleCurrentChange(pageIndex) {
      this.Objparma.pageIndex = pageIndex; //改变ajax传参的第几页
      this.getpage(); //第一次加载此函数，页面才不会空
    },
    //-------------ajax获取产品列表函数--------------
    getOrderList() {
      if (this.Objparma.state != undefined) {
        if (this.Objparma.state == "已下单,未付款") {
          this.Objparma.status = 1;
        } else if (this.Objparma.state == "已付款,未发货") {
          this.Objparma.status = 2;
        } else if (this.Objparma.state == "已发货") {
          this.Objparma.status = 3;
        } else if (this.Objparma.state == "已完成") {
          this.Objparma.status = 4;
        } else if (this.Objparma.state == "已取消") {
          this.Objparma.status = 5;
        }
      }
      axios({
        //请求接口
        method: "post",
        url: this.cf.url.list,
        data: {
          findJson: {
            P1: this.Objparma.P1,
            status: this.Objparma.status
          }
        } //传递参数
      })
        .then(response => {
          console.log("第一次请求结果", response.data);
          let { list, page } = response.data; //解构赋值
          this.tableData = list;
          this.page = page;
          this.allCount = page.allCount; //更改总数据量

          //this.tableData.forEach(tableDataEach => {});

          var i = 0;
          //第一重循环订单列表
          for (let index = 0; index < this.tableData.length; index++) {
            //第二重循环订单列表中的商品列表
            //判断状态,给对应的状态重新赋值回显
            if (this.tableData[i].status == 1) {
              //判断
              tableDataEach.state = "已下单,未付款";
            } else if (tableDataEach.status == 2) {
              tableDataEach.state = "已付款,未发货";
            } else if (tableDataEach.status == 3) {
              tableDataEach.state = "已发货";
            } else if (tableDataEach.status == 4) {
              tableDataEach.state = "已完成";
            } else if (tableDataEach.status == 5) {
              tableDataEach.state = "已取消";
            } else {
              tableDataEach.state = "未知状态";
            }

          });
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    //-------------分页查询---------------------
    getOrderPaging() {
      if (this.Objparma.state != undefined) {
        if (this.Objparma.state == "已下单,未付款") {
          this.Objparma.status = 1;
        } else if (this.Objparma.state == "已付款,未发货") {
          this.Objparma.status = 2;
        } else if (this.Objparma.state == "已发货") {
          this.Objparma.status = 3;
        } else if (this.Objparma.state == "已完成") {
          this.Objparma.status = 4;
        } else if (this.Objparma.state == "已取消") {
          this.Objparma.status = 5;
        }
      }
      axios({
        //请求接口
        method: "post",
        url: this.cf.url.list,
        data: this.Objparma
        //传递参数
      })
        .then(response => {
          console.log("第一次请求结果", response.data);
          let { list, page } = response.data; //解构赋值
          this.tableData = list;
          this.page = page;
          this.allCount = page.allCount; //更改总数据量

          var i = 0;
          //第一重循环订单列表
          for (let index = 0; index < this.tableData.length; index++) {
            //判断状态,给对应的状态重新赋值回显
            if (this.tableData[i].status == 1) {
              //判断
              this.tableData[i].state = "已下单,未付款";
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].state = "已付款,未发货";
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].state = "已发货";
            } else if (this.tableData[i].status == 4) {
              this.tableData[i].state = "已完成";
            } else if (this.tableData[i].status == 5) {
              this.tableData[i].state = "已取消";
            } else {
              this.tableData[i].state = "未知状态";
            }
            i++;
          }
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    //--------------点击取消初始化查询条件---------
    resetField() {
      this.Objparma = {};
      this.getpage();
    },
    //-------------判断--------------
    getpage() {
      if (this.Objparma.status != "") {
        this.getOrderList();
      } else {
        this.getOrderPaging();
      }
    },
    //-------------------------修改下拉框的值改变事件函数-------------------------
    changePageSize(pageSize) {
      this.Objparma.pageSize = pageSize; //改变的每页的数据量
      this.getpage(); //调用获取产品列表的函数
    }
  },
  created() {
    let objState = {
      //列表的vuex初始状态对象
      isShowDialogAdd: false, //是否显示新增弹窗
      isShowDialogDetail: false, //是否显示详情弹窗
      row: {} //当前查看详情的行数据
    };

    this.$store.commit("initListState", {
      //改变列表的初始状态值
      listIndex: this.cf.listIndex,
      objState: objState
    });

    this.$store.commit("changeActiveMenu", this.cf.listIndex); //菜单聚焦

    if (localStorage.isLogin != "1") {
      //如果未登录
      this.$router.push({ path: "/login" }); //跳转到登录页
    }
  },
  activated: function() {
    this.getpage();
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
</style>
