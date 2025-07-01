<template>
  <auth-layout :title="$t('i18nAuth.signup')">
    <p class="text-2xl py-6 w-full">{{ $t('i18nAuth.signup') }}</p>
    <Form
      v-slot="$form"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <InputText
            name="userName"
            type="text"
            v-model="model.userName"
            :placeholder="$t('i18nAuth.username')"
          />
          <Message
            v-if="$form.userName?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.userName.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1">
          <InputText
            name="email"
            v-model="model.email"
            type="email"
            :placeholder="$t('i18nAuth.email')"
          />
          <Message
            v-if="$form.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.email.error?.message }}</Message
          >
        </div>

        <div class="flex flex-col gap-1">
          <Password
            name="password"
            v-model="model.password"
            :placeholder="$t('i18nAuth.enterPassword')"
            :feedback="false"
            fluid
            toggleMask
          />
          <template v-if="$form.password?.invalid">
            <Message
              v-for="(error, index) of $form.password.errors"
              :key="index"
              severity="error"
              size="small"
              variant="simple"
              >{{ error.message }}</Message
            >
          </template>
        </div>
      </div>
      <Button type="submit" severity="danger" :label="$t('i18nAuth.createAccount')" />
      <div class="flex items-center justify-center">
        <p class="text-[#81818F]">{{ $t('i18nAuth.accountExists') }}</p>
        <p
          class="text-[#ee4d2d] ml-[4px] cursor-pointer"
          @click="onClickGoToLoginPage"
        >
          {{ $t('i18nAuth.login') }}
        </p>
      </div>
    </Form>
  </auth-layout>
</template>
<script lang="ts">
import { ref, getCurrentInstance } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import baseDetail from "@/views/base/baseDetail.js";
import { useI18n } from "vue-i18n";

export default {
  extends: baseDetail,
  components: { AuthLayout },

  setup() {
    const { t } = useI18n();
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const model = ref({
      userName: null,
      email: null,
      password: null,
    });
    const module = "moduleUser";
    const resolver = ref(
      zodResolver(
        z.object({
          userName: z.string({ required_error: t('i18nUser.messages.requiredField') }),
          email: z
            .string({ required_error: t('i18nUser.messages.requiredField') })
            .email({
              message: t('i18nUser.messages.invalidEmailFormat'),
            }),
          password: z
            .string({ required_error: t('i18nUser.messages.requiredField') })
            .min(3, { message: t('i18nUser.messages.minChar') })
            .refine((value) => /[a-z]/.test(value), {
              message: t('i18nUser.messages.requireLowercase'),
            })
            .refine((value) => /[A-Z]/.test(value), {
              message: t('i18nUser.messages.requireUppercase'),
            }),
        })
      )
    );
    const onFormSubmit = async ({ valid }) => {
      if (!valid) return;
      const res = await proxy.$store.dispatch("moduleUser/signup", {
        userName: model.value.userName,
        email: model.value.email,
        password: model.value.password,
      });
      if (res) router.push("/login");
    };
    const onClickGoToLoginPage = () => router.push("/login");
    return {
      resolver,
      onClickGoToLoginPage,
      onFormSubmit,
      model,
      module,
    };
  },
};
</script>

<style scoped lang="scss"></style>
