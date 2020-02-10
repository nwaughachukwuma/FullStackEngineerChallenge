<template>
  <div class="page-class page-staff-form">
    <h1 class="page-title">{{ title }}</h1>
    <user-form-box
      list-url="/employees"
      :form-type="formType"
      :user-id="userId"
      :permissions="permissions"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserFormBox from '@/components/UserFormBox.vue';
import router from '@/router';

export default {
  name: 'EmployeeForm',
  components: {
    UserFormBox
  },
  async mounted() {
    this.permissionList({ router });
    if (['employee-new', 'staff-new'].includes(this.$route.name)) {
      this.formType = 'new';
      this.userId = null;
    } else {
      this.formType = 'update';
      this.userId = this.$route.params.id;
      await this.getOne({
        type: 'employees',
        userId: this.userId,
        router
      });
    }
  },
  data() {
    return {
      formType: '',
      userId: null
    };
  },
  computed: {
    title() {
      return this.formType === 'new' ? 'Add new staff' : 'Update staff';
    },
    ...mapState('user', ['loading']),
    ...mapState('permission', ['permissions'])
  },
  methods: {
    ...mapActions('user', ['getOne', 'postOne', 'patchOne']),
    ...mapActions('permission', {
      permissionList: 'list'
    }),
    onAdd({ user }) {
      this.postOne({
        type: 'create-employee',
        user,
        router,
        redirectUrl: '/employees'
      });
    },
    onEdit({ user }) {
      this.patchOne({
        type: 'employees',
        userId: this.userId,
        user,
        router,
        redirectUrl: '/employees'
      });
    }
  }
};
</script>