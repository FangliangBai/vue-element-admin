<template>
  <maintain-detail :is-edit="false" />
</template>

<script>
import MaintainDetail from './components/MaintainDetail'
export default {
  name: 'MaintainCreate',
  components: { MaintainDetail }
}
</script>
