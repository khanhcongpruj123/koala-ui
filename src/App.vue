<script setup lang="ts">
import LoginPage from './components/screens/LoginPage.vue'
import HomePage from './components/screens/HomePage.vue'
import NotFoundPage from './components/screens/NotFound.vue'
</script>

<script lang="ts">
const routes = {
  '/': HomePage,
  'login': LoginPage
}

import { Configuration, FrontendApi, IdentityApi } from '@ory/client'

const frontend = new FrontendApi(
  new Configuration({
    basePath: `http://${location.host}/.ory`,
    baseOptions: {
      withCredentials: true
    }
  })
)

export default {
  data() {
    return {
      currentPath: location.pathname
    }
  },
  async beforeMount() {
    try {
      const session = await frontend.toSession()
      console.log(session)
      if (!session.data.active) {
        location.pathname = '/login'
      } else if (location.pathname == '/login') {
        location.pathname = '/'
      }
    } catch (ex: any) {
      location.pathname = '/login'
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFoundPage
    }
  }
}
</script>

<template>
  <main>
    <component :is="currentView" />
  </main>
</template>
