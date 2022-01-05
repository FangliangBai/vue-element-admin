<template>
  <machine-detail :is-edit="true" />
</template>

<script>
import MachineDetail from './components/MachineDetail'

export default {
  name: 'CreateMachine', // TODO: 这个名字错了，应该是 EditMachine 回头改一下
  components: { MachineDetail }
}
</script>
