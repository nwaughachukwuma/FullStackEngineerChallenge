<template>
  <div class="page-class page-user-list my-5">
    <h1 class="page-title">{{ title }}</h1>
    <h1 class="page-subtitle">With pending feedback</h1>

    <table-box
      :fields="fields"
      :items="pending_reviews"
      :loading="loading"
      :pagination="pagination"
      :baseUrl="baseUrl+'/pending'"
      emptyText="No reviews with pending feedback."
      :showAdd="false"
      addText
      @add="onAdd"
      @feedback="onFeedback"
    />

    <b-modal id="bv-modal-example" hide-footer>
      <template v-slot:modal-title>
        <span class="d-block text-center">
          <label class="title align-self-center">Give feedback</label>
        </span>
      </template>
      <div class="d-block text-center">
        <b-form @submit.stop.prevent="onSubmitFeedback">
          <b-form-group id="group-feedback" label-for="input-feedback">
            <template v-slot:label>
              Feedback message
              <span class="text-danger">*</span>
            </template>

            <b-form-textarea
              id="input-feedback"
              v-model="form.feedback"
              :state="$v.form.feedback.$dirty ? !$v.form.feedback.$error : null"
              placeholder="write here..."
            ></b-form-textarea>

            <b-form-invalid-feedback id="input-feedback-invalid">Please enter your feedback</b-form-invalid-feedback>
          </b-form-group>

          <b-row>
            <b-col>
              <b-button type="submit" size="sm" variant="primary" class="mt-3" block :disabled="loading">
                <span class="spinner spinner-white" v-if="loading"></span>
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="mr-1" />
                Submit
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TableBox from "@/components/FeedbackTableBox.vue";
import router from "@/router";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "PendingFeedbackList",
  components: {
    TableBox
  },
  metaInfo() {
    return {
      title: "Pending Feedback",
      meta: [
        {
          name: "List of performance reviews feedback",
          content: `Manage employee performance reviews feedback`
        }
      ]
    };
  },
  mounted() {
    this.list({ type: "perf-reviews", query: this.$route.query });
    this.userList({ type: "employees", query: this.$route.query });
    this.pendingList({
      type: "pending-reviews",
      employeeId: this.user.id,
      query: this.$route.query
    });
  },
  data() {
    return {
      title: "Reviews",
      fields: [
        { key: "rowNum", label: "#" },
        { key: "name", label: "Staff name" },
        // { key: "email", label: "Staff email" },
        "period",
        { key: "evaluation", label: "Evaluation" },
        "remark",
        { key: "feedback", label: "My Feeback" },
        "actions"
      ],
      form: {
        feedback: null
      }
    };
  },
  validations() {
    const formValidation = {
      feedback: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(150),
        validateFeedback: value => {
          return value !== null
        }
      }
    };
    return { form: formValidation };
  },
  computed: {
    ...mapState("performance_review", [
      "pagination"
    ]),
    ...mapState("pr_feedback", ["pending_reviews", "baseUrl", "loading"]),
    ...mapState("auth", ["user"])
  },
  methods: {
    ...mapActions("performance_review", ["list", "deleteOne"]),
    ...mapActions("user", { userList: "list" }),
    ...mapActions("pr_feedback", { pendingList: "getPending" }),
    onAdd() {
      router.push("/performance-review/new");
    },
    onFeedback({ row }) {
      console.log("row data is", row.item);
      this.$bvModal.show("bv-modal-example");
      // this.$swal({
      //     toast: true,
      //     title: 'Show feedback modal',
      //     position: 'bottom-left',
      //     background: '#000',
      //     timer: 3000,
      //       timerProgressBar: true,
      // });
      //router.push(`/performance-review/${row.item.id}`);
    },
    onSubmitFeedback(evt) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }
      console.log("submit feedback", evt);
      this.$bvModal.hide("bv-modal-example");
      this.form.feedback = ''
    }
  },
  watch: {
    pending_reviews(newVal) {
      console.log("pending feedback", newVal);
    }
  }
};
</script>