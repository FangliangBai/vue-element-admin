<template>
  <operation-detail :is-edit="true" />
</template>

<script>
import OperationDetail from './components/OperationDetail'
export default {
  name: 'OperationCreate',
  components: { OperationDetail }
}
</script>
