<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.no-ellipsis {
  white-space: normal;
}
.items-start {
  align-items: flex-start !important;
}
</style>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
    }
  },
  computed: {
    version () {
      return 'Version: ' + process.env.APP_VERSION_SHORT
    }
  }
}
</script>
