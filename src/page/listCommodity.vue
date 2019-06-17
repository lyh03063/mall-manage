<template>
  <div class>
    <listData :cf="cfList"></listData>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import listData from "../components/list-data/list-data.vue";
export default {
  components: { listData, quillEditor },
  data() {
    return {
      cfList: {
        listIndex: "listProduct", //vuex对应的字段
        title: "商品列表",
        flag: true,
        url: {
          list: "http://120.76.160.41:3000/crossList?page=mabang-commodity", //列表接口
          add: "http://120.76.160.41:3000/crossAdd?page=mabang-commodity", //新增接口
          modify: "http://120.76.160.41:3000/crossModify?page=mabang-commodity", //修改接口
          detail: "http://120.76.160.41:3000/crossDetail?page=mabang-commodity", //查看单条数据详情接口
          delete: "http://120.76.160.41:3000/crossDelete?page=mabang-commodity" //删除接口
        },
        //-------列配置数组-------
        columns: [
          {
            label: "商品id",
            prop: "P1",
            width: 70
          },
          {
            label: "商品名称",
            prop: "name",
            width: 200
          },
          {
            label: "价格",
            prop: "price",
            width: 70
          },
          {
            label: "运费",
            prop: "freight",
            width: 70
          },
          {
            label: "库存",
            prop: "store",
            width: 70
          },
          {
            label: "分类编号",
            prop: "category",
            width: 70
          },
          {
            label: "图片",
            prop: "album",
            width: 120,
            formatter1(row, column) {
              console.log("row", row);
              var strAlbum = JSON.stringify(row.album); //变量定义：{000Json字符串}-函数调用：{Json对象转换Json字符串函数}
              //格式器
              return `商品：${strAlbum}`;
            }
          }
        ],
        //-------筛选表单字段数组-------
        searchFormItems: [
          {
            label: "商品id",
            prop: "P1",
            type: "input"
          },
          {
            label: "商品名称",
            prop: "name",
            type: "input",
            handle(formData, propOrigin, propOperate) {
              //处理器
              formData[propOrigin] = {
                $regex: formData[propOperate],
                $options: "i"
              };
            }
          },
          {
            label: "分类编号",
            prop: "category",
            type: "input"
          }
        ],
        //-------详情字段数组-------
        detailItems: [
          {
            label: "商品id",
            prop: "P1",
            width: 100
          },
          {
            label: "商品名称",
            prop: "name",
            width: 100,
            formatter(row) {
              //自定义格式

              return `<b>${row.name}</b>`;
            }
          },
          {
            label: "商品简介",
            prop: "description",
            width: 100
          },
          {
            label: "商品详情",
            prop: "detail",
            width: 100
          },
          {
            label: "价格",
            prop: "price",
            width: 100
          },
          {
            label: "运费",
            prop: "freight",
            width: 100
          },
          {
            label: "库存",
            prop: "store",
            width: 100
          },
          {
            label: "分类编号",
            prop: "category",
            width: 100
          },
          {
            label: "图片",
            prop: "album",
            width: 100,
            formatter(row) {
              //自定义格式
              let htmlResult = ""; //需要拼装的html代码
              if (row.album && row.album.length) {
                //如果相册数组存在
                row.album.forEach(albumEach => {
                  //循环：{相册数组}
                  htmlResult += `<img class="F1 W100 H100" src="${
                    albumEach.url
                  }" alt="" >`;
                });
              }
              return htmlResult;
            }
          }
        ],
        //-------新增、修改表单字段数组-------
        formItems: [
          {
            label: "商品名称",
            prop: "name",
            type: "input"
          },
          {
            label: "商品简介",
            prop: "description",
            type: "input"
          },
          {
            label: "商品详情",
            prop: "detail",
            type: "input"
          },
          {
            label: "价格",
            prop: "price",
            type: "input"
          },
          {
            label: "运费",
            prop: "freight",
            type: "input"
          },
          {
            label: "库存",
            prop: "store",
            type: "input"
          },
          {
            label: "图片",
            prop: "album",
             type: "jsonEditor"
          }
        ]
      }
    };
  },
  beforeCreate() {
    this.$store.commit("changeActiveMenu", "listProduct"); //菜单聚焦
  }
};
</script>


<style>
</style>
