<template>
  <div class="card">
    <Tabs @update:value="onChangeTab" :value="-1">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{
          tab.title
        }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <div v-if="items.length > 0">
            <order-card v-for="item in items" :order="item" />
            <div class="text-center">
              <button @click="loadMore" class="button-primary button m-auto">
                Load more
              </button>
            </div>
          </div>
          <div class="list-order-empty" v-else>Chưa có đơn hàng</div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script>
import OrderCard from "./OrderCard.vue";
import { ref, onMounted, getCurrentInstance } from "vue";
import baseList from "@/views/base/baseList.js";
export default {
  extends: baseList,

  components: {
    OrderCard,
  },
  setup() {
    const autoLoadGrid = true;
    const { proxy } = getCurrentInstance();
    const module = "moduleOrder";
    const tabs = ref([
      {
        title: "Tất cả",
        value: -1,
      },
      {
        title: "Chờ xác nhận",
        value: proxy.$hivespace.enumeration.orderStatus.pendingApproval,
      },
      {
        title: "Chờ lấy hàng",
        value: proxy.$hivespace.enumeration.orderStatus.approved,
      },
      {
        title: " Chờ giao hàng",
        value: proxy.$hivespace.enumeration.orderStatus.awaitingShipment,
      },
      {
        title: "Đã giao",
        value: proxy.$hivespace.enumeration.orderStatus.shipped,
      },
      {
        title: " Đã hủy",
        value: proxy.$hivespace.enumeration.orderStatus.canceled,
      },
      { title: " Trả hàng/hoàn tiền", value: 6 },
    ]);

    const onChangeTab = (value) => {
      proxy.gridInfo.filters = proxy.gridInfo.filters || {};
      proxy.gridInfo.filters = {
        ...proxy.gridInfo.filters,
        status: {
          value,
          comparison: proxy.$hivespace.enumeration.comparisonOperator.equal,
        },
      };
      proxy.reload();
    };
    return { module, autoLoadGrid, tabs, onChangeTab };
  },
};
</script>
