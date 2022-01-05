<template>
  <manager-detail :is-edit="true" />
</template>

<script>
import ManagerDetail from './components/ManagerDetail'

export default {
  name: 'ManagerCreate',
  components: { ManagerDetail }
}
</script>
