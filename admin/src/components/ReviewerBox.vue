<template>
  <b-container class="page-login my-3 px-auto">
    <div v-if="loading || !formLoaded">
      <span class="spinner"></span>
    </div>
    <div v-if="!loading && formLoaded">
      <b-card-group deck class="mt-3 mx-5">
        <b-card class="px-5">
          <h1>Add Reviewer</h1>
          <p class="text-muted">to provide feedback</p>

          <!-- Employee -->
          <b-form @submit.stop.prevent="onSubmit">
            <b-form-group id="group-employee" label-for="input-employee">
              <template v-slot:label>
                Select Reviewer
                <span class="text-danger">*</span>
              </template>

              <b-form-select
                id="input-employee"
                v-model="form.employee"
                :options="employees"
                :state="$v.form.employee.$dirty ? !$v.form.employee.$error : null"
              ></b-form-select>

              <b-form-invalid-feedback
                id="input-employee-invalid"
              >Please enter select a valid employee.</b-form-invalid-feedback>
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
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
import { mapGetters, mapState } from "vuex";
import { reduce, capitalize } from "lodash";
// import moment from "moment";
import { validateDateTime } from "@/utils/helpers";
import configService from "@/services/configService";
import { months } from "@/utils/constants";

export default {
  name: "PerformanceReviewBox",
  props: {
    listUrl: String,
    prId: {
      type: [String, Number],
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
        employee: null
      },
      employees: []
    };
  },
  validations() {
    const formValidation = {
      employee: {
        required,
        minLength: minLength(5),
        isUnique: value => {
          return value !== null;
        }
      }
    };
    return { form: formValidation };
  },
  mounted() {
    this.$nextTick(async () => {
      // Code that will run only after the entire view has been re-rendered
      this.employees = reduce(
        this.users,
        (result, value) => {
          result.push({ value: value.id, text: capitalize(value.name) });
          return result;
        },
        []
      );

      this.employees.unshift({
        value: null,
        text: "Please select an employee"
      });
      this.form.employee = null;
      this.formLoaded = true;
      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    });
  },
  computed: {
    metaDescription() {
      return "Add Reviewer";
    },
    ...mapGetters("alert", ["errorMessages"]),
    ...mapState("user", ["loading", "user", "users"]),
    ...mapState("performance_review", ["performance_review"])
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }
      const reviewer = {
        performanceReviewId: this.prId,
        peerId: this.form.employee
      };
      this.$emit("add", { reviewer });
      return false;
    }
  },
  watch: {
    performance_review(newValue) {
      if (!newValue.id) {
        return;
      }
      // Loaded user, assign to form
      this.formLoaded = true;
      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    },
    users(newVal) {
        if (newVal) {
            this.employees = reduce(
                newVal,
                (result, value) => {
                    result.push({ value: value.id, text: capitalize(value.name) });
                    return result;
                },
                []
            );
            this.employees.unshift({
                value: null,
                text: "Please select an employee"
            });
            this.form.employee = null;
        }
    }
  }
};
</script>