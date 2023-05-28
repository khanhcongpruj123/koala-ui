import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

export default {
  data() {
    return {
      count: 1
    }
  }
}