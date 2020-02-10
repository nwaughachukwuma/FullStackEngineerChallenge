<template>
  <b-container class="page-login my-3 px-auto">
    <div v-if="loading || !formLoaded">
      <span class="spinner"></span>
    </div>
    <div v-if="!loading && formLoaded">
      <b-card-group deck class="mt-3 mx-5">
        <b-card class="px-5">
          <h1>Create Employee</h1>
          <p class="text-muted">Add a new staff</p>

           <!-- Employee Name -->
          <b-form @submit.stop.prevent="onSubmit">
            <b-form-group id="group-name" label-for="input-name">
              <template v-slot:label>
                Full name
                <span class="text-danger">*</span>
              </template>

              <b-form-input
                id="input-name"
                type="text"
                v-model="form.name"
                :state="$v.form.name.$dirty ? !$v.form.name.$error : null"
                placeholder="Employee name"
              ></b-form-input>

              <b-form-invalid-feedback id="input-name-invalid">Please enter your first name.</b-form-invalid-feedback>
            </b-form-group>

            <!-- Employee Email -->
            <b-form-group id="group-email" label-for="input-email">
              <template v-slot:label>
                Email address
                <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="input-email"
                v-model="form.email"
                type="email"
                placeholder="Email address"
                :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
              ></b-form-input>

              <b-form-text
                id="input-email-help"
              >Email must be valid email address. i.e. sample@username.com.</b-form-text>

              <b-form-invalid-feedback id="input-email-invalid">Please enter valid email address.</b-form-invalid-feedback>
            </b-form-group>

            <!-- Job Definition -->
            <b-form-group id="group-job" label-for="input-job">
              <template v-slot:label>
                Job Definition
                <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="input-job"
                v-model="form.job"
                type="text"
                placeholder="Job name/type"
                :state="$v.form.job.$dirty ? !$v.form.job.$error : null"
              ></b-form-input>

              <b-form-text
                id="input-job-help"
              >Job description of the employee i.e. Software Developer/Accountant</b-form-text>

              <b-form-invalid-feedback id="input-job-invalid">
                  Please enter valid job definition
                </b-form-invalid-feedback>
            </b-form-group>

            <!-- Employee Role -->
            <b-form-group id="group-role" label-for="input-role" v-if="userType === 'staff'">
              <template v-slot:label>
                Role
                <span class="text-danger">*</span>
              </template>

              <b-form-select
                id="input-role"
                v-model="form.role"
                :options="staffRoles"
                :state="$v.form.role.$dirty ? !$v.form.role.$error : null"
              ></b-form-select>

              <b-form-text
                id="input-role-help"
              >Configure whether the employee is admin or staff</b-form-text>

              <b-form-invalid-feedback id="input-role-invalid">
                  Please select valid role.
                </b-form-invalid-feedback>
            </b-form-group>

            <!-- Employee Gender -->
            <b-form-group id="group-gender" label-for="input-gender">
              <template v-slot:label>
                Gender
                <span class="text-danger">*</span>
              </template>

              <b-form-select
                id="input-gender"
                v-model="form.gender"
                :options="userGender"
                :state="$v.form.gender.$dirty ? !$v.form.gender.$error : null"
              ></b-form-select>

              <b-form-invalid-feedback id="input-gender-invalid">
                  Please select valid gender.
                </b-form-invalid-feedback>
            </b-form-group>

            <!-- Employee rank -->
            <b-form-group id="group-rank" label-for="input-rank">
              <template v-slot:label>
                Rank
                <span class="text-danger">*</span>
              </template>

              <b-form-select
                id="input-rank"
                v-model="form.rank"
                :options="userRank"
                :state="$v.form.rank.$dirty ? !$v.form.rank.$error : null"
              ></b-form-select>

              <b-form-text
                id="input-rank-help"
              >Rank of the employee from Junior to Executive.</b-form-text>

              <b-form-invalid-feedback id="input-rank-invalid">Please select valid status.</b-form-invalid-feedback>
            </b-form-group>

            <template v-if="errorMessages">
              <b-row class="mb-2">
                <b-col class="text-danger message-col">{{ errorMessages }}</b-col>
              </b-row>
            </template>

            <b-row>
              <b-col>
                <b-button type="submit" size="sm" variant="success" :disabled="loading">
                  <span class="spinner spinner-white" v-if="loading"></span>
                  <font-awesome-icon :icon="['fas', 'save']" class="mr-1" />Save
                </b-button>
              </b-col>
              <b-col class="text-right">
                <b-button size="sm" variant="warning" :to="{ path: `${listUrl}` }">
                  <font-awesome-icon :icon="['fas', 'long-arrow-alt-left']" class="mr-1" />Back to list
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-card-group>
    </div>
  </b-container>
