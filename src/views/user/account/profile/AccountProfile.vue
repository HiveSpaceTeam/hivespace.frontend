<template>
  <div>
    <p class="text-xl mb-1">{{$t('i18nUser.profileTitle')}}</p>
    <p class="mb-2 text-gray-500">{{$t('i18nUser.profileSubtitle')}}</p>
    <hr class="mb-4" />
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <Form
          v-slot="$form"
          :resolver="resolver"
          @submit="onSubmit"
          class="flex flex-col gap-4 w-full"
        >
          <table class="mt-4 w-full">
            <tbody>
              <tr>
                <td class="text-gray-400 text-right w-1/4 align-middle">{{$t('i18nUser.userName')}}</td>
                <td class="pl-4 align-middle">
                  <InputText
                    v-model="model.userName"
                    name="userName"
                    class="w-full"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-gray-400 text-right align-middle">{{$t('i18nUser.fullName')}}</td>
                <td class="pl-4 align-middle">
                  <InputText
                    v-model="model.fullName"
                    name="fullName"
                    class="w-full"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-gray-400 text-right align-middle">{{$t('i18nUser.email')}}</td>
                <td class="pl-4 align-middle">
                  <InputText
                    v-model="model.email"
                    name="email"
                    class="w-full"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-gray-400 text-right align-middle">{{$t('i18nUser.phoneNumber')}}</td>
                <td class="pl-4 align-middle">
                  <InputText
                    v-model="model.phoneNumber"
                    name="phoneNumber"
                    class="w-full"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-gray-400 text-right align-middle">{{$t('i18nUser.gender')}}</td>
                <td class="pl-4 align-middle">
                  <div class="flex flex-wrap gap-4">
                    <RadioButtonGroup
                      v-model="model.gender"
                      @change="onChangeGender"
                      name="gender"
                      class="flex flex-wrap gap-4"
                    >
                      <div class="flex items-center gap-2">
                        <RadioButton inputId="male" name="gender" :value="0" />
                        <label for="male">{{$t('i18nUser.genderMale')}}</label>
                      </div>
                      <div class="flex items-center gap-2">
                        <RadioButton inputId="female" name="gender" :value="1" />
                        <label for="female">{{$t('i18nUser.genderFemale')}}</label>
                      </div>
                      <div class="flex items-center gap-2">
                        <RadioButton inputId="others" name="gender" :value="2" />
                        <label for="others">{{$t('i18nUser.genderOther')}}</label>
                      </div>
                    </RadioButtonGroup>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-gray-400 text-right align-middle">{{$t('i18nUser.dateOfBirth')}}</td>
                <td class="pl-4 align-middle">
                  <DatePicker
                    dateFormat="yy-mm-dd"
                    v-model="model.dateOfBirth"
                    showIcon
                    fluid
                    iconDisplay="input"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td class="pl-4">
                  <Button :label="$t('i18nUser.save')" type="submit" severity="warn" class="w-32" />
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </div>
      <div class="flex flex-col items-center mt-5">
        <img
          src="https://down-vn.img.susercontent.com/file/36b878bafc795dd0ad8c0b142270d8b9"
          class="w-[100px] h-[100px] rounded-full object-cover"
          alt="User avatar"
        />
        <Button :label="$t('i18nUser.chooseImage')" severity="secondary" class="w-[100px] mt-2" />
        <!-- <FileUpload
          mode="basic"
          name="demo[]"
          url="/api/upload"
          accept="image/*"
          :maxFileSize="1000000"
          @upload="onUpload"
          :auto="true"
          :chooseLabel="$t('i18nUser.chooseImage')"
        /> -->
        <span class="text-gray-500 text-center mt-2 whitespace-pre-line">
          {{$t('i18nUser.imageUploadHint')}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import baseDetail from "@/views/base/baseDetail.js";
export default {
  extends: baseDetail,
  setup() {
    const { proxy } = getCurrentInstance();
    const model = ref({
      fullName: null,
      userName: null,
      email: null,
      phoneNumber: null,
      gender: null,
      dateOfBirth: null,
    });
    const loadEditData = true;
    const module = "moduleUser";
    const editMode = proxy.$hivespace.enumeration.editMode.Edit;

    return {
      model,
      module,
      loadEditData,
      editMode,
    };
  },
};
</script>

<style scoped>
td {
  font-size: 14px;
  padding-bottom: 30px;
}
</style>
