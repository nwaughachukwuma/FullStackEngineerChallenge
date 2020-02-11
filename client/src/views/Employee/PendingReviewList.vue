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
          <label class="title align-self-center">Performance review feedback</label>
        </span>
      </template>
      <div class="d-block text-center">
        <b-form @submit.stop.prevent="onSubmit">
          <b-form-group id="group-feedback" label-for="input-feedback">
            <template v-slot:label>
              {{getStaffName(rowItem.performance_review.employeeId)}}: 
              (
                {{rowItem.performance_review.month}} - 
                {{rowItem.performance_review.year}} 
              )
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

          <template v-if="errorMessages">
            <b-row class="mb-2">
              <b-col class="text-danger message-col">{{ errorMessages }}</b-col>
            </b-row>
          </template>

          <b-row>
            <b-col>
              <b-button
                type="submit"
                size="sm"
                variant="primary"
                class="mt-3"
                block
                :disabled="loading"
              >
                <span class="spinner spinner-white" v-if="loading"></span>
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="mr-1" />Submit
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
import { mapState, mapActions, mapGetters } from "vuex";
import TableBox from "@/components/PendingFeedbackTableBox.vue";
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
        "period",
        { key: "evaluation", label: "Evaluation" },
        "remark",
        { key: "feedback", label: "My Feeback" },
        "actions"
      ],
      form: {
        feedback: null
      },
      rowItem: {}
    };
  },
  validations() {
    const formValidation = {
      feedback: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(150),
        validateFeedback: value => {
          return value !== null;
        }
      }
    };
    return { form: formValidation };
  },
  computed: {
    ...mapGetters("alert", ["errorMessages"]),
    ...mapState("performance_review", ["pagination"]),
    ...mapState("pr_feedback", ["pending_reviews", "baseUrl", "loading"]),
    ...mapState("auth", ["user"]),
    ...mapState("user", ["users"])
  },
  methods: {
    ...mapActions("performance_review", ["list"]),
    ...mapActions("user", { userList: "list" }),
    ...mapActions("pr_feedback", {
      pendingList: "getPending",
      postFeedback: "postOne"
    }),
    onAdd() {
      router.push("/performance-review/new");
    },
    onFeedback({ row }) {
      console.log("row data is", row.item);
      this.rowItem = row.item;
      this.$bvModal.show("bv-modal-example");
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }
      const feedback_data = {
        performanceReviewId: this.rowItem.performanceReviewId,
        peerId: this.rowItem.peerId,
        feedback: this.form.feedback
      };

      this.postFeedback({
        type: "give-feedback",
        feedback: feedback_data,
        reviewId: this.rowItem.id,
        router
      });

      this.form.feedback = "";
      this.$bvModal.hide("bv-modal-example");
    },
    getStaffName(employeeId) {
      const employeeName = this.users.find(el => el.id === employeeId).name;
      return employeeName;
    }
  },
  watch: {
    // pending_reviews(newVal) {
    //   console.log("pending feedback", newVal);
    // },
    errorMessages(newVal) {
      if (newVal) {
        this.$swal({
          type: "error",
          // toast: true,
          title: newVal,
          // position: 'bottom-right',
          // background: '#000',
          timer: 3000,
          timerProgressBar: true
        });
      }
    }
  }
};
</script>