<template>
  <div id="frame"></div>
</template>

<script>
export default {
  name: "topFrame"
};
</script>

<style>
#frame {
  width: 98vw;
  height: 30px;
  background-color: #f3f3f3;
  position: fixed;
  z-index: 9;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  opacity: 0.5;
  user-select: none;
}
</style>