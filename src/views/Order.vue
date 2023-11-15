<script setup lang="ts">
import { ROUTE_CUSTOMER_INFO, ROUTE_ORDER, ROUTE_VEHICLE_INFO } from '@/utils/constants'
import DataTable from '@/components/DataTable.vue'
import * as common from '@/utils/common'
import moment from 'moment';
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { dateConverter, trueFalseConverter } from '@/utils/converter';
import http from '@/utils/http';
import DataService from '@/services/data-service';
import { notEmpty } from '@/utils/validator';
import * as messenger from '@/utils/messenger'

export default defineComponent({
  data() {
    return {
      columns: [
        {
          field: 'cid',
          label: '客户 ID',
          type: 'uuid',
          isValid: false,
          // @ts-ignore
          validator: async (value) => {
            await http.get(`/${ROUTE_CUSTOMER_INFO}/getById?id=${value}`).then(response => {
              // @ts-ignore
              const first = common.columns.value.find((obj) => {
                return obj.field === 'cid'
              })
              first.isValid = response.data.isSuccess
            })
          }
        },
        {
          field: 'vid',
          label: '车辆 ID',
          type: 'uuid',
          isValid: false,
          // @ts-ignore
          validator: async (value) => {
            await new DataService(`${ROUTE_VEHICLE_INFO}`).getByIdAsync(value).then(response => {
              let vehicleInfo = response.data.data.data
              // 获取 车辆ID 属性
              // @ts-ignore
              const vehicleId = common.columns.value.find((obj) => {
                return obj.field === 'vid'
              })
              // @ts-ignore
              const rentDate = common.columns.value.find((obj) => {
                return obj.field === 'rent_date'
              })
              // @ts-ignore
              const returnDate = common.columns.value.find((obj) => {
                return obj.field === 'return_date'
              })
              vehicleId.isValid = response.data.isSuccess
              if (vehicleId.isValid) {
                common.setDataValue('total_distance', vehicleInfo.total_distance)
                // @ts-ignore
                common.data.value['rent_fee_per_day'] = vehicleInfo.rental_fee
              } else {
                common.setDataValue('total_distance', '')
                // @ts-ignore
                common.data.value['rent_fee_per_day'] = ''
              }
              if (vehicleId.isValid && rentDate.isValid && returnDate.isValid) {
                // @ts-ignore
                common.setDataValue('total_rental_fee', common.data.value['rent_fee_per_day'] *
                // @ts-ignore
                  moment(common.data.value['return_date']).diff(moment(common.data.value['rent_date']), 'days'))
              } else {
                common.setDataValue('total_rental_fee', '')
              }
            })
          }
        },
        {
          field: "rent_address",
          label: "借出地址",
          // @ts-ignore
          validator: (value) => {
            notEmpty('rent_address', value)
          },
          isValid: false
        },
        {
          field: "return_address",
          label: "还车地址",
          // @ts-ignore
          validator: (value) => {
            notEmpty('return_address', value)
          },
          isValid: false
        },
        {
          field: 'rent_date',
          label: '借出时间',
          type: 'date',
          isValid: false,// @ts-ignore
          validator: (value) => {
            // @ts-ignore
            const vehicleId = common.columns.value.find((obj) => {
              return obj.field === 'vid'
            })
            // @ts-ignore
            const rentDate = common.columns.value.find((obj) => {
              return obj.field === 'rent_date'
            })
            // @ts-ignore
            const returnDate = common.columns.value.find((obj) => {
              return obj.field === 'return_date'
            })
            rentDate.isValid = moment(value, 'yyyy-MM-DD', true).isValid()
            if (vehicleId.isValid && rentDate.isValid && returnDate.isValid) {
              // @ts-ignore
              common.setDataValue('total_rental_fee', common.data.value['rent_fee_per_day'] *
              // @ts-ignore
                moment(common.data.value['return_date']).diff(moment(common.data.value['rent_date']), 'days'))
            } else {
              common.setDataValue('total_rental_fee', '')
            }
          }, converter: dateConverter
        },
        {
          field: 'return_date',
          label: '归还时间',
          type: 'date',
          isValid: false,// @ts-ignore
          validator: (value) => {
            // @ts-ignore
            const vehicleId = common.columns.value.find((obj) => {
              return obj.field === 'vid'
            })
            // @ts-ignore
            const rentDate = common.columns.value.find((obj) => {
              return obj.field === 'rent_date'
            })
            // @ts-ignore
            const returnDate = common.columns.value.find((obj) => {
              return obj.field === 'return_date'
            })
            returnDate.isValid = moment(value, 'yyyy-MM-DD', true).isValid()
            if (vehicleId.isValid && rentDate.isValid && returnDate.isValid) {
              // @ts-ignore
              common.setDataValue('total_rental_fee', common.data.value['rent_fee_per_day'] *
              // @ts-ignore
                moment(common.data.value['return_date']).diff(moment(common.data.value['rent_date']), 'days'))
            } else {
              common.setDataValue('total_rental_fee', '')
            }
          },
          converter: dateConverter
        },
        {
          field: 'total_rental_fee',
          label: '租金',
          type: 'number',
          isValid: false,
          // @ts-ignore
          validator: (value) => {
            // @ts-ignore
            const first = common.columns.value.find((obj) => {
              return obj.field === 'total_rental_fee'
            })
            first.isValid = true
          },
          autoGenerated: true
        },
        {
          field: "run_distance",
          label: "本次使用里程",
          type: "number",
          showOnSummary: false,// @ts-ignore
          validator: (value) => {
            const col = common.getColumn('run_distance')
            col.isValid = parseInt(value) > 0
          },
          isValid: false
        },
        {
          field: "total_distance",
          label: "总里程（租前）",
          type: "number",
          showOnSummary: false,// @ts-ignore
          validator: (value) => {
          },
          isValid: false,
          autoGenerated: true
        },
        {
          field: "deposit_fee",
          label: "押金",
          type: "number",
          showOnSummary: false,// @ts-ignore
          validator: (value) => {
            const col = common.getColumn('deposit_fee')
            col.isValid = parseInt(value) > 0
          },
          isValid: false
        },
        {
          field: "manager",
          label: "经手人",
          showOnSummary: false,// @ts-ignore
          validator: (value) => {
            notEmpty('manager', value)
          },
          isValid: false
        },
        {
          field: "deposit_status",
          label: "押金情况",// @ts-ignore
          validator: (value) => {
          },
          isValid: false
        },
        {
          field: "break_rule",
          label: "是否违章",
          type: "boolean",
          showOnSummary: false,
          converter: trueFalseConverter,// @ts-ignore
          validator: (value) => { },
          isValid: true,
          autoGenerated: true
        },
        {
          field: "accident",
          label: "是否事故",
          type: "boolean",
          showOnSummary: false,
          converter: trueFalseConverter,// @ts-ignore
          validator: (value) => { },
          isValid: true,
          autoGenerated: true
        },
      ],
      baseURL: `${ROUTE_ORDER}`
    };
  },
  created() {// @ts-ignore
    common.beforeAdd.value = async () => {
      // 增加值时初始化是否违章、是否事故为 false
      common.setDataValue('break_rule', false)
      common.setDataValue('accident', false)
      common.getColumn('deposit_status').isValid = true
      common.setDataValue('cid', messenger.cid.value)
      common.setDataValue('vid', messenger.vid.value)
      await common.getColumn('vid').validator(messenger.vid.value)
      messenger.cid.value = ''
      messenger.vid.value = ''
    }
    // @ts-ignore
    common.afterAdd.value = async () => {
      // @ts-ignore
      await new DataService(`${ROUTE_VEHICLE_INFO}`).getByIdAsync(common.data.value['vid']).then(async response => {
        const vehicleInfo = response.data.data.data
        // @ts-ignore
        vehicleInfo.total_distance += parseInt(common.data.value['run_distance'])
        await new DataService(`${ROUTE_VEHICLE_INFO}`).updateAsync(vehicleInfo)
      })
    }
  }
});
</script>

<template>
  <DataTable :columns="columns" :base-u-r-l="baseURL" :allow-delete="false" />
</template>