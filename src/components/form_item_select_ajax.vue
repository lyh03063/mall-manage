<template>
  <div class>
    <el-select v-model="valueNeed" placeholder="请选择" @change="change">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number]
  },
  data() {
    return {
      valueNeed: this.value,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ]
    };
  },
  methods: {
    change() {
      this.$emit("input", this.valueNeed);//触发双向绑定
    },
  },
  async created() {
console.log("created###############");
    let { data } = await axios({
      //请求接口
      method: "post",
      url: "http://120.76.160.41:3000/crossList?page=mabang-category",
      data: {
        findJson: {}
      } //传递参数
    }).catch(function(error) {
      alert("异常:" + error);
    });
    console.log("data", data);
    let list = data.list;
    console.log("list", list);

    this.options = list.map(item => {//将list数组转换成options的结构
      return {
        value: item.P1,
        label: item.name
      };
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
