<template>
  <machine-detail :is-edit="true" />
</template>

<script>
import MachineDetail from './components/MachineDetail'

export default {
  name: 'CreateMachine',
  components: { MachineDetail }
}
</script>