</template>

<script>
import {
  email,
  required,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import { mapGetters, mapState } from "vuex";
import _ from "lodash";
import moment from "moment";
import permissionService from "@/services/permissionService";
import { validateDateTime } from "@/utils/helpers";
import configService from "@/services/configService";

export default {
  name: "UserFormBox",
  props: {
    listUrl: String,
    userType: String,
    formType: String,
    userId: {
      type: Number,
      required: false
    },
    permissions: {
      type: Array,
      required: false
    }
  },
  metaInfo() {
    return {
      meta: [
        {
          name: "description",
          content: this.metaDescription
        }
      ]
    };
  },
  data() {
    return {
      title: "",
      formLoaded: false,
      form: {
        email: null,
        name: null,
        role: null,
        gender: 'Female',
        rank: 'Mid',
        job: null
      },
      dateTimeFormat: configService.get("format").pickerDateTime,
      staffRoles: _.reduce(
        _.pick(permissionService.userRoles, ["superadmin", "admin", "staff"]),
        (result, value, key) => {
          result.push({ value, text: _.capitalize(key) });
          return result;
        },
        []
      ),
      userGender: ['Male', 'Female'],
      userRank:  ['Junior', 'Mid', 'Senior', 'Executive']
    };
  },
  validations() {
    const formValidation = {
      email: {
        required,
        email
      },
      name: {
        required,
        minLength: minLength(5),
      },
    //   username: {
    //     required,
    //     minLength: minLength(3),
    //     maxLength: maxLength(15),
    //     validateUsername: username => {
    //       if (username === null) {
    //         return false;
    //       }
    //       return username.match(/^[0-9a-zA-Z_]+$/) !== null;
    //     }
    //   },
      permissions: {},
      role: {
        validateRole: value => {
          if (this.userType === "user") {
            return true;
          }
          return _.some(permissionService.userRoles, role => value === role);
        }
      },
      gender: {
          required
      },
      rank: {
          required
      },
      job: {
          required
      }
    };
    return { form: formValidation };
  },
  mounted() {
    this.$nextTick(async () => {
      // Code that will run only after the entire view has been re-rendered
      if (this.formType === "new") {
        if (this.userType === "staff") {
          this.form.role = permissionService.userRoles.staff;
        }
        this.formLoaded = true;
        this.$v.$touch(); // Set initial validation
        this.$v.$reset(); // Reset $dirty
      }
    });
  },
  computed: {
    metaDescription() {
      return this.formType === "new" ? "Add new user" : "Update user";
    },
    ...mapGetters("alert", ["errorMessages"]),
    ...mapState("user", ["loading", "user"]),
    showPermissions() {
      return (
        this.userType === "staff" &&
        this.form.role === permissionService.userRoles.staff
      );
    }
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }
      const user = {
        name: this.form.name,
        email: this.form.email,
        jobDefinition: this.form.job,
        gender: this.form.gender.toLowerCase(),
        rank: this.form.rank.toLowerCase(),
        role: this.form.role ? this.form.role : permissionService.userRole.user,
      };
      if (this.formType === "new") {
        this.$emit("add", { user });
      } else {
        this.$emit("edit", { user });
      }
      return false;
    }
  },
  watch: {
    user(_newValue, _oldValue) {
      if (!this.user.id) {
        return;
      }
      // Loaded user, assign to form
      this.form.name = this.user.name;
      this.form.email = this.user.email;
      this.form.job = this.user.job;
      this.form.role = this.user.role;
      this.form.gender = this.user.gender;
      this.form.rank = this.user.rank;

      this.formLoaded = true;
      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    }
  }
};
</script>