<template>
  <b-form @submit.stop.prevent="onSubmit" class="login-box" data-cy="login-form">

    <b-form-group id="group-name" label label-for="input-name" description>
      <b-form-input
        id="input-name"
        v-model="form.name"
        type="text"
        placeholder="Full name"
        :state="$v.form.name.$dirty ? !$v.form.name.$error : null"
        data-cy="login-name"
        class="from-input input-name"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>

      <b-form-invalid-feedback id="input-name-invalid" data-cy="login-name-invalid"
        >Please enter your full name.</b-form-invalid-feedback
      >
    </b-form-group>
    
    <b-form-group id="group-username" label label-for="input-username" description>
      <b-form-input
        id="input-username"
        v-model="form.username"
        type="text"
        placeholder="Enter email"
        :state="$v.form.username.$dirty ? !$v.form.username.$error : null"
        data-cy="login-username"
        class="from-input input-username"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>

      <b-form-invalid-feedback id="input-username-invalid" data-cy="login-username-invalid"
        >Please enter your email address.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group id="group-password" label label-for="input-password" description>
      <b-form-input
        id="input-password"
        type="password"
        v-model="form.password"
        placeholder="Enter password"
        :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
        data-cy="login-password"
        class="from-input input-password"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>
      <b-form-invalid-feedback id="input-password-invalid" data-cy="login-password-invalid"
        >Please enter your password.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group id="group-confirmPassword" label label-for="input-confirmPassword" description>
      <b-form-input
        id="input-confirmPassword"
        type="password"
        v-model="form.confirmPassword"
        placeholder="Confirm password"
        :state="$v.form.confirmPassword.$dirty ? !$v.form.confirmPassword.$error : null"
        data-cy="login-confirmPassword"
        class="from-input input-password"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>
      <b-form-invalid-feedback id="input-password-invalid" data-cy="login-confirmPassword-invalid"
        >Please enter password confirmation.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group id="group-phone" label label-for="input-phone" description>
      <b-form-input
        id="input-phone"
        type="password"
        v-model="form.phone"
        placeholder="Mobile"
        :state="$v.form.phone.$dirty ? !$v.form.phone.$error : null"
        data-cy="login-phone"
        class="from-input input-password"
        :class="{ 'border-danger': errorMessages }"
      ></b-form-input>
      <b-form-invalid-feedback id="input-password-invalid" data-cy="login-phone-invalid"
        >Please enter your mobile number.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group id="group-gender" label label-for="input-gender" description>
      <b-dropdown id="dropdown-1" text="Gender" block menu-class="w-100" split split-variant="outline-primary" variant="outline-primary" class="m-md-2">
        <b-dropdown-item>Male</b-dropdown-item>
        <b-dropdown-item>Female</b-dropdown-item>
      </b-dropdown>
      <b-form-invalid-feedback id="input-password-invalid" data-cy="login-phone-invalid"
        >Please enter your mobile number.</b-form-invalid-feedback
      >
    </b-form-group>

    <template v-if="successMessages || errorMessages">
      <b-row class="mb-2">
        <b-col v-if="successMessages" data-cy="login-success-message" class="text-primary message-col">{{
          successMessages
        }}</b-col>
        <b-col v-if="errorMessages" data-cy="login-error-message" class="text-danger message-col">{{
          errorMessages
        }}</b-col>
      </b-row>
    </template>

    <!-- :disabled="$v.form.$invalid || loading" -->

    <b-row>
      <b-col>
        <b-button 
          data-cy="login-button" 
          class="btn-login" 
          type="submit" 
          variant="primary"
          :disabled="$v.form.$invalid || loading"
        >
          <span class="spinner spinner-white" v-if="loading"></span>
          Register
        </b-button>
      </b-col>
      <b-col class="text-right">
        <b-link :to="{ path: '/login' }">Already have account</b-link>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
import router from '@/router';
export default {
  name: 'LoginBox',
  data() {
    return {
      form: {
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        gender: '',
        jobDefinition: '',
        rank: ''
      }
    };
  },
  validations: {
    form: {
      name: {
        required
      },
      username: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password')
      },
      phone: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(15)
      },
      gender: {
        required
      },
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      // Already logged in
      this.logout({ router, silent: true });
    }
  },
  computed: {
    ...mapGetters('alert', ['errorMessages', 'successMessages']),
    ...mapState('auth', ['loading']),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['login', 'logout']),
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      // Form submit logic
      this.login({ username: this.form.username, password: this.form.password, router });
    }
  }
};
</script>