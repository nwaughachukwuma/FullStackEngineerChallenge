<template>
  <b-container class="page-login my-3 px-auto">
    <div v-if="loading || !formLoaded">
      <span class="spinner"></span>
    </div>
    <div v-if="!loading && formLoaded">
      <b-card-group deck class="mt-3 mx-5">
        <b-card class="px-5">
          <h1>{{formType === "new"? 'Create': 'Update'}}</h1>
          <p class="text-muted">Performance review</p>

           <!-- Employee -->
          <b-form @submit.stop.prevent="onSubmit">
            <b-form-group id="group-employee" label-for="input-employee" v-if="formType === 'new'">
              <template v-slot:label>
                Select Employee
                <span class="text-danger">*</span>
              </template>

              <b-form-select
                id="input-employee"
                v-model="form.employee"
                :options="employees"
                :state="$v.form.employee.$dirty ? !$v.form.employee.$error : null"
              ></b-form-select>

              <b-form-invalid-feedback id="input-employee-invalid">Please enter your first name.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="group-employee" label-for="input-employee" v-else>
              <template v-slot:label>
                Select Employee
                <span class="text-danger">*</span>
              </template>

              <b-form-input
                id="input-employee"
                v-model="form.employeeName"
                :disabled="true"
                type="text"
              ></b-form-input>
            </b-form-group>

            <!-- Period -->
            <b-form-group id="group-period" label-for="input-period" v-if="formType==='new'">
              <template v-slot:label>
                Review Period (Y-M-D)
              </template>

              <datetime
                type="date"
                v-model="form.period"
                input-id="input-period"
                :input-class="{
                  'form-control': true,
                  'is-invalid': $v.form.period.$dirty ? $v.form.period.$error : null,
                  'is-valid': $v.form.period.$dirty ? !$v.form.period.$error : null
                }"
                class="input-group"
                placeholder="Select review period"
                :format="dateTimeFormat"
                :phrases="{ ok: 'OK', cancel: 'Cancel' }"
                :week-start="7"
                :use12-hour="false"
                auto
              >
                <template slot="after">
                  <div class="input-group-append">
                    <b-button size="sm" variant="secondary" @click="form.period = ''">Clear</b-button>
                  </div>
                </template>
              </datetime>

              <b-form-text id="input-period-help">
                The period for which the employee is being reviewed. The value must be valid format - Month-Year. i.e. January-2020
              </b-form-text>

              <div
                class="invalid-feedback"
                id="input-period-invalid"
                v-if="$v.form.period.$dirty ? $v.form.period.$error : false"
                >Please select valid date.</div
              >
            </b-form-group>

            <b-form-group id="group-period" label-for="input-period" v-else>
              <template v-slot:label>
                Review Period (Y-M-D)
                <span class="text-danger">*</span>
              </template>

              <b-form-input
                id="input-period"
                v-model="form.period"
                :disabled="true"
                type="text"
              ></b-form-input>
            </b-form-group>

            <!-- Evaluation -->
            <b-form-group id="group-evaluation" label-for="input-evaluation">
              <template v-slot:label>
                Evaluation
                <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="input-evaluation"
                v-model="form.evaluation"
                type="number"
                max="100"
                min="40"
                placeholder="Performance score"
                :state="$v.form.evaluation.$dirty ? !$v.form.evaluation.$error : null"
              ></b-form-input>

              <b-form-text
                id="input-evaluation-help"
              >Score to indicate how well/poor the employee performed</b-form-text>

              <b-form-invalid-feedback id="input-evaluation-invalid">
                  Please enter valid number within range 40-100
                </b-form-invalid-feedback>
            </b-form-group>

            <!-- Remark -->
            <b-form-group id="group-remark" label-for="input-remark">
              <template v-slot:label>
                Remark
                <span class="text-danger">*</span>
              </template>

              <b-form-textarea
                id="input-remark"
                v-model="form.remark"
                type="text"
                placeholder="Performed in..."
                rows="3"
                max-rows="6"
                :state="$v.form.remark.$dirty ? !$v.form.remark.$error : null"
              ></b-form-textarea>

              <b-form-text
                id="input-remark-help"
              >Text description of employee's performance</b-form-text>

              <b-form-invalid-feedback id="input-remark-invalid">
                  Please enter valid remark.
                </b-form-invalid-feedback>
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
import {
    reduce,
    capitalize,
} from "lodash";
// import moment from "moment";
import { validateDateTime } from "@/utils/helpers";
import configService from "@/services/configService";
import {months} from '@/utils/constants'

export default {
  name: "PerformanceReviewBox",
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
        employee: null,
        period: null,
        evaluation: null,
        remark: '',
        employeeName: null
      },
      dateTimeFormat: configService.get("format").pickerYearMonth,
      employees: []
    };
  },
  validations() {
    const formValidation = {
      employee: {
        required,
        minLength: minLength(5),
        isUnique: (value) => {
          return value !== null
        }
      },
      period: {
          validateDateTime: validateDateTime
      },
      evaluation: {
        required,
        between: between(40, 100),
      },
      remark: {
        minLength: minLength(10),
        maxLength: maxLength(300)
      },
    };
    return { form: formValidation };
  },
  mounted() {
    this.$nextTick(async () => {
      // Code that will run only after the entire view has been re-rendered
      this.employees = reduce(this.users, (result, value) => {
          result.push({ value: value.id, text: capitalize(value.name) });
          return result
      }, []);

      this.employees.unshift({ value: null, text: 'Please select an employee' })
      this.form.employee =  null;

      if (this.formType === "new") {
        this.form.evaluation = 40,
        this.form.remark = '',
        this.formLoaded = true;
        this.$v.$touch(); // Set initial validation
        this.$v.$reset(); // Reset $dirty
      }
    });
  },
  computed: {
    metaDescription() {
      return this.formType === "new" ? "Add performance review" : "Update performance review";
    },
    ...mapGetters("alert", ["errorMessages"]),
    ...mapState("user", ["loading", "user", "users"]),
    ...mapState("performance_review", ["performance_review"])
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.formType === 'new' && this.$v.$invalid) {
        return false;
      }
      const period = this.form.period.split('-');

      // eslint-disable-next-line
      const performance_review = {
        employeeId: this.formType === 'new'
          ? this.form.employee
          : this.performance_review.id,
        month: this.formType === 'new'? months[period[1]]: period[0],
        year: this.formType === 'new'? period[0]: period[1],
        evaluation: this.form.evaluation,
        remark: this.form.remark
      };
      if (this.formType === "new") {
        this.$emit("add", { performance_review });
      } else {
        this.$emit("edit", { performance_review });
      }
      return false;
    }
  },
  watch: {
    performance_review(newValue) {
      if (!newValue.id) {
        return;
      }
      // Loaded user, assign to form
      this.form.employee = newValue.employeeId;
      this.form.period = [newValue.month, newValue.year].join('-');
      this.form.remark = newValue.remark;
      this.form.evaluation = newValue.evaluation;
      this.form.employeeName = newValue.name
      // newValue.year + '-' + Object.entries(months)
      //   .find(el => el[1] === newValue.month)[0]
      this.formLoaded = true;
      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    }
  }
};
</script>