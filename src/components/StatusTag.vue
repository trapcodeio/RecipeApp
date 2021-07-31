<template>
  <div class="has-text-weight-bold is-uppercase">
    <span v-if="status === 'published'" class="tag is-success is-light">{{
      status
    }}</span>
    <span v-else-if="status === 'draft'" class="tag is-info is-light">{{ status }}</span>
    <span v-else-if="status === 'deleted'" class="tag is-danger is-light">{{
      status
    }}</span>
  </div>
</template>
<script>
export default {
  name: "StatusTag",
  props: {
    status: {}
  }
};
</script>
