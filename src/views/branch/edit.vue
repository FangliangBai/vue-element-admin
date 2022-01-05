<template>
  <branch-detail :is-edit="true" />
</template>

<script>
import BranchDetail from './components/BranchDetail'

export default {
  name: 'CreateBranch', // TODO: 这个名字错了，应该是 EditBranch 回头改一下
  components: { BranchDetail }
}
</script>
