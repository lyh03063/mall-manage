<template>
  <div class>
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
        listIndex: "listCategory", //vuex对应的字段
        twoTitle: "会员/订单",
        threeTitle: "订单详情",
        flag: true,
        url: {
          list: "http://120.76.160.41:3000/crossList?page=mabang-member", //列表接口
          add: "http://120.76.160.41:3000/crossAdd?page=mabang-member", //新增接口
          modify: "http://120.76.160.41:3000/crossModify?page=mabang-member", //修改接口
          delete: "http://120.76.160.41:3000/crossDelete?page=mabang-member" //删除接口
        },
        //-------列配置数组-------
        columns: [
          {
            label: "Id",
            prop: "P1",
            width: 60
          },
          {
            label: "用户名",
            prop: "userName",
            width: 120
          },
          {
            label: "呢称",
            prop: "nickName",
            width: 150
          },
          {
            label: "密码",
            prop: "password",
            width: 70,
            formatter: function(row) {
              return "*******";
            }
          },
          {
            label: "手机号",
            prop: "phone",
            width: 120
          },

          {
            label: "性别",
            prop: "sex",
            width: 65
          },
          {
            label: "生日",
            prop: "birthday",
            width: 100
          },
          {
            label: "创建时间",
            prop: "CreateTime",
            width: 120,
            formatter: function(row) {
              return "CreateTime";
            }
          }
        ],
        //-------筛选表单字段数组-------
        searchFormItems: [
          {
            label: "会员编号",
            prop: "P1",
            type: "input"
          },
          {
            label: "昵称",
            prop: "nickName",
            type: "input"
          }
        ],
        //-------详情字段数组-------
        detailItems: [
          {
            label: "Id",
            prop: "P1"
          },
          {
            label: "用户名",
            prop: "userName"
          },
          {
            label: "密码",
            prop: "password"
          },
          {
            label: "手机号",
            prop: "phone"
          },
          {
            label: "呢称",
            prop: "nickName"
          },
          {
            label: "性别",
            prop: "sex"
          },
          {
            label: "生日",
            prop: "birthday"
          },
          {
            label: "创建时间",
            prop: "CreateTime"
          }
        ],
        //-------新增、修改表单字段数组-------
        formItems: [
          {
            label: "用户名",
            prop: "userName",
            type: "input"
          },
          {
            label: "密码",
            prop: "password",
            type: "input"
          },
          {
            label: "手机号",
            prop: "phone",
            type: "input"
          },
          {
            label: "呢称",
            prop: "nickName",
            type: "input"
          },
          {
            label: "性别",
            prop: "sex",
            type: "input"
          },
          {
            label: "生日",
            prop: "birthday",
            type: "input"
          },
          {
            label: "创建时间",
            prop: "CreateTime",
            type: "input"
          },
          {
            label: "注释",
            prop: "remark",
            type: "textarea"
          }
        ]
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
