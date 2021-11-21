<template>
  <machine-detail :is-edit="false" />
</template>

<script>
import MachineDetail from './components/MachineDetail'

export default {
  name: 'CreateMachine',
  components: { MachineDetail }
}
</script>
