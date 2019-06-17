<template>
  <el-form ref="form" :model="formData" label-width="80px" size="small" :inline="cf.inline">
    <template v-for="item in cf.formItems">
      <el-form-item :label="item.label" v-if="!item.forbidAdd" :key="item.prop">
        <!--下拉框-->
        <el-select v-model="formData[item.prop]" v-if="item.type=='select'">
          <el-option label="请选择" value></el-option>
          <el-option
            :label="option.label"
            :value="option.value"
            v-for="option in item.options"
            :key="option.value"
          ></el-option>
        </el-select>
        <!--单选框-->
        <el-radio-group v-model="formData[item.prop]" v-else-if="item.type=='radio'">
          <el-radio
            :label="option.value"
            :value="option.value"
            v-for="option in item.options"
            :key="option.value"
          ></el-radio>
        </el-radio-group>
        <!--复选框-->
        <el-checkbox-group v-model="formData[item.prop]" v-else-if="item.type=='checkbox'">
          <el-checkbox
            :label="option.value"
            :value="option.value"
            v-for="option in item.options"
            :key="option.value"
          ></el-checkbox>
        </el-checkbox-group>
        <!--文本域-->
        <el-input type="textarea" v-model="formData[item.prop]" v-else-if="item.type=='textarea'"></el-input>
        <!--如果是vue-json编辑器-->
        <vue-json-editor
          v-model="formData[item.prop]"
         
          v-else-if="item.type=='vueJsonEditor'"
        
          lang="zh"
        ></vue-json-editor>
        <!--如果是普通json编辑器-->
        <textarea
          class="WP100 H100 PL10 PR10 PT5 PB5"
          v-model="formData_Json[item.prop]"
          v-else-if="item.type=='jsonEditor'"
          @change="changeJson(item.prop)"
        ></textarea>
        <quillEditor
          v-model="formData[item.prop]"
          :options="editorOption"
          v-else-if="item.type=='editor'"
        ></quillEditor>
        <!--文本框+自定义处理器-->
        <template v-else>
          <template v-if="item.handle">
            <!--文本框+自定义处理器-->
            <el-input
              v-model="formData[item.prop+'__source']"
              @input="item.handle(formData,item.prop,item.prop+'__source')"
            ></el-input>
          </template>
          <template v-else>
            <!--普通文本框-->
            <el-input v-model="formData[item.prop]"></el-input>
          </template>
        </template>
      </el-form-item>
    </template>

    <el-form-item>
      <!-- 查询按钮 -->

      <el-button
        :type="item.type"
        @click="$emit(item.event)"
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
export default {
  components: {
    //注册组件
    quillEditor,
    vueJsonEditor
  },

  props: {
    cf: {
      type: Object,
      default() {
        return {
          btns: [
            { text: "提交", event: "submit", type: "primary" },
            { text: "取消", event: "cancel" }
          ]
        };
      }
    },
    formData: Object
  },
  data() {
    return {
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
    onJsonChange() {
      alert("onJsonChange");
    },
    changeJson(prop) {
      console.log("changeJson");
      let val = this.formData_Json[prop];
      if (!val) {
        //Q1：{值}为空
        delete this.formData[prop];
      } else {
        //Q2：{值}不为空
        try {
          var json1 = JSON.parse(val); //函数调用：{Json字符串转换Json对象函数}
          this.formData[prop] = json1;
        } catch (err) {
          alert("json格式错误");
        }
      }
    },
    initForm() {
      //初始化表单函数
      console.log("initForm");

      //处理json编辑框的数据转换
      this.formData_Json = {}; //json类型存储对象清空
      for (let key in this.formData) {
        if (this.docGet) {
          //如果{000}000
          this.formData[key] = this.docGet[key];
        }

        //遍历：{文档字段}
        let valCurr = this.formData[key];

        if (util.type(valCurr) == "object" || util.type(valCurr) == "array") {
          //如果是json类型
          var t_json = JSON.stringify(valCurr); //json转字符串
          console.log("t_json", t_json);
          this.formData_Json[key] = t_json;
        }
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
