<template>
  <a :href="href" target="_blank" style="text-decoration:none">
    <q-chip square class="q-ma-none">
      <q-avatar icon="call_made" color="grey-6" text-color="white" />
      <span class="ellipsis">{{ label }}</span>
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
