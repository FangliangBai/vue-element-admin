<template>
  <admin-user-detail :is-edit="true" />
</template>

<script>
import AdminUserDetail from './components/AdminUserDetail'

export default {
  name: 'EditAdminUser',
  components: { AdminUserDetail }
}
</script>
