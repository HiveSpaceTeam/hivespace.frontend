<script>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { GoogleMap, Marker } from "vue3-google-map";
import baseDetail from "@/views/base/baseDetail.js";
import { z } from "zod";
import { useI18n } from "vue-i18n";
export default {
  extends: baseDetail,
  components: { VueFinalModal, GoogleMap, Marker },
  setup() {
    const { t } = useI18n();
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
          fullName: z.string({ required_error: t('i18nUser.requiredField') }),
          phoneNumber: z.string({ required_error: t('i18nUser.requiredField') }),
          street: z.string({ required_error: t('i18nUser.requiredField') }),
          province: z.string({ required_error: t('i18nUser.requiredField') }),
          district: z.string({ required_error: t('i18nUser.requiredField') }),
          ward: z.string({ required_error: t('i18nUser.requiredField') }),
          specificAdress: z.string({ required_error: t('i18nUser.requiredField') }),
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
      async (newValue) => {
        onChangeProvince(newValue[0]);
      }
    );

    watch(
      () => [model.value.district, districts.value],
      async (newValue) => {
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
      <span class="text-xl font-semibold block mb-4">{{ $attrs.popupTitle }}</span>
      <Form
        v-slot="$form"
        :resolver="resolver"
        @submit="onSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <FloatLabel variant="on">
                <InputText
                  name="fullName"
                  v-model="model.fullName"
                  id="fullName"
                  class="w-full"
                />
                <label for="fullName">{{ $t('i18nUser.fullName') }}</label>
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
              <FloatLabel variant="on">
                <InputText
                  name="phoneNumber"
                  class="w-full"
                  v-model="model.phoneNumber"
                  id="phoneNumber"
                />
                <label for="phoneNumber">{{ $t('i18nUser.phoneNumber') }}</label>
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
          <div class="grid grid-cols-3 gap-4">
            <div>
              <Select
                class="w-full"
                v-model="model.province"
                optionValue="fullName"
                filter
                name="province"
                :options="provinces"
                optionLabel="fullName"
                :placeholder="$t('i18nUser.province')"
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
                :placeholder="$t('i18nUser.district')"
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
                :placeholder="$t('i18nUser.ward')"
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
              :placeholder="$t('i18nUser.specificAddress')"
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
            :api-key="process?.env?.VITE_APP_API_KEY"
            style="width: 100%; height: 300px"
            :center="center"
            :zoom="15"
          >
            <Marker :options="{ position: center }" />
          </GoogleMap>
          <div class="flex items-center gap-2 mt-2">
            <Checkbox
              v-model="model.isDefault"
              inputId="staySignedIn"
              name="staySignedIn"
              binary
            />
            <label for="staySignedIn">{{ $t('i18nUser.setAsDefault') }}</label>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button
            @click="() => close()"
            class="w-[150px]"
            severity="secondary"
            :label="$t('i18nUser.back')"
          />
          <Button
            type="submit"
            class="w-[150px]"
            severity="warn"
            :label="$t('i18nUser.complete')"
          />
        </div>
      </Form>
    </template>
  </VueFinalModal>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>
