<template>
  <admin-user-detail :is-edit="false" />
</template>

<script>
import AdminUserDetail from './components/AdminUserDetail'

export default {
  name: 'CreateAdminUser',
  components: { AdminUserDetail }
}
</script>
