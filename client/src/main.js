import Vue from 'vue'
import Vuesax from 'vuesax'

import App from './App'
import router from './router/index'
import { store } from './store/store'

import PaperDashboard from './plugins/paperDashboard'
import 'vue-notifyjs/themes/default.css'

Vue.use(Vuesax)
Vue.use(PaperDashboard)

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
