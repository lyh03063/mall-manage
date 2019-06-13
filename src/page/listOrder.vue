<template>
  <div class>
    <listData :cf="cfList"></listData>
  </div>
</template>
<script>
import listData from "../components/list-data/list-order-data.vue";

export default {
  components: { listData },
  data() {
    return {
      cfList: {
        listIndex: "listOrder", //vuex对应的字段
        twoTitle: "会员/订单",
        threeTitle: "订单列表",
        orderTitle:"订单详情",
        flagAdd: false,

        url: {
          list: "http://120.76.160.41:3000/crossList?page=mabang-order", //列表接口
          add: "http://120.76.160.41:3000/crossList?page=mabang-order", //新增接口
          modify: "http://120.76.160.41:3000/crossList?page=mabang-order", //修改接口
          delete: "http://120.76.160.41:3000/crossList?page=mabang-order" //删除接口
        },
        //-------列配置数组-------
        columns: [
          {
            label: "订单ID",
            prop: "P1",
            width: 50
          },
          {
            label: "订单编号",
            prop: "_id",
            width: 210
          },
          {
            label: "用户名",
            prop: "userName",
            width: 120
          },
          {
            label: "订单状态",
            prop: "state",
            width: 130
          },
          {
            label: "备注信息",
            prop: "leaveMsg",
            width: 100
          },
          {
            label: "拓展信息",
            prop: "extend.aaa",
            width: 100
          },
          // {
          //   label: "订单创建时间",
          //   prop: "CreateTime",
          //   width: 100
          // },
          // {
          //   label: "订单修改时间",
          //   prop: "UpdateTime",
          //   width: 100
          // }
        ],
        //-------筛选表单字段数组-------
        searchFormItems: [
          {
            label: "搜索订单",
            prop: "P1",
            type: "input"
          }
        ],
        //-------详情字段数组-------
        detailItems: [
          {
            label: "商品名称",
            prop: "name"
          },
          {
            label: "商品数量",
            prop: "byCount"
          },
          {
            label: "商品价格",
            prop: "price"
          },
          {
            label: "运费",
            prop: "freight"
          }
        ],
        //-------新增、修改表单字段数组-------
        formItems: [
          {
            label: "分类名称",
            prop: "name",
            type: "input"
          },
          {
            label: "注释",
            prop: "remark",
            type: "textarea"
          }
        ],
        //--------------------订单详情页的字段------------------
        orderItems: [
          {
            label: "商品ID",
            prop: "P1",
            width: 100
          },
          {
            label: "商品名称",
            prop: "name",
            width: 100
          },
          {
            label: "商品单价",
            prop: "price",
            width: 100
          },
          {
            label: "商品数量",
            prop: "byCount",
            width: 100
          },
          {
            label: "运费",
            prop: "freight",
            width: 100
          },
        ],
      }
    };
  },
  // mounted() {
  //   this.$store.commit("listnewOrder", this.cfList);
  // },
  beforeCreate() {
    this.$store.commit("changeActiveMenu", "listOrder"); //菜单聚焦
  },
  
};
</script>


<style>
</style>
