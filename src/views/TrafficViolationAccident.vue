<!--违章事故管理-->

<script setup lang="ts">
import { ROUTE_CUSTOMER_INFO, ROUTE_TRAFFIC_VIOLATION_ACCIDENT, ROUTE_VEHICLE_INFO } from '@/utils/constants';
import DataTable from '@/components/DataTable.vue';
import * as common from '@/utils/common' // 常用方法类
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { trueFalseConverter } from '@/utils/converter';
import { positiveNumber, notEmpty } from '@/utils/validator';
import http from '@/utils/http';
import DataService from '@/services/data-service';
import * as messenger from '@/utils/messenger'

export default defineComponent({
  data() {
    return {
      columns: [
        {
          field: 'cid',
          label: '客户 ID',
          type: 'uuid',// @ts-ignore
          validator: async (value) => {
            await http.get(`/${ROUTE_CUSTOMER_INFO}/getById?id=${value}`).then(response => {
              const col = common.getColumn('cid')
              col.isValid = response.data.isSuccess
            })
          },
          isValid: false
        },
        {
          field: 'vid',
          label: '车辆 ID',
          type: 'uuid',// @ts-ignore
          validator: async (value) => {
            await http.get(`/${ROUTE_VEHICLE_INFO}/getById?id=${value}`).then(response => {
              const col = common.getColumn('vid')
              col.isValid = response.data.isSuccess
            })
          },
          isValid: false
        },
            {
          field: 'violate_count',
          label: '车牌号码',
          type: 'String',// @ts-ignore
          validator: (value) => {
            positiveNumber('violate_count', value, -1)
          },
          isValid: false
        },
        {
          field: 'violate_count',
          label: '违章次数',
          type: 'number',// @ts-ignore
          validator: (value) => {
            positiveNumber('violate_count', value, -1)
          },
          isValid: false
        },
        {
          field: 'violate_info',
          label: '违章信息',// @ts-ignore
          validator: (value) => {
            notEmpty('violate_info', value)
          },
          isValid: false
        },
        {
          field: 'violation',
          label: '违章是否处理',
          type: 'boolean',
          converter: trueFalseConverter,// @ts-ignore
          validator: (value) => {
          },
          isValid: true
        },
        {
          field: 'manager',
          label: '经手人',// @ts-ignore
          validator: (value) => {
            const col = common.getColumn('manager')
            col.isValid = (value !== "") // value === ''},
          },
          isValid: false
        },
        {
          field: 'accident_count',
          label: '事故次数',
          type: 'number',// @ts-ignore
          validator: (value) => {
            positiveNumber('accident_count', value, -1)
          },
          isValid: false
        },
        {
          field: 'accident_info',
          label: '事故信息',// @ts-ignore
          validator: (value) => {
            notEmpty('accident_info', value)
          },
          isValid: false
        },
      ],
      baseURL: `${ROUTE_TRAFFIC_VIOLATION_ACCIDENT}`
    };
  },
  created() {// @ts-ignore
    common.beforeAdd.value = () => {
      common.setDataValue('violation', false)
      common.setDataValue('cid', messenger.cid.value)
      common.setDataValue('vid', messenger.vid.value)
      messenger.cid.value = ''
      messenger.vid.value = ''
    }// @ts-ignore
    common.afterAdd.value = async () => {
      // 获取违章事故记录对应的客户信息
      await new DataService(`${ROUTE_CUSTOMER_INFO}`)// @ts-ignore
        .getByIdAsync(common.data.value['cid'])
        .then(async (response) => {
          // 获取到的客户信息
          let customer = response.data.data.data
          // 更新违章次数
          // @ts-ignore
          customer.violate_count += parseInt(common.data.value['violate_count'])
          // 更新交通事故次数
          // @ts-ignore
          let accident_count = parseInt(common.data.value['accident_count'])
          if (accident_count > 0) {
            // @ts-ignore
            await new DataService(`${ROUTE_VEHICLE_INFO}`).getByIdAsync(common.data.value['vid']).then(async response => {
              let vehicle = response.data.data.data
              vehicle.accident = true
              // 更新车辆信息
              await new DataService(`${ROUTE_VEHICLE_INFO}`).updateAsync(vehicle)
            })
          }
          customer.accident_count += accident_count
          // 更新客户信息
          await new DataService(`${ROUTE_CUSTOMER_INFO}`).updateAsync(customer)
        })
    }
  }
});
</script>

<template>
  <DataTable :columns="columns" :base-u-r-l="baseURL" :allow-delete="false" />
</template>

