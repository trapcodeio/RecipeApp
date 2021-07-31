import "izitoast/dist/css/iziToast.css";

import Vue from "vue";
import Busy from "./components/Busy";
import VueTrapPack from "vue-trap-pack";
import HttpRequest from "vue-trap-pack/HttpRequest";
import HttpRequestMixin from "vue-trap-pack/src/Requests";
import LoadingButton from "./components/LoadingButton";
import TimeAgo from "./components/TimeAgo";
import $toast from "./toast";
import StatusTag from "@/components/StatusTag";

Vue.config.productionTip = false;

Vue.component("Busy", Busy);
Vue.component("LoadingButton", LoadingButton);
Vue.component("TimeAgo", TimeAgo);
Vue.component("StatusTag", StatusTag);

//// Setup
const $api = new HttpRequest("api");
$api.isXmlRequest();
// Vue trap pack
Vue.use(VueTrapPack, {
  api: $api
});

Vue.prototype.$toast = $toast;

// Axios interceptors
$api.axios.interceptors.response.use((response) => {
  const { proceed, data } = response.data;
  if (proceed === true && data && data.message) {
    $toast.success(data.message);
  } else if (proceed === false && data && data.error) {
    $toast.error(data.error);
  }
  return response;
});

/// Window
window.HttpRequestMixin = HttpRequestMixin;
