<template>
  <div class>
    <!--查看详情弹窗-->
    <el-dialog
      title="查看详情"
      :visible.sync="isShowDialogDetail"
      width="60%"
      :before-close="closeDialogDetailFun"
       :append-to-body="true"
    >
      <table class="table-normal WP100">
        <tr v-for="item in cf.detailItems" :key="item.prop">
          <td class="W100">{{item.label}}</td>
          <td>
            <!--如果是slot-->
            <!-- <slot :name="'slot_detail_item_'+item.prop" v-if="item.slot" ></slot> -->

            <slot :name="item.slot" :row="row" v-if="item.slot"></slot>
            <!--如果该字段带有formatter,使用formatter返回的代码输出-->
            <div v-else-if="item.formatter" v-html="item.formatter(row)"></div>
            <!--否则如果该字段带type是html，使用html原文输出-->
            <div v-else-if="item.type=='html'" v-html="row[item.prop]"></div>
            <!--否则，正常输出-->
            <template v-else>{{row[item.prop]}}</template>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogDetailFun">关 闭</el-button>
      </span>
    </el-dialog>

    <!--新增数据表单弹窗-->
    <el-dialog
      title="新增数据"
      :visible.sync="isShowDialogAdd"
      v-if="isShowDialogAdd"
      width="50%"
      :before-close="closeDialogAddFun"
       :append-to-body="true"
    >
      <dynamicForm
        :formData="formAdd"
        :cf="cfFormAdd"
        @submit="addProduct"
        @cancel="closeDialogAddFun"
       
      >
        <template v-slot:[item.slot]="{formData}" v-for="item in cf.formItems">
          <!--根据cf.formItems循环输出插槽--新增修改表单弹窗-->
          <slot :name="item.slot" :formData="formData" v-if="item.slot"></slot>
        </template>
      </dynamicForm>
    </el-dialog>

    <!--修改数据表单弹窗-->
    <el-dialog
      title="修改数据"
      :visible.sync="isShowDialogModify"
      v-if="isShowDialogModify"
      width="60%"
       :append-to-body="true"
    >
      <dynamicForm
        :formData="formModify"
        :cf="cfFormModify"
        @submit="modifyProduct"
        @cancel="isShowDialogModify = false"
      >
        <template v-slot:[item.slot]="{formData}" v-for="item in cf.formItems">
          <!--根据cf.formItems循环输出插槽--新增修改表单弹窗-->
          <slot :name="item.slot" :formData="formData" v-if="item.slot"></slot>
        </template>
      </dynamicForm>
    </el-dialog>
  </div>
</template>

<script>
import dynamicForm from "./dynamic-form";
export default {
  components: {
    //注册组件
    dynamicForm
  },
  props: ["cf"],
  data: function() {
    return {
      //------------------新增表单组件配置--------------
      cfFormAdd: {
        formItems: this.cf.formItems,
        btns: [
          { text: "新增", event: "submit", type: "primary", validate: true },
          { text: "取消", event: "cancel" }
        ]
      },
      //------------------修改表单组件配置--------------
      cfFormModify: {
        urlInit: this.cf.url.detail,
        formItems: this.cf.formItems,
        btns: [
          { text: "修改", event: "submit", type: "primary", validate: true },
          { text: "取消", event: "cancel" }
        ]
      },
      formAdd: {}, //新增产品的表单数据
      formModify: {}, //修改产品的表单数据
      isShowDialogModify: false, //是否显示修改弹窗
      editorOption: {
        //编辑器的配置
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],

            ["link", "image", "video"]
          ]
        }
      }
    };
  },
  computed: {
    row() {
      //来自vuex的当前行数据
      return this.$store.state.listState[this.cf.listIndex].row;
    },
    isShowDialogAdd() {
      //是否显示添加弹窗
      return this.$store.state.listState[this.cf.listIndex].isShowDialogAdd; //从vuex的store里面读取值
    },
    isShowDialogDetail() {
      //是否显示详情弹窗
      return this.$store.state.listState[this.cf.listIndex].isShowDialogDetail; //从vuex的store里面读取值
    }
  },
  methods: {
    closeDialogDetailFun(done) {
      //关闭详情弹窗的配置事件函数
      this.$store.commit("closeDialogDetail", this.cf.listIndex); //执行store的closeDialogAdd事件
    },
    closeDialogAddFun(done) {
      //关闭新增弹窗的配置事件函数
      this.$store.commit("closeDialogAdd", this.cf.listIndex); //执行store的closeDialogAdd事件
    },

    //-------------修改产品的函数--------------
    modifyProduct() {
      axios({
        //请求接口
        method: "post",
        url: this.cf.url.modify,
        data: {
          findJson: {
            //用于定位要修改的数据
            P1: this.formModify.P1
          },
          modifyJson: this.formModify
        } //传递参数
      })
        .then(response => {
          this.$message({
            message: "修改产品成功",
            duration: 1500,
            type: "success"
          });
          this.isShowDialogModify = false; //关闭弹窗
          this.$parent.getProList(); //更新产品列表
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    //-------------新增产品的函数--------------
    addProduct() {
      axios({
        //请求接口
        method: "post",
        url: this.cf.url.add,
        data: { data: this.formAdd } //传递参数
      })
        .then(response => {
          this.$message({
            message: "新增产品成功",
            duration: 1500,
            type: "success"
          });
          this.closeDialogAddFun(); //关闭弹窗
          this.$parent.getProList(); //更新产品列表
          this.formAdd = {};
        })
        .catch(function(error) {
          alert("异常:" + error);
        });
    },
    //-------------显示修改弹窗的函数--------------
    showModify(row) {
      let str = JSON.stringify(row); //转换成字符串
      let rowNew = JSON.parse(str); //转换成对象

      this.isShowDialogModify = true; //打开弹窗
      this.formModify = rowNew; //表单赋值
    }
  },
  mounted() {}
};
</script>

