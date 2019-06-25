<template>
  <div class>
    123
    <textarea class="WP100 H100 PL10 PR10 PT5 PB5" v-model="valueNeed" @change="change"></textarea>
  </div>
</template>

<script>
export default {
  //用于列表模糊查询的组件
  props: {
    value: [Object]
  },
  data() {
    return {
      valueNeed: ""
    };
  },
  methods: {
    change() {
      let json = null;
      if (this.valueNeed) {
        //Q2：{值}不为空
        try {
          json = JSON.parse(this.valueNeed); //函数调用：{Json字符串转换Json对象函数}
          //   this.formData[prop] = json1;
        } catch (err) {
          alert("json格式错误");
          
        }
      }
      this.$emit("input", json); //触发双向绑定
    }
  },
  created() {
    if (this.value) {
      this.valueNeed = JSON.stringify(this.value);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
