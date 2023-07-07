<!-- CRUD(Create, Read, Update, Delete) Table Template Component -->

<script setup lang="ts">
import {
  MDBTable, MDBCard, MDBCheckbox, MDBBtn
} from 'mdb-vue-ui-kit';
import Search from '@/components/Search.vue'
import PageIndicator from './PageIndicator.vue';
import PageNavigator from './PageNavigator.vue';
import AddCommand from './AddCommand.vue';
import DeleteCommand from './DeleteCommand.vue';
import ExcelCommand from './ExcelCommand.vue';
import * as common from '@/utils/common'

</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { TOAST_SUCCESS } from '@/utils/constants'
import { copyToClipboard } from '@/utils/common'
import * as messenger from '@/utils/messenger'

export default defineComponent({
  props: {
    /**
     * Table headers, columns is a list of column,
     * which has two properties: `field` for machine to identify and `label` for user to read
     */
    columns: {
      type: Array,
      required: true,
    },
    /**
     * Used to construct a full URL. e.g. `http://127.0.0.1:8080/${baseURL}/getAll`
     */
    baseURL: {
      type: String,
      required: true
    },
    setRowClass: {
      type: Function,
      default: (item: {}) => {
        return ''
      }
    },
    /**
     * 指示是否支持新增操作
     */
    allowAdd: {
      type: Boolean,
      default: true
    },
    /**
     * 指示改表格是否允许删除数据
     */
    allowDelete: {
      type: Boolean,
      default: true
    },
    /**
     * 若需要替换原本获取数据的函数，请给此字段赋值
     */
    initDataFunctionToOverride: {
      type: Function,
      default: () => {
        return false
      }
    }
  },
  methods: {
		copyID(item, field, label) {
      console.log(item, field, label)
      if (label === '客户 ID') {
        messenger.cid.value = item[field]
      } else {
        messenger.vid.value = item[field]
      }
      copyToClipboard(item[field]);
      this.$emit('launchToast', {
        title: '提示',
        content: '已复制ID',
        color: TOAST_SUCCESS
      })
    }
  },
  mounted() {
    common.columns.value = this.columns
    common.pageSize.value = 5
    common.setBaseURL(this.baseURL)
    // Init data
    common.getAllByPageAsync()
  },
});
</script>

<template>
  <MDBCard style="margin-top: 8vh; margin-bottom: 2vh;">

    <MDBTable class="align-middle text-center">
      <thead class="bg-light">
        <tr>
          <th v-show="allowDelete">
            <MDBCheckbox v-model="common.allItemSelected.value" @click="common.changeAllSelectionStatus()" />
          </th>
          <th v-for="column in columns" v-show="column.showOnSummary === true || column.showOnSummary === undefined"
            :key="column.field">
            <i class="fas fa-arrow-up sort" v-show="column.selectionStatus === undefined"
              @click="common.changeSort(columns, column)"></i>
            <i class="fas fa-arrow-up sort-asc" v-show="column.selectionStatus === 'asc'"
              @click="common.changeSort(columns, column)"></i>
            <i class="fas fa-arrow-up sort-desc" v-show="column.selectionStatus === 'desc'"
              @click="common.changeSort(columns, column)"></i>
            {{ column.label }}
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in common.items.value" :class="setRowClass(item)" :key="item.id">
          <td v-show="allowDelete">
            <MDBCheckbox v-model="item.selected" @change="common.changeSelectionStatus(item)" />
          </td>
          <td v-for="column in columns" v-show="column.showOnSummary === true || column.showOnSummary === undefined"
            :key="column.field">
            <span v-if="column.field === 'gender'">
              {{ column.converter(item[column.field]) === '是' ? '男' : '女' }}
            </span>
            <span v-else-if="column.converter !== undefined">
              {{ column.converter(item[column.field]) }}
            </span>
            <span v-else-if="column.type === 'uuid'">
              <MDBBtn color="link" @click="copyID(item, column.field, column.label)">
                <i class="fas fa-copy"></i>
              </MDBBtn>
            </span>
            <span v-else>
              {{ item[column.field] }}
            </span>
          </td>
          <td>
            <div>
              <MDBBtn color="link" @click="common.editBtnClicked(item)">
                <i class="fas fa-pen"></i>
              </MDBBtn>
              <MDBBtn v-show="allowDelete" color="link" @click="common.deleteAsync(item)">
                <i class="fas fa-trash" style="color: #DC4C64;"></i>
              </MDBBtn>
            </div>
          </td>
        </tr>
      </tbody>
    </MDBTable>

    <div class="d-flex justify-content-between align-items-center">
      <div>
        <PageIndicator />
      </div>
      <div>
        <PageNavigator />
      </div>
    </div>
  </MDBCard>

  <div
    style="position: fixed; top: 0; left: 15%; right: 8vh; margin-top: 10vh; background-color: rgba(255, 255, 255, 0.87); height: 10vh;">
  </div>

  <div style="position: fixed; top: 0; left: 17%; right: 8vh; margin-top: 12vh;">
    <div class="d-flex flex-row justify-content-between mb-4">
      <div class="d-flex flex-row justify-content-start">
        <AddCommand v-show="allowAdd" />
        <div v-show="allowDelete">
          <DeleteCommand />
        </div>
        <ExcelCommand />
      </div>
      <Search />
    </div>

  </div>
</template>

<style scoped>
.sort {
  color: transparent;
  cursor: pointer;
  transform: rotate(0deg);
  animation: to-transparent 0.3s ease-in-out;
}

.sort:hover {
  color: gray;
  animation: to-gray 0.5s ease-in-out;
}

@keyframes to-gray {
  0% {
    color: transparent;
  }

  100% {
    color: gray;
  }
}

@keyframes to-transparent {
  0% {
    color: gray;
  }

  100% {
    color: transparent;
  }
}

.sort-asc {
  cursor: pointer;
}

.sort-desc {
  cursor: pointer;
  transform: rotate(180deg);
  animation: to-opposite 0.3s ease-in-out;
}

@keyframes to-opposite {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
  }
}
</style>