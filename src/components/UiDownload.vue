<template>
  <q-chip square style="cursor:pointer; border-radius:0" size="md" :class="`q-ma-none ${color}`">
    <q-avatar :icon="$zhicons.download" color="grey-6" text-color="white" />
    {{ label }}
  </q-chip>
</template>

<script>
export default {
  name: 'UiDownload',
  props: {
    label: {
      type: String,
      default: 'Download'
    },
    color: {
      type: String,
      default: 'bg-grey-4'
    }
  }
}
</script>
