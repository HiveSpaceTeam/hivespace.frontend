import axios from "axios";
import { useRouter } from "vue-router";
import store from "@/stores/store";
import { showToast } from "@/utils/toastUtil";
import commonFunction from "@/common/commonFunction";
import userManager from "@/auth/user-manager";
import { oAuthSignin } from "@/auth/oauth-helper";
import appConfig from "@/config/appConfig";

const apiCall = async (method, apiURL, payload = null) => {
    const enableOauth = appConfig.enableOauth;
    let headers = {};
    let token = "";
    let router;

    if (enableOauth) {
        const user = await userManager.getUser();
        token = user ? user.access_token : "";
        headers = { 'Authorization': `Bearer ${token}` };
    } else {
        token = store.state.moduleUser.context?.token;
        headers = { 'Authorization': `Bearer ${token}` };
        router = useRouter();
    }

    try {
        const response = await axios({
            method,
            url: apiURL,
            data: payload,
            headers
        });
        return response;
    } catch (error) {
        if (enableOauth) {
            if (error.response.status == 401) {
                await oAuthSignin();
            }
        } else {
            if (error.response.status == 401) {
                router.push("/login");
            }
        }
        if (error.response.status == 404 && error.response.data) {
            showToast({ severity: 'error', detail: error.response.data, group: 'tc', life: 3000, closable: false });
        }
        else if (error.response.status == 422 && error.response.data.Errors?.length > 0 && error.response.data.Errors[0].ErrorCode) {
            const message = commonFunction.getResourceValue("errorCode", error.response.data.Errors[0].ErrorCode);
            showToast({ severity: 'error', detail: message, group: 'tc', life: 3000, closable: false });
        }
        throw error;
    }
};

export default {
    post: (apiURL, payload) => apiCall('post', apiURL, payload),
    get: (apiURL) => apiCall('get', apiURL),
    put: (apiURL, payload) => apiCall('put', apiURL, payload),
    delete: (apiURL) => apiCall('delete', apiURL)
};