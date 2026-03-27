<script setup>
import { h } from 'vue'

const props = defineProps({
  content: {
    type: [String, Array],
    required: true
  }
})

const renderContent = () => {
  const { content } = props

  if (Array.isArray(content)) {
    const [tag, text] = content
    if (tag != "script") {
        return h(tag, {}, text)
    }
  }

  return content
}
</script>

<template>
    <div>
      <renderContent />
    </div>
  </template>