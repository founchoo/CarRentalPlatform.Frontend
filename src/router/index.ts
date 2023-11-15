// scr\router\index.ts
import {
  ROUTE_ABOUT, ROUTE_CUSTOMER_INFO, ROUTE_ORDER, ROUTE_VEHICLE_INFO, ROUTE_LOGIN, ROUTE_HOME, ROUTE_VEHICLE_MAINTENANCE, 
  // @ts-ignore
  ROUTE_TRAFFIC_VIOLATION_ACCIDENT, ROUTE_FINANCIAL_STATEMENT, ROUTE_FINANCIAL_STATEMENT_INCOME, ROUTE_FINANCIAL_STATEMENT_OUTPUT
} from '@/utils/constants'
import {
  createRouter, createWebHashHistory, RouterOptions, Router, RouteRecordRaw
} from 'vue-router'
import VehicleInfo from '@/views/VehicleInfo.vue'
import CustomerInfo from '@/views/CustomerInfo.vue'
import VehicleMaintenance from '@/views/VehicleMaintenance.vue'
import TrafficViolationAccident from '@/views/TrafficViolationAccident.vue'
// @ts-ignore
import FinancialStatement from '@/views/FinancialStatement.vue'
import FinancialStatementIncome from '@/views/FinancialStatementIncome.vue'
import FinancialStatementOutput from '@/views/FinancialStatementOutput.vue'
import Order from '@/views/Order.vue'
import About from '@/views/About.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: `/`, name: `${ROUTE_HOME}`,
    component: () => Home,
    meta: {
      label: '主页',
      icon: 'fas fa-home'
    }
  },
  {
    path: `/${ROUTE_CUSTOMER_INFO}`,
    name: `${ROUTE_CUSTOMER_INFO}`,
    component: () => CustomerInfo,
    meta: {
      label: '客户管理',
      icon: 'fas fa-user'
    }
  },
  {
    path: `/${ROUTE_VEHICLE_INFO}`,
    name: `${ROUTE_VEHICLE_INFO}`,
    component: () => VehicleInfo,
    meta: {
      label: '车辆管理',
      icon: 'fas fa-car'
    }
  },
  {
    path: `/${ROUTE_ORDER}`,
    name: `${ROUTE_ORDER}`,
    component: () => Order,
    meta: {
      label: '订单管理',
      icon: 'fas fa-clipboard'
    }
  },
  {
    path: `/${ROUTE_VEHICLE_MAINTENANCE}`,
    name: `${ROUTE_VEHICLE_MAINTENANCE}`,
    component: () => VehicleMaintenance,
    meta: {
      label: '汽车保养',
      icon: 'fas fa-screwdriver-wrench'
    }
  },
  {
    path: `/${ROUTE_TRAFFIC_VIOLATION_ACCIDENT}`,
    name: `${ROUTE_TRAFFIC_VIOLATION_ACCIDENT}`,
    component: () => TrafficViolationAccident,
    meta: {
      label: '违章事故',
      icon: 'fas fa-triangle-exclamation'
    }
  },
  // {
  //   path: `/${ROUTE_FINANCIAL_STATEMENT}`,
  //   name: `${ROUTE_FINANCIAL_STATEMENT}`,
  //   component: () => FinancialStatement, // need to create a new page named 'FinancialStatements'
  //   meta: {
  //     label: '财务报表',
  //     icon: ' fas fa-solid fa-yen-sign'
  //   }
  // },
  {
    path: `/${ROUTE_FINANCIAL_STATEMENT_OUTPUT}`,
    name: `${ROUTE_FINANCIAL_STATEMENT_OUTPUT}`,
    component: () => FinancialStatementOutput, // need to create a new page named 'FinancialStatements'
    meta: {
      label: '财务支出',
      icon: ' fas fa-solid fa-yen-sign'
    }
  },
  {
    path: `/${ROUTE_FINANCIAL_STATEMENT_INCOME}`,
    name: `${ROUTE_FINANCIAL_STATEMENT_INCOME}`,
    component: () => FinancialStatementIncome, // need to create a new page named 'FinancialStatements'
    meta: {
      label: '财务收入',
      icon: ' fas fa-solid fa-yen-sign'
    }
  },
  {
    path: `/${ROUTE_ABOUT}`,
    name: `${ROUTE_ABOUT}`,
    component: () => About,
    meta: {
      label: '关于',
      icon: 'fas fa-bolt'
    }
  },
  {
    path: `/${ROUTE_LOGIN}`,
    name: `${ROUTE_LOGIN}`,
    components: { loginRouterView: () => Login },
    meta: {
      label: '登录',
      icon: 'fas fa-arrow-right-to-bracket',
      /**
       * 指示是否显示在侧边栏
       */
      showOnNavbar: false
    }
  },
]

const options: RouterOptions = {
  history: createWebHashHistory(),
  routes: routes,
}

const router: Router = createRouter(options)

export default router