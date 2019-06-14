<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/listHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{cf.twoTitle}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{cf.threeTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <space height="8"></space>
    <el-row>
      <el-button
        type="primary"
        v-if="cf.flagAdd"
        size="small"
        @click="$store.commit('openDialogAdd',cf.listIndex)"
      >新增</el-button>
      <space height="32" v-else></space>
    </el-row>
    <space height="10"></space>

    <dynamicForm @submit1="searchList" :cf="cfSearchForm" :formData="Objparma"></dynamicForm>

   
    <space height="12"></space>

    <!--主列表-->
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

      <el-table-column label="操作" width>
        <template slot-scope="scope">
        
          <router-link to="/listnewpage" >
            <el-button
              title="订单详情"
              index="listnewpage"
              route="/listnewpage"
              icon="el-icon-notebook-2"
              circle
              size="mini"
              @click="getData(scope.row)"
            ></el-button>
          </router-link>

          <!-- <el-button
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
          ></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handleCurrentChange"
      :total="allCount"
      style="float:right;margin:10px 0 0 0"
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
  methods: {
    showDetail(row) {
      this.$store.commit("openDialogDetail", {
        listIndex: this.cf.listIndex,
        row: row
      });
    },
    //-------------确认删除产品的函数--------------
    confirmDelete(proId) {
      this.$confirm("确认删除该产品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            //请求接口
            method: "post",
            url: this.cf.url.delete,
            data: {
              findJson: {
                //用于定位要修改的数据
                P1: proId
              }
            } //传递参数
          })
            .then(response => {
              this.$message({
                message: "删除产品成功",
                duration: 1500,
                type: "success"
              });
              this.getProList(); //更新产品列表
            })
            .catch(function(error) {
              alert("异常:" + error);
            });
        })
        .catch(() => {});
    },
    //-------------查询列表的函数--------------
    searchList() {
      // alert("searchList");
      this.getProList(); //第一次加载此函数，页面才不会空
    },
    //-------------处理分页变动函数--------------
    handleCurrentChange(pageIndex) {
      this.Objparma.pageIndex = pageIndex; //改变ajax传参的第几页
      this.getProList(); //第一次加载此函数，页面才不会空
    },
    //-------------ajax获取产品列表函数--------------
    getProList() {
      axios({
        //请求接口
        method: "post",
        url: this.cf.url.list,
        data: {
          findJson: {
            P1: this.Objparma.P1
          }
        } //传递参数
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
            //第二重循环订单列表中的商品列表
            for (let j = 0; j < this.tableData[i].commodityList.length; j++) {}
            //判断状态,给对应的状态重新赋值回显
            if (this.tableData[i].status == 1) {
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
    getData(order) {
      this.cf.order = order;
      this.$store.commit("listnewOrder", this.cf);
    },
  },

  data() {
    return {
      //------------------筛选表单组件配置--------------
      cfSearchForm: {
        inline: true,
        formItems: this.cf.searchFormItems,
        btns: [{ text: "查询", event: "submit1", type: "primary" }]
      },

      //------------------列表的数据总量--------------
      allCount: 20,
      //------------------ajax请求数据列表的传参对象--------------
      Objparma: {
        brandMuti: [],
        pageIndex: 1, //第1页
        pageSize: 10, //每页10条
        P1: ""
      },
      tableData: [] //列表数据
    };
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
</style>
