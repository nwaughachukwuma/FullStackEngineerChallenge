<template>
  <b-container class="page-login my-3 px-auto">
    <div v-if="loading || !formLoaded">
      <span class="spinner"></span>
    </div>
    <div v-if="!loading && formLoaded">
      <b-card-group deck class="mt-3 mx-5">
        <b-card class="px-5">
          <h1>{{formType === "new"? 'Create Employee': 'Update Employee'}}</h1>
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
                :disabled="formType !== 'new'"
                placeholder="Email address"
                :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
              ></b-form-input>

              <b-form-text
                id="input-email-help"
              >Email must be valid email address. i.e. sample@username.com.</b-form-text>

              <b-form-invalid-feedback id="input-email-invalid">Please enter valid email address.</b-form-invalid-feedback>
            </b-form-group>

            <!-- Job Definition -->
            <b-form-group id="group-jobDefinition" label-for="input-jobDefinition">
              <template v-slot:label>
                Job Definition
                <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="input-jobDefinition"
                v-model="form.jobDefinition"
                type="text"
                placeholder="Job name/type"
                :state="$v.form.jobDefinition.$dirty ? !$v.form.jobDefinition.$error : null"
              ></b-form-input>

              <b-form-text
                id="input-jobDefinition-help"
              >Job description of the employee i.e. Software Developer/Accountant</b-form-text>

              <b-form-invalid-feedback id="input-jobDefinition-invalid">
                  Please enter valid job definition
                </b-form-invalid-feedback>
            </b-form-group>

            <!-- Employee Role -->
            <b-form-group id="group-role" label-for="input-role">
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
import _, {
    reduce,
    pick,
    capitalize,
    some
} from "lodash";
import moment from "moment";
import permissionService from "@/services/permissionService";
import { validateDateTime } from "@/utils/helpers";
import configService from "@/services/configService";

export default {
  name: "UserFormBox",
  props: {
    listUrl: String,
    formType: String,
    userId: {
      type: [String, Number],
      required: false
    },
    permissions: {
      type: Array,
      required: false
    }
  },
  metaInfo() {
    return {
      title: "Employees",
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
        gender: null,
        rank: null,
        jobDefinition: null
      },
      dateTimeFormat: configService.get("format").pickerDateTime,
      staffRoles: reduce(
        pick(permissionService.userRoles, ["superadmin", "admin", "staff"]),
        (result, value, key) => {
          result.push({ value, text: capitalize(key) });
          return result;
        },
        []
      ),
      userGender: [
          {value: 'male', text: 'Male'}, 
          {value: 'female', text: 'Female'}
        ],
      userRank:  [
          {value: 'junior', text: 'Junior'}, 
          {value: 'mid', text: 'Mid'},
          {value: 'senior', text: 'Senior'}, 
          {value: 'executive', text: 'Executive'},
        ]
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
          return some(permissionService.userRoles, role => value === role);
        }
      },
      gender: {
          required
      },
      rank: {
          required
      },
      jobDefinition: {
          required
      }
    };
    return { form: formValidation };
  },
  mounted() {
    this.$nextTick(async () => {
      // Code that will run only after the entire view has been re-rendered
      if (this.formType === "new") {
        this.form.role = permissionService.userRoles.staff;
        this.form.gender = 'female',
        this.form.rank = 'mid',
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
        jobDefinition: this.form.jobDefinition,
        gender: this.form.gender,
        rank: this.form.rank,
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
    user(newValue, _oldValue) {
      if (!newValue.id) {
        return;
      }

      // Loaded user, assign to form
      this.form.name = newValue.name;
      this.form.email = newValue.email;
      this.form.jobDefinition = newValue.jobDefinition;
      this.form.role = newValue.role;
      this.form.gender = newValue.gender;
      this.form.rank = newValue.rank;

      this.formLoaded = true;
      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    }
  }
};
</script>