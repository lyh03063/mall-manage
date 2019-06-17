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
            width: 80
          },
          {
            label: "用户名",
            prop: "userName",
            width: 140
          },
          {
            label: "订单状态",
            prop: "state",
            width: 150
          },
          {
            label: "备注信息",
            prop: "leaveMsg",
            width: 150
          },
          {
            label: "拓展信息",
            prop: "extend.aaa",
            width: 150
          },

        ],
        //-------筛选表单字段数组-------
        searchFormItems: [
          {
            label: "搜索订单",
            prop: "P1",
            type: "input"
          },
          {
            label: "订单状态",
            prop: "status",
            type: "select",
            options: [
              { label: "已下单,未付款", value: "1" },
              { label: "已付款,未发货", value: "2" },
              { label: "已发货", value: "3" },
              { label: "已完成", value: "4" },
              { label: "已取消", value: "5" },             
            ]
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
      }
    };
  },
  beforeCreate() {
    this.$store.commit("changeActiveMenu", "listOrder"); //菜单聚焦
  },
};
</script>


<style>
</style>
