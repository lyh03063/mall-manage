<template>
  <div class>
    <!--显示大图弹窗-->
    <el-dialog
      custom-class="n-el-dialog"
      width="75%"
      title="显示大图"
      :close-on-press-escape="false"
      v-bind:visible.sync="showDialogBigImg"
      v-if="showDialogBigImg"
    >
      <div class="TAC">
        <img :src="urlBigImg" alt>
      </div>
    </el-dialog>

    <listData :cf="cfList">
      <!--详情弹窗的album字段组件，注意插槽命名-->
      <template v-slot:slot_detail_item_album="{row}">
        <div class v-if="row.album && row.album.length">
          <img
            @click="showBigImg(item.url)"
            :src="item.url"
            alt
            v-for="item in row.album"
            :key="item.url"
            class="W100 H100"
          >
        </div>
      </template>
      <!--详情弹窗的description字段组件，注意插槽命名-->
      <template v-slot:slot_detail_item_description="{row}">
        <div class="FWB C_f30" @click="print(row.description)">{{row.description}}</div>
      </template>
    </listData>
  </div>
</template>
<script>
import listData from "../components/list-data/list-data.vue";
export default {
  components: { listData },
  methods: {
    showBigImg(url) {
      this.showDialogBigImg = true;
      this.urlBigImg = url;
    },
    print(text) {
      alert(text);
    }
  },
  data() {
    return {
      showDialogBigImg: false, //是否显示大图弹窗
      urlBigImg: "", //大图地址
      cfList: {
        listIndex: "listProduct", //vuex对应的字段
        twoTitle: "商品中心",
        threeTitle: "商品列表",
        flag: true,
        url: {
          list: "http://120.76.160.41:3000/crossList?page=mabang-commodity", //列表接口
          add: "http://120.76.160.41:3000/crossAdd?page=mabang-commodity", //新增接口
          modify: "http://120.76.160.41:3000/crossModify?page=mabang-commodity", //修改接口
          detail: "http://120.76.160.41:3000/crossDetail?page=mabang-commodity", //查看单条数据详情接口，在修改表单或详情弹窗用到
          delete: "http://120.76.160.41:3000/crossDelete?page=mabang-commodity" //删除接口
        },
        //-------列配置数组-------
        columns: [
          {
            label: "商品id",
            prop: "P1",
            width: 80
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
            label: "属性",
            prop: "prop",
            width: 100
          }

          // {
          //   label: "图片",
          //   prop: "album",

          //   width: 120,
          //   formatter1(row, column) {
          //     console.log("row", row);
          //     var strAlbum = JSON.stringify(row.album); //变量定义：{000Json字符串}-函数调用：{Json对象转换Json字符串函数}
          //     //格式器

          //     return `商品：${strAlbum}`;
          //   }
          // }
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
            handle(formData, propOrigin, valHandle) {
              //处理器
              formData[propOrigin] = {
                $regex: valHandle,
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
            width: 100
          },
          {
            label: "商品简介",
            prop: "description",
            width: 100,
            slot: "slot_detail_item_description"
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
            label: "属性",
            prop: "prop",
            width: 100
          },
          {
            label: "图片",
            prop: "album",
            width: 100,
            slot: "slot_detail_item_album"
            //   formatter(row) {
            //     //自定义格式
            //     let htmlResult = ""; //需要拼装的html代码
            //     if (row.album && row.album.length) {
            //       //如果相册数组存在
            //       row.album.forEach(albumEach => {
            //         //循环：{相册数组}
            //         htmlResult += `<img  class="F1 W100 H100" src="${
            //           albumEach.url
            //         }" alt="" >`;
            //       });
            //     }
            //     return htmlResult;
            //   }
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
            type: "vueJsonEditor"
          },
          {
            label: "其他数据",
            prop: "extend",
            type: "vueJsonEditor"
          },
          {
            label: "属性",
            prop: "prop",
            type: "vueJsonEditor"
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
