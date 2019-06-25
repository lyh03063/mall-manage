<template>

  <div class>
    <div class="PT10 PB10 C_f30 PL10 " >
      dynamic-form组件的内置表单字段类型
    </div>
    <dynamicForm :cf="cfForm" :formData="formData"></dynamicForm>
  </div>
</template>
<script>
import dynamicForm from "../components/list-data/dynamic-form";
export default {
  components: { dynamicForm },
  data() {
    return {
      formData: {
        prop_checkbox:[]//复选框字段的默认数组
      },
      cfForm: {
        labelWidth: "150px",
        formItems: [
          {
            label: "普通文本框(input)",
            prop: "prop1",
            type: "input"
          },
          {
            label: "文本域(textarea)",
            prop: "prop2",
            type: "textarea"
          },
          {
            label: "下拉框(select)",
            prop: "prop3",
            type: "select",
            options: [{ value: 1, label: "男" }, { value: 2, label: "女" }]
          },
          {
            label: "下拉框(select+ajax)",
            prop: "prop4",
            type: "select",
            ajax: {
              url: "http://120.76.160.41:3000/crossList?page=mabang-member",
              keyLabel: "nickName",
              keyValue: "userName"
            }
          },
          {
            label: "单选框(radio)",
            prop: "prop_radio",
            type: "radio",
            options: [{ value: 1, label: "男" }, { value: 2, label: "女" }]
          },
          {
            label: "复选框(checkbox)",
            prop: "prop_checkbox",
            type: "checkbox",
            options: [{ value: 1, label: "男" }, { value: 2, label: "女" }]
          },
          {
            label: "日期选择器(date)",
            prop: "prop_date",
            type: "date"
          },
          {
            label: "json编辑器(jsonEditor)",
            prop: "prop_jsonEditor",
            type: "jsonEditor"
          },
          {
            label: "json编辑器(vueJsonEditor)",
            prop: "prop_vueJsonEditor",
            type: "vueJsonEditor"
          },
          {
            label: "富文本编辑器(editor)",
            prop: "prop_editor",
            type: "editor"
          }
        ],
        btns: [
          { text: "提交111", event: "submit", type: "primary" },
          { text: "取消222", event: "cancel" }
        ]
      }
    };
  },
  beforeCreate() {}
};
</script>


<style>
</style>
