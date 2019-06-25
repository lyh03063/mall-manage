<template>
  <el-form
    ref="form"
    :model="formData"
    :label-width="cf.labelWidth||'80px'"
    size="small"
    :inline="cf.inline"
  >
    <template v-for="item in cf.formItems">
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules||[]"
        v-if="!item.forbidAdd"
        :key="item.prop"
      >
        <!--slot自定义组件-->
        <slot :name="item.slot" :formData="formData" v-if="item.slot"></slot>
        <!--下拉框-->
        <div class v-else-if="item.type=='select'">
          <select_ajax
            class
            v-model="formData.category"
            :keyLabel="item.ajax.keyLabel"
            :keyValue="item.ajax.keyValue"
            :ajaxUrl="item.ajax.url"
            v-if="item.ajax"
          ></select_ajax>
          <el-select v-model="formData[item.prop]" v-else>
            <el-option label="请选择" value></el-option>
            <el-option
              :label="option.label"
              :value="option.value"
              v-for="option in item.options"
              :key="option.value"
            ></el-option>
          </el-select>
        </div>

        <!--单选框-->
        <el-radio-group v-model="formData[item.prop]" v-else-if="item.type=='radio'">
          <el-radio
            :label="option.label"
            :value="option.value"
            v-for="option in item.options"
            :key="option.value"
          ></el-radio>
        </el-radio-group>
        <!--复选框-->
        <el-checkbox-group v-model="formData[item.prop]" v-else-if="item.type=='checkbox'">
          <el-checkbox
            :label="option.label"
            :value="option.value"
            v-for="option in item.options"
            :key="option.value"
          ></el-checkbox>
        </el-checkbox-group>
        <!--文本域-->
        <el-input type="textarea" v-model="formData[item.prop]" v-else-if="item.type=='textarea'"></el-input>

        <!--date日期选择-->
        <el-date-picker
          v-model="formData[item.prop]"
          align="right"
          type="date"
          placeholder="选择日期"
          v-else-if="item.type=='date'"
        ></el-date-picker>
        <!--如果是vue-json编辑器-->
        <vue-json-editor
          v-model="formData[item.prop]"
          v-else-if="item.type=='vueJsonEditor'"
          lang="zh"
        ></vue-json-editor>
        <!--如果是普通json编辑器-->
        <json_editor v-model="formData[item.prop]" v-else-if="item.type=='jsonEditor'"></json_editor>
        <!--富文本编辑器-->
        <quillEditor
          v-model="formData[item.prop]"
          :options="editorOption"
          v-else-if="item.type=='editor'"
        ></quillEditor>
        <!--模糊查询文本框-->
        <input_find_vague v-model="formData[item.prop]" v-else-if="item.type=='input_find_vague'"></input_find_vague>

        <!--密码框-->

        <el-input
          placeholder="请输入密码"
          v-model="formData[item.prop]"
          v-else-if="item.type=='password'"
          show-password
        ></el-input>
        <!--普通文本框-->
        <el-input v-model="formData[item.prop]" v-else></el-input>
      </el-form-item>
    </template>

    <el-form-item>
      <!-- 查询按钮 -->

      <el-button
        :type="item.type"
        @click="btnClick(item.event,item.validate)"
        v-for="(item,index) in cf.btns"
        :key="index"
      >{{item.text}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import vueJsonEditor from "vue-json-editor";
import select_ajax from "../form_item/select_ajax.vue";
import input_find_vague from "../form_item/input_find_vague.vue";
import json_editor from "../form_item/json_editor.vue";
export default {
  components: {
    //注册组件
    quillEditor,
    vueJsonEditor,
    select_ajax,
    input_find_vague,
    json_editor
  },

  props: {
    cf: {
      type: Object,
      default() {
        return {
          btns: [
            { text: "提交", event: "submit", type: "primary", validate: true },
            { text: "取消", event: "cancel" }
          ]
        };
      }
    },
    formData: Object
  },
  data() {
    return {
      formData_handle: {},
      formData_Json: {},
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
  methods: {
    btnClick(eventName, validate) {
      //Q1：需要校验
      if (validate) {
        //如果{000}000
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit(eventName);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        //Q2：不需要校验
        this.$emit(eventName);
      }
    },

    initForm() {
      //初始化表单函数
      console.log("initForm");
      //处理json编辑框的数据转换
      this.formData_Json = {}; //json类型存储对象清空
      for (let key in this.formData) {
        //如果{ajax获取到的初始化数据}存在
        if (this.docGet) {
          this.formData[key] = this.docGet[key];
        }

        // //遍历：{文档字段}
        // let valCurr = this.formData[key];

        // if (util.type(valCurr) == "object" || util.type(valCurr) == "array") {
        //   //如果是json类型
        //   var t_json = JSON.stringify(valCurr); //json转字符串
        //   console.log("t_json", t_json);
        //   this.formData_Json[key] = t_json;
        // }
      }
    }
  },
  async mounted() {
    if (this.cf.urlInit) {
      //如果{000}000
      let { data } = await axios({
        //请求接口
        method: "post",
        url: this.cf.urlInit,
        data: {
          id: this.formData.P1
        } //传递参数
      });
      // console.log("doc", doc);
      this.docGet = data.doc;
    }

    console.log("this.docGet", this.docGet);
    this.initForm(); //调用：{初始化表单函数}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
