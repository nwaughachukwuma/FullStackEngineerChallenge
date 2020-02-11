<template>
  <div class="page-class page-user-list my-5">
    <h1 class="page-title">{{ title }}</h1>
    <h1 class="page-subtitle">With pending feedback</h1>

    <table-box
      :fields="fields"
      :items="pending_reviews"
      :loading="loading"
      :pagination="pagination"
      :baseUrl="baseUrl"
      emptyText="No reviews with pending feedback."
      :showAdd="false"
      addText=""
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TableBox from "@/components/FeedbackTableBox.vue";
import router from "@/router";

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
    this.pendingList({ type: "pending-reviews", employeeId: this.user.id, query: this.$route.query})
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
      ]
    };
  },
  computed: {
    ...mapState("performance_review", ["loading", "baseUrl", "performance_reviews", "pagination"]),
    ...mapState("pr_feedback", ['pending_reviews']),
    ...mapState("auth", ['user'])
  },
  methods: {
    ...mapActions("performance_review", ["list", "deleteOne"]),
    ...mapActions("user", {userList:"list"}),
    ...mapActions("pr_feedback", {pendingList:"getPending"}),
    onAdd() {
      router.push("/performance-review/new");
    },
    onEdit({ row }) {
      router.push(`/performance-review/${row.item.id}`);
    },
  },
  watch: {
    pending_reviews(newVal) {
      console.log('pending feedback', newVal)
    }
  }
};
</script>