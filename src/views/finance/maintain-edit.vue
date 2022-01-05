<template>
  <maintain-detail :is-edit="true" />
</template>

<script>
import MaintainDetail from './components/MaintainDetail'
export default {
  name: 'MaintainCreate',
  components: { MaintainDetail }
}
</script>
