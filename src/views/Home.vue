<template>
  <!--onselectstart="return false" -->
  <div class="container">
    <div class="Tabbar">
      <Logo class="logo" />
      <User class="" />
    </div>
    <div class="hua"></div>
    <div class="home">
      <div class="leftMeau">
        <Heades></Heades>
      </div>
      <div class="rightBox">
        <!-- 3.x -->
        <router-view v-slot="{ Component }">
          <transition>
            <keep-alive :include="$store.state.keepLiveRoute">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Heades from "../components/head/heades/indexs.vue";
import Logo from "../components/head/heades/logo.vue";
import User from "../components/head/heades/user.vue";
// eslint-disable-next-line prettier/prettier
import { defineComponent, reactive, toRefs } from "vue";
// eslint-disable-next-line prettier/prettier
import { setup } from "vue-class-component";
export default defineComponent({
  components: {
    Heades,
    Logo,
    User,
  },
});
</script>

<style lang="less" scoped>
.container {
  // background-color: #acbcd6;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;

  .Tabbar {
    position: fixed;
    top: 0;
    width: 100%;
    height: 0.6rem;
    background-color: #fff;
    // box-shadow: 0px 3px 3px #ccc;

    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      width: 3rem;
      height: 100%;
    }
    .user {
      width: 0.5rem;
      height: 100%;
    }
  }
  .hua {
    width: 100%;
    position: fixed;
    top: 0.6rem;
    height: 2px;
    background-color: red; /* 不支持线性的时候显示 */
    background-image: linear-gradient(
      to right,
      rgb(171, 236, 21),
      rgb(9, 187, 231)
    );
  }
  .home {
    width: 100%;
    margin-top: 0.6rem;
    height: 100%-1rem;
    z-index: 1;
    display: flex;
    .leftMeau {
      width: 4rem;
      height: 100%;
      background-color: pink;
    }
    .rightBox {
      width: 100%-4rem;
      height: 100%;
    }
  }

  .footter {
    width: 100%;
    height: 20px;
    //     background: #5b6d81;
    line-height: 20px;
    text-align: center;
    /* 方法一 */
    position: fixed;
    bottom: 0;
  }
}
</style>
