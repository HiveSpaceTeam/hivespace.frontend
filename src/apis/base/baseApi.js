export default class BaseApi {
  constructor() {
    let me = this;
  }

  getApiURL(route) {
    let me = this;
    let url = `${import.meta.env.VITE_API_URL}/api/${me.apiVersion}/${me.controller}`;
    if (route) {
      url += `/${route}`;
    }
    return url;
  }
}
