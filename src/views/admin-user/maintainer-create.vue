<template>
  <maintainer-detail :is-edit="false" />
</template>

<script>
import MaintainerDetail from './components/MaintainerDetail'

export default {
  name: 'MaintainerCreate',
  components: { MaintainerDetail }
}
</script>
