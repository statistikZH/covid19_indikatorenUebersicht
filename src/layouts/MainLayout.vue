<template>
  <q-layout view="lHh Lpr lff">

    <q-header elevated>
      <q-toolbar class="items-start">
        <q-toolbar-title class="no-ellipsis q-py-sm">
          Covid-19 Indikatoren Übersicht
        </q-toolbar-title>
        <img src="../assets/ktzh-logo-mobile.svg" alt="Logo Kanton Zürich" class="q-mt-sm" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>
          {{ version }}
          <a href="https://github.com/statistikZH/covid19_scrapingdashboard/blob/master/CHANGELOG.md" style="color:#ccc">
            changelog
          </a>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

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
