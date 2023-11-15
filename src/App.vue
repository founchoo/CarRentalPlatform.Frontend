<script setup lang="ts">
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarNav,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCard,
  MDBCol,
  MDBRow,
  MDBListGroup,
  MDBListGroupItem,
  MDBNavbarBrand
} from 'mdb-vue-ui-kit'
import { ref } from 'vue'
import ToastView from '@/components/Toast.vue'
import * as common from '@/utils/common'

const dropdown = ref(false)
</script>

<script lang="ts">
import { RouterView } from 'vue-router'
import router from '@/router'
import { defineComponent } from 'vue'
import { setToken } from '@/utils/storage'
import BaseLoading from '@/components/BaseLoading.vue'
import http from './utils/http'
import { getToken, removeToken } from '@/utils/storage'
// @ts-ignore
import { ROUTE_HOME, ROUTE_LOGIN, TOAST_DURATION } from './utils/constants'
import AddDataModal from './components/AddDataModal.vue'
import routes from '@/router'

export default defineComponent({
  data() {
    return {
      showLoadingIndicator: false,
      showMainLayout: true,
      showToast: false,
      toastTitle: "",
      toastMessage: "",
      toastLevel: "",
      fullScreen: false,
      navbarList: []
    };
  },
  methods: {
    logout() {
      setToken(null);
      console.log("退出成功");
      router.push({
        path: `/${ROUTE_LOGIN}`
      });
    },
    // @ts-ignore
    navigateTo(path) {
      router.push({
        path: path
      });
    },
    // @ts-ignore
    launchToast(toast) {
      this.showToast = true;
      this.toastTitle = toast.title;
      this.toastMessage = toast.content;
      this.toastLevel = toast.color;
      setTimeout(() => {
        this.showToast = false;
      }, TOAST_DURATION);
    },
    initHTTPConfig() {
      http.interceptors.request.use((config) => {
        // Do something before request is sent
        this.showLoadingIndicator = true;
        console.log("Request is sent");
        return config;
      }, (error) => {
        // Do something with request error
        console.log("Request error");
        this.launchToast({
          title: "错误",
          content: error,
          color: "danger"
        });
        return Promise.reject(error);
      });
      http.interceptors.response.use((response) => {
        // Do something with response data
        this.showLoadingIndicator = false;
        console.log("Response is received");
        if (!response.data.isSuccess) {
          this.launchToast({
            title: "错误",
            content: response.data.message,
            color: "danger"
          });
        }
        return response;
      }, (error) => {
        // Do something with response error
        console.log("Response error");
        this.launchToast({
          title: "错误",
          content: error,
          color: "danger"
        });
        return Promise.reject(error);
      });
    },
    initRouterConfig() {
      // @ts-ignore
      router.beforeEach(async (to, from, next) => {
        console.log(to)
        const token = getToken();
        if (!token && to.path !== `/${ROUTE_LOGIN}`) {
          next(`/${ROUTE_LOGIN}`);
        }
        else {
          if (to.path === `/${ROUTE_LOGIN}`) {
            this.showMainLayout = false;
            removeToken();
            next();
          }
          else {
            this.showMainLayout = true;
            for (const item of this.navbarList) {
              // @ts-ignore
              item.meta.active = item.path === to.path;
            }
            common.init();
            next();
          }
        }
      });
    },
    toggleFullScreenMode() {
      this.fullScreen = !this.fullScreen;
      if (this.fullScreen) {
        document.documentElement.requestFullscreen();
      }
      else {
        document.exitFullscreen();
      }
    },
    navbarItemSelectionChanged(item: any) {
      this.navigateTo(`${item.path}`);
    }
  },
  created() {
    // @ts-ignore
    this.navbarList = routes.getRoutes();
    this.initHTTPConfig();
    this.initRouterConfig();
  },
  components: { AddDataModal }
})
</script>

<template>
  <!-- @vue-ignore -->
  <MDBContainer fluid :hidden="!showMainLayout">
    <MDBCol style="min: width 100%;">

      <!-- 侧边导航栏 -->
      <MDBRow class="sidebar-container animate__animated animate__fadeInLeft">
        <MDBCard style="padding: 0; ">
          <MDBListGroup light>
            <MDBListGroupItem v-for="item in navbarList" v-show="// @ts-ignore
            item.meta.showOnNavbar !== false" tag="button"
              @click="navbarItemSelectionChanged(item)" :active="// @ts-ignore
              item.meta.active" class="nav-item" noBorder spacing
              action>
              <i :class="// @ts-ignore
              item.meta.icon"></i><!--侧边栏logo-->
              {{ // @ts-ignore
              item.meta.label }}
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCard>
      </MDBRow>

      <MDBRow>
        <!-- 子页面容器 -->
        <MDBRow class="animate__animated animate__fadeIn" style="margin-top: 10vh;">
          <MDBRow class="mt-3">
            <MDBCol />
            <MDBCol md="10">
              <RouterView @launchToast="launchToast" />
            </MDBCol>
          </MDBRow>
        </MDBRow>

        <!-- 顶部导航栏 -->
        <MDBNavbar class="navbar-container" expand="lg" light bg="white" container position="sticky">
          <MDBNavbarBrand href="#">
            <div class="animate__animated animate__bounceInLeft">
              <img src="https://i2.mjj.rip/2023/07/01/407fcfc3ce867ee108ca609b56c0f14f.png" alt="..."
                style="width: auto; max-height: 6vh;" />
            </div>
            <!-- 导航栏项目名 -->
            </MDBNavbarBrand>
            <span class="animate__animated animate__bounceInRight" style="font-size: 20px; font-family: fantasy;"><strong>华夏租车</strong></span>
          <MDBNavbarNav right>
            <MDBDropdown v-model="dropdown">
              <MDBDropdownToggle color="link" @click="dropdown = !dropdown">
                <img src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg" class="rounded-circle" height="28" />
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem href="#">个人资料</MDBDropdownItem>
                <MDBDropdownItem href="javascript:void(0);" @click="toggleFullScreenMode()">切换全屏</MDBDropdownItem>
                <MDBDropdownItem href="javascript:void(0);" @click="logout()">登出</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarNav>
        </MDBNavbar>

      </MDBRow>
    </MDBCol>
  </MDBContainer>

  <AddDataModal />

  <MDBContainer :hidden="showMainLayout">
    <RouterView @launchToast="launchToast" name="loginRouterView" />
  </MDBContainer>

  <ToastView v-show="showToast" v-bind:show="showToast" v-bind:title="toastTitle" v-bind:message="toastMessage"
    v-bind:level="toastLevel" />

  <Transition>
    <BaseLoading v-bind:isLoading="showLoadingIndicator" />
  </Transition>
</template>

<style scoped>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.sidebar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 16.67%;
  /* 自定义侧边栏的宽度 */
  height: 90vh;
  /* 设置侧边栏的高度为视口高度 */
  z-index: 10;
}

.navbar-container {
  position: fixed;
  top: 0;
  height: 10%;
}

.nav-item>i {
  margin-left: 30px;
  width: 30px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
