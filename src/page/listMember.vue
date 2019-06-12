<template>
<div class="" >
     <listData :cf="cfList"></listData>
     
</div>

</template>
<script>
import listData from "../components/list-data/list-data.vue";

export default {
  components: { listData },
  data() {
    return {
      cfList: {
        listIndex:"listCategory",//vuex对应的字段
        twoTitle: "会员/订单",
        threeTitle:"订单详情",
        flag:false,
        url: {
          list: "http://120.76.160.41:3000/crossList?page=mabang-member",//列表接口
          add: "http://120.76.160.41:3000/crossAdd?page=category",//新增接口
          modify: "http://120.76.160.41:3000/crossModify?page=category",//修改接口
          delete: "http://120.76.160.41:3000/crossDelete?page=category"//删除接口
        },
       //-------列配置数组-------
        columns: [
          {
            label: "会员编号",
            prop: "P1",
            width: 100
          },
          {
            label: "会员名称",
            prop: "nickName",
            width: 200
          },
          {
            label: "会员延伸 ",
            prop: "extend",
            width: 100
          },
          {
            label: "会员头像",
            prop: "headImg",
            width: 200
          },
           {
            label: "会员性别",
            prop: "sex",
            width: 100
          },
           {
            label: "会员生日",
            prop: "birthday",
            width: 100
          },
           {
            label: "会员地区",
            prop: "area",
            width: 100
          },
           {
            label: "创建用户",
            prop: "CreateUser",
            width: 100
          },
        ],
         //-------筛选表单字段数组-------
        searchFormItems: [
          {
            label: "会员编号",
            prop: "proId",
            type: "input"
          }
        ],
        //-------详情字段数组-------
        detailItems: [
          {
            label: "会员编号",
            prop: "P1",
          },
          {
            label: "会员名称",
            prop: "name",
          },
          {
            label: "注释",
            prop: "remark",
          }
        ],
        //-------新增、修改表单字段数组-------
        formItems: [
          {
            label: "会员名称",
            prop: "name",
            type: "input",
          },
          {
            label: "注释",
            prop: "remark",
            type: "textarea"
          },
        ],
       
      }
    };
  },
  beforeCreate() {
    this.$store.commit("changeActiveMenu", "listCategory"); //菜单聚焦
  }
};

</script>


<style>
</style>
