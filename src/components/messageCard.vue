<template>
  <div class="cardBox">
    <div class="avatarBox">
      <el-avatar class="avatar" :icon="UserFilled" />
    </div>
    <div class="textBox">
      <el-text>
          万
          物复苏的春天，正是踔厉奋发的时节。
国内生产总值同比增长4.5%，社会消费品零售总额同比增长5.8%，
全国固定资产投资同比增长5.1%，货物进出口总额同比增长4.8%……4月18日公布
的中国经济2023年首季成绩单，展现中国经济在高质量发展中复苏向好的良好态势。
“牢牢把握高质量发展这个首要任务”“在强国建设、民族复兴的新征程，
我们要坚定不移推动高质量发展”——习近平总书记的重要指示坚定明晰。
奋进在全面贯彻党的二十大精神的开局之年，以习近平同志
为核心的党中央带领全党全国人民，坚持稳中求进工作总基调，加快构建新发展
格局，着力推动高质量发展，更好统筹发展和安全，促进经济运行整体好转，推动中国经济巨轮乘风破浪、稳健前进，为全面推进中国式现代化提供更加强劲的发展动力。
      </el-text>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from "@element-plus/icons-vue";
</script>

<style>
.textBox {
  width: 650px;
  margin-top: 15px;
  /* display: inline-block; */
}
.avatarBox {
  width: 80px;
}
.avatar {
  margin-left: 20px;
  margin-top: 10px;
}
.cardBox {
  width: 100%;
  min-height: 100px;
  background-color: white;
  display: flex;
  padding-bottom: 10px;
}
</style>