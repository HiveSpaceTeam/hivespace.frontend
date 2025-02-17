export default class BaseApi {
  constructor() {
    let me = this;
  }

  getApiURL(route) {
    let me = this;
    let url = `http://hivespaceapp.eqgvcchkb0dub7hr.westeurope.azurecontainer.io/api/${me.apiVersion}/${me.controller}`;
    if (route) {
      url += `/${route}`;
    }
    return url;
  }
}
