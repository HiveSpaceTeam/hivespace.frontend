<template>
  <div class="max-w-[1200px] mx-auto">
    <div class="card flex">
      <Menu :model="items" class="w-full md:w-60">
        <template #start>
          <span class="inline-flex items-center gap-1 px-2 py-5">
            <img
              src="https://down-vn.img.susercontent.com/file/36b878bafc795dd0ad8c0b142270d8b9"
              class="rounded-full w-[34px]"
            />
            <span class="text-s font-semibold">
              {{ username }}
            </span>
          </span>
        </template>
        <template #submenulabel="{ item }">
          <div v-if="!item.linkTo" class="flex items-center gap-1">
            <span :class="item.icon" />
            <span class="text-primary">{{ item.label }}</span>
          </div>
          <router-link v-else :to="item.linkTo">
            <a v-ripple class="flex items-center gap-1">
              <span :class="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </router-link>
        </template>
        <template #item="{ item, props }">
          <router-link :to="item.linkTo">
            <a v-ripple class="flex items-center" v-bind="props.action">
              <span>{{ item.label }}</span>
            </a>
          </router-link>
        </template>
      </Menu>
      <div class="bg-white p-4 w-[1000px]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import userManager from "@/auth/user-manager";
import authHelper from "@/helpers/authHelper";
import appConfig from "@/config/appConfig";

const items = ref([
  { separator: true },
  {
    label: "Tài khoản của tôi",
    icon: "hivespace-icon hivespace-user",
    items: [
      { label: "Ngân hàng", badge: 2, linkTo: "/user/account/bank" },
      { label: "Địa chỉ", linkTo: "/user/account/address" },
      { label: "Đổi mật khẩu", linkTo: "/user/account/password" },
    ],
  },
  {
    label: "Đơn mua",
    icon: "hivespace-icon hivespace-purchase",
    items: [],
    linkTo: "/user/purchase",
  },
]);

const enableOauth = appConfig.enableOauth;
const user = ref(null);

const username = computed(() => {
  if (enableOauth) {
    return user.value?.profile?.name || "";
  } else {
    return authHelper.getContext()?.username || "";
  }
});

onMounted(async () => {
  if (enableOauth) {
    user.value = await userManager.getUser();
  }
});
</script>

<style scoped lang="scss">
:deep {
  .p-menu {
    border: unset;
  }
  .p-tab {
    font-weight: normal;
  }
}
</style>
