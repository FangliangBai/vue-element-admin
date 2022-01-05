<template>
  <operation-detail :is-edit="false" />
</template>

<script>
import OperationDetail from './components/OperationDetail'
export default {
  name: 'OperationCreate',
  components: { OperationDetail }
}
</script>
