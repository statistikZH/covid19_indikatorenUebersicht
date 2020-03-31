<template>
  <a :href="href" target="_blank">
    <q-chip square class="q-ma-none">
      <q-avatar icon="call_made" color="grey-6" text-color="white" />
      {{ label }}
    </q-chip>
  </a>
</template>

<script>
export default {
  name: 'UiLink',
  props: {
    href: {
      type: String,
      default: '#'
    },
    label: {
      type: String,
      default: 'Link'
    }
  }
}
</script>
