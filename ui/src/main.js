
//3rd parties
import 'jquery/dist/jquery.js'
import 'semantic-ui/dist/semantic.css'
import 'semantic-ui/dist/semantic.js'

import 'highlight.js/styles/default.css'
import 'vue2-animate/dist/vue2-animate.min.css'

//import hljs from 'highlight.js'
import VueHighlightJS from 'vue-highlightjs'
Vue.use(VueHighlightJS)

var jwt_decode = require('jwt-decode');

import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

import warehouse from './warehouse'

import VueSemantic from 'vue-semantic'
Vue.use(VueSemantic)

//element ui
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI, {locale})

//fontasome
import 'vue-awesome/icons'
//import 'vue-awesome/icons/flags' //only include what we need
import Icon from 'vue-awesome/components/Icon.vue'
Vue.component('icon', Icon)

import router from './router'

Vue.use(require('vue-filter'))

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// config
// TODO - find a way to put these somewhere under /config
//
var apihost = "https://brain-life.org/";
var apihost_ws = "wss://brain-life.org/";

switch(process.env.NODE_ENV) {
case "development": 
    var apihost = "https://soichi7.ppa.iu.edu/";
    var apihost_ws = "wss://soichi7.ppa.iu.edu/";
    Vue.config.debug = true;
    break;
case "production":
    console.log("running in production mode");
    break;
}

Vue.config.api = apihost+"/api/warehouse";
Vue.config.wf_api = apihost+"/api/wf";
Vue.config.auth_api = apihost+"/api/auth";
Vue.config.event_api = apihost+"/api/event";
Vue.config.event_ws = apihost_ws+"/api/event";

Vue.http.options.root = Vue.config.api; //default root for $http

///////////////////////////////////////////////////////////////////////////////////////////////////

//config derivatives
Vue.config.jwt = localStorage.getItem("jwt");//jwt token for user
if(Vue.config.jwt) {
    Vue.config.user = jwt_decode(Vue.config.jwt);
    //Validate jwt - if not don't set to config.user
} else {
    //TODO I should do this only when user really need to login 
    console.log("no jwt.. redirect to sign page");
    localStorage.setItem('auth_redirect', document.location);
    document.location = "/auth#!/signin";
}
Vue.http.headers.common['Authorization'] = 'Bearer '+Vue.config.jwt;

router.beforeEach(function (to, from, next) {
    window.scrollTo(0, 0)
    next();
})

/* eslint-disable no-new */
new Vue({
  el: '#warehouse',
  router,
  template: '<warehouse/>',
  components: { warehouse }
})