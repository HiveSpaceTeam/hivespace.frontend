<template>
  <div>
    <div class="card">
      <div class="flex justify-end mb-4">
        <Button
          @click="add"
          :label="$t('i18nUser.addAddress')"
          severity="warn"
          icon="pi pi-plus"
        />
      </div>
      <DataTable
        v-if="items.length > 0"
        :ref="baseGrid"
        v-model:selection="selectedAddresses"
        :value="items"
        dataKey="id"
        :rows="10"
        :filters="filters"
        class="w-full"
      >
        <Column field="price" :header="$t('i18nUser.address')" style="min-width: 8rem">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <b>{{ slotProps.data.fullName }}</b>
              <Divider layout="vertical" />
              <span>{{ slotProps.data.phoneNumber }}</span>
            </div>
            <div>{{ slotProps.data.street }}</div>
            <div>{{ `${slotProps.data.ward}, ${slotProps.data.district}, ${slotProps.data.province}` }}</div>
            <Tag
              severity="warn"
              v-if="slotProps.data.isDefault"
              :value="$t('i18nUser.default')"
            />
          </template>
        </Column>
        <Column :exportable="false" style="width: 140px">
          <template #body="slotProps">
            <div class="flex justify-end gap-3">
              <span
                @click="edit(slotProps.data)"
                class="text-[#0B80CC] cursor-pointer"
                >{{ $t('i18nUser.update') }}</span
              >
              <span
                @click="deleteOne(slotProps.data)"
                class="text-[#0B80CC] cursor-pointer"
                >{{ $t('i18nUser.delete') }}</span
              >
            </div>
            <Button
              @click="setAsDefault(slotProps.data)"
              :disabled="slotProps.data.isDefault"
              class="w-[160px] set-default-btn mt-2"
              :label="$t('i18nUser.setDefault')"
              severity="secondary"
              variant="outlined"
            />
          </template>
        </Column>
      </DataTable>
      <div class="list-empty text-center py-8 text-gray-400" v-else>{{ $t('i18nUser.noData') }}</div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import baseList from "@/views/base/baseList.js";
import DetailModal from "@/views/user/account/address/UserAddressPopup.vue";

export default {
  extends: baseList,
  setup() {
    const { proxy } = getCurrentInstance();
    const module = "moduleUserAddress";
    const selectedAddresses = ref();
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const setAsDefault = ({ id }) => {
      proxy.$store.dispatch(`${module}/setAsDefault`, id);
    };
    const loadDataGrid = () => {
      proxy.$store.dispatch(`${module}/getAll`);
    };
    return {
      detailModal: DetailModal,
      module,
      autoLoadGrid: true,
      setAsDefault,
      loadDataGrid,
      selectedAddresses,
      filters,
    };
  },
};
</script>

<style scoped>
.set-default-btn {
  line-height: 13px;
}
</style>
