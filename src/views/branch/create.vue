<template>
  <branch-detail :is-edit="false" />
</template>

<script>
import BranchDetail from './components/BranchDetail'

export default {
  name: 'CreateBranch',
  components: { BranchDetail }
}
</script>
