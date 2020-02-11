<template>
  <div class="page-class page-user-list my-5">
    <h1 class="page-title">{{ title }}</h1>
    <h1 class="page-subtitle">All the performance reviews assigned to you</h1>

    <table-box
      :fields="fields"
      :items="all_reviews"
      :loading="loading"
      :pagination="pagination"
      :baseUrl="baseUrl+'/pending'"
      emptyText="No assigned reviews. You should get one soon as we value your opinion ✌️"
      :showAdd="false"
      addText=""
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import TableBox from "@/components/AssignedFeedbackTableBox.vue";
import router from "@/router";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "PendingFeedbackList",
  components: {
    TableBox
  },
  metaInfo() {
    return {
      title: "Assigned Reviews",
      meta: [
        {
          name: "List of all reviews assigned",
          content: `Manage employee performance reviews feedback`
        }
      ]
    };
  },
  mounted() {
    this.list({ type: "perf-reviews", query: this.$route.query });
    this.userList({ type: "employees", query: this.$route.query });
    this.assignedList({
      type: "assigned-reviews",
      employeeId: this.user.id,
      query: this.$route.query
    });
  },
  data() {
    return {
      title: "Assigned Reviews",
      fields: [
        { key: "rowNum", label: "#" },
        { key: "name", label: "Staff name" },
        "period",
        { key: "evaluation", label: "Evaluation" },
        "remark",
        { key: "feedback", label: "My Feeback" }
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
    ...mapState("performance_review", ["pagination"]),
    ...mapState("pr_feedback", ["all_reviews", "baseUrl", "loading"]),
    ...mapState("auth", ["user"]),
  },
  methods: {
    ...mapActions("performance_review", ["list"]),
    ...mapActions("user", { userList: "list" }),
    ...mapActions("pr_feedback", {
      assignedList: "list",
      pendingList: "getPending",
      postFeedback: "postOne"
    })
  }
};
</script>