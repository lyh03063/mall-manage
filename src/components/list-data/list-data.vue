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
        v-if="cf.flag"
        type="primary"
        size="small"
        @click="$store.commit('openDialogAdd',cf.listIndex)"
      >新增</el-button>
      <space v-else height="32"></space>
    </el-row>
    <space height="10"></space>

    <dynamicForm @submit1="searchList" :cf="cfSearchForm" :formData="Objparma.findJson"></dynamicForm>

    <!--主列表-->
    <el-table
      :data="tableData"
      border
      :stripe="true"
      :cell-style="{padding:'3px'}"
      :header-cell-style="{padding:'6px'}"
      style="width: 100%;"
    >
      <el-table-column label="id" prop="P1" :width="40" type="selection"></el-table-column>
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
          <el-button
            title="详情"
            @click="showDetail(scope.row)"
            icon="el-icon-notebook-2"
            circle
            size="mini"
          ></el-button>
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
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,prev, pager, next"
      @current-change="handleCurrentChange"
      :total="allCount"
      style="float:right;margin:10px 0 0 0;"
    ></el-pagination>
    <listDialogs ref="listDialogs" :cf="cf">
      <template v-slot:[item.slot]="{row}" v-for="item in cf.detailItems">
        <!--根据cf.detailItems循环输出插槽--详情弹窗-->
        <slot :name="item.slot" :row="row" v-if="item.slot"></slot>
      </template>

      <!--这里的for循环的item不要跟上面的重名，否则冲突！！！所以使用formItem-->
      <template v-slot:[formItem.slot]="{formData}" v-for="formItem in cf.formItems">
        <!--根据cf.formItems循环输出插槽--新增修改表单弹窗-->
        <slot :name="formItem.slot" :formData="formData" v-if="formItem.slot"></slot>
      </template>

      <!--列表用到的各种弹窗-->
    </listDialogs>
    <div class></div>
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
    async confirmDelete(proId) {
      let clickStatus = await this.$confirm("确认删除该产品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});

      if (clickStatus == "confirm") {
        //用户点击了确认
        await axios({
          //请求接口
          method: "post",
          url: this.cf.url.delete,
          data: {
            findJson: {
              //用于定位要修改的数据
              P1: proId
            }
          } //传递参数
        }).catch(function(error) {
          alert("异常:" + error);
        });

        this.$message({
          message: "删除产品成功",
          duration: 1500,
          type: "success"
        });
        this.getProList(); //更新产品列表
      }
    },
    //-------------查询列表的函数--------------
    searchList() {
      this.getProList(); //第一次加载此函数，页面才不会空
    },

    //-------------处理分页变动函数--------------
    handleCurrentChange(pageIndex) {
      this.Objparma.pageIndex = pageIndex; //改变ajax传参的第几页
      this.getProList(); //第一次加载此函数，页面才不会空
    },
    //-------------ajax获取产品列表函数--------------
    getProList() {
      console.log("this.Objparma####", this.Objparma);
      axios({
        //请求接口
        method: "post",
        url: this.cf.url.list,
        data: this.Objparma
      })
        .then(response => {
          let { list, page } = response.data; //解构赋值
          this.tableData = list;
          this.page = page;
          this.allCount = page.allCount; //更改总数据量
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    }
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
        findJson: {},
        pageIndex: 1, //第1页
        pageSize: 10 //每页10条
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

  mounted() {
    //等待模板加载后，
    this.getProList(); //第一次加载此函数，页面才不会空
  }
};
</script>


<style>
</style>
