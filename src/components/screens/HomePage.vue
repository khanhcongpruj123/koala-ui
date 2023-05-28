<script setup lang="ts"></script>

<script lang="ts">
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
      session: {}
    }
  },
  async mounted() {
    this.session = await frontend.toSession()
  },
}

</script>

<template>
  <main>
    <div>
      {{ session }}
    </div>
  </main>
</template>