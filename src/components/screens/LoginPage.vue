<script setup lang="ts"></script>

<script>

import { Configuration, FrontendApi, IdentityApi } from "@ory/client"

const frontend = new FrontendApi(
  new Configuration({
    basePath: `http://${location.host}/.ory`,
    baseOptions: {
      withCredentials: true,
    },
  }),
)

export default {
  data() {
    return {
      ui: {}
    }
  },
  async created() {
    const loginFlow = await frontend.createBrowserLoginFlow()
    this.ui = loginFlow.data.ui
  },
  methods: {}
}
</script>

<template>
  <main>
    <div>
      <form :action="ui.action" :method="ui.method">
        <input
          v-for="item in ui.nodes" :key="item.group"
          :name="item.attributes.name"
          :type="item.attributes.type"
          :value="item.attributes.value"
        />
      </form>
    </div>
  </main>
</template>

<style scoped></style>
