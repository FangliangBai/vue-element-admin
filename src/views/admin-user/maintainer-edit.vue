<template>
  <maintainer-detail :is-edit="true" />
</template>

<script>
import MaintainerDetail from './components/MaintainerDetail'

export default {
  name: 'MaintainerCreate',
  components: { MaintainerDetail }
}
</script>
