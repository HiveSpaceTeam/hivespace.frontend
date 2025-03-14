<script>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { GoogleMap, Marker } from "vue3-google-map";
import baseDetail from "@/views/base/baseDetail.js";
import { z } from "zod";
export default {
  extends: baseDetail,
  components: { VueFinalModal, GoogleMap, Marker },
  setup() {
    const model = ref({
      fullName: null,
      phoneNumber: null,
      street: null,
      province: null,
      district: null,
      ward: null,
    });
    const { proxy } = getCurrentInstance();
    const module = "moduleUserAddress";
    const provinces = ref([]);
    const districts = ref([]);
    const wards = ref([]);
    const center = { lat: 21.028511, lng: 105.804817 };
    const resolver = ref(
      zodResolver(
        z.object({
          fullName: z.string({ required_error: "Không được để trống" }),
          phoneNumber: z.string({ required_error: "Không được để trống" }),
          street: z.string({ required_error: "Không được để trống" }),
          province: z.string({ required_error: "Không được để trống" }),
          district: z.string({ required_error: "Không được để trống" }),
          ward: z.string({ required_error: "Không được để trống" }),
          specificAdress: z.string({ required_error: "Không được để trống" }),
        })
      )
    );
    onMounted(async () => {
      const res = await proxy.$store.dispatch("moduleLocation/getLocation", {
        type: 1, //enum
      });
      provinces.value = res.data;
    });

    watch(
      () => [model.value.province, provinces.value],
      async (newValue, oldValue) => {
        onChangeProvince(newValue[0]);
      }
    );

    watch(
      () => [model.value.district, districts.value],
      async (newValue, oldValue) => {
        onChangeDistrict(newValue[0]);
      }
    );

    const onChangeProvince = async (data) => {
      const res = await proxy.$store.dispatch("moduleLocation/getLocation", {
        type: 2, //enum
        parentCode: provinces.value.find((item) => item.fullName === data)
          ?.code,
      });
      districts.value = res.data;
    };

    const onChangeDistrict = async (data) => {
      const res = await proxy.$store.dispatch("moduleLocation/getLocation", {
        type: 3, //enum
        parentCode: districts.value.find((item) => item.fullName === data)
          ?.code,
      });
      wards.value = res.data;
    };
    return {
      model,
      module,
      resolver,
      center,
      provinces,
      districts,
      wards,
      onChangeProvince,
      onChangeDistrict,
    };
  },
};
</script>

<template>
  <VueFinalModal
    :hide-overlay="false"
    :overlay-transition="'vfm-fade'"
    :content-transition="'vfm-fade'"
    :click-to-close="true"
    :esc-to-close="true"
    :background="'non-interactive'"
    :lock-scroll="true"
    :reserve-scroll-bar-gap="true"
    :swipe-to-close="none"
    class="flex justify-center items-center"
    content-class="w-[600px] mx-4 p-5 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
  >
    <template #default="{ close }">
      <span class="text-xl">{{ $attrs.popupTitle }}</span>
      <Form
        v-slot="$form"
        :resolver="resolver"
        @submit="onSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-1">
            <div class="flex flex-col gap-1">
              <FloatLabel variant="on">
                <InputText
                  name="fullName"
                  v-model="model.fullName"
                  id="fullName"
                  class="w-full"
                />
                <label for="fullName">Họ và tên</label>
              </FloatLabel>
              <template v-if="$form.fullName?.invalid">
                <Message
                  v-for="(error, index) of $form.fullName.errors"
                  :key="index"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ error.message }}</Message
                >
              </template>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex flex-col gap-1">
                <FloatLabel variant="on">
                  <InputText
                    name="phoneNumber"
                    class="w-full"
                    v-model="model.phoneNumber"
                    id="phoneNumber"
                  />
                  <!-- <InputMask
                    v-model="model.PhoneNumber"
                    id="phonenumber"
                    mask="(99)999 999 999"
                    fluid
                  /> -->
                  <label for="phoneNumber">Số điện thoại</label>
                </FloatLabel>
                <Message
                  v-if="$form.phoneNumber?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.phoneNumber.error?.message }}</Message
                >
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1">
            <div>
              <Select
                class="w-full"
                v-model="model.province"
                optionValue="fullName"
                filter
                name="province"
                :options="provinces"
                optionLabel="fullName"
                placeholder="Tỉnh/Thành phố"
              />
              <Message
                v-if="$form.province?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.province.error?.message }}</Message
              >
            </div>
            <div>
              <Select
                class="w-full"
                filter
                v-model="model.district"
                optionValue="fullName"
                name="district"
                :options="districts"
                optionLabel="fullName"
                placeholder="Quận/huyện"
              />
              <Message
                v-if="$form.district?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.district.error?.message }}</Message
              >
            </div>
            <div>
              <Select
                class="w-full"
                filter
                v-model="model.ward"
                name="ward"
                optionValue="fullName"
                :options="wards"
                optionLabel="fullName"
                placeholder="Phường/xã"
              />
              <Message
                v-if="$form.ward?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.ward.error?.message }}</Message
              >
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <InputText
              v-model="model.street"
              name="specificAdress"
              type="text"
              placeholder="Địa chỉ cụ thể"
            />
            <template v-if="$form.specificAdress?.invalid">
              <Message
                v-for="(error, index) of $form.specificAdress.errors"
                :key="index"
                severity="error"
                size="small"
                variant="simple"
                >{{ error.message }}</Message
              >
            </template>
          </div>
          <GoogleMap
            :api-key="process?.env?.VUE_APP_API_KEY"
            style="width: 100%; height: 300px"
            :center="center"
            :zoom="15"
          >
            <Marker :options="{ position: center }" />
          </GoogleMap>
          <div class="flex items-center gap-2">
            <Checkbox
              v-model="model.isDefault"
              inputId="staySignedIn"
              name="staySignedIn"
              binary
            />
            <label for="staySignedIn">Đặt làm địa chỉ mặc định</label>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button
            @click="() => close()"
            class="w-[150px]"
            severity="secondary"
            label="Trở lại"
          />
          <Button
            type="submit"
            class="w-[150px]"
            severity="warn"
            label="Hoàn thành"
          />
        </div>
      </Form>
    </template>
    <!-- <LoginFormVorms @submit="(formData) => emit('submit', formData)" /> -->
  </VueFinalModal>
</template>
<style scoped></style>
