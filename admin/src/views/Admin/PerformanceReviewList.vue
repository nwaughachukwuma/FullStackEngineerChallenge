<template>
  <div class="page-class page-user-list my-5">
    <h1 class="page-title">{{ title }}</h1>

    <table-box
      :fields="fields"
      :items="performance_reviews"
      :loading="loading"
      :pagination="pagination"
      :baseUrl="baseUrl"
      emptyText="No performance review found. Please create one."
      :showAdd="true"
      addText="Create performance review"
      @add="onAdd"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TableBox from "@/components/PRTableBox.vue";
import router from "@/router";

export default {
  name: "PerformanceReviewList",
  components: {
    TableBox
  },
  metaInfo() {
    return {
      title: "Performance Reviews",
      meta: [
        {
          name: "List of performance reviews",
          content: `Manage employee performance reviews`
        }
      ]
    };
  },
  mounted() {
    this.list({ type: "perf-reviews", query: this.$route.query });
  },
  data() {
    return {
      title: "Performance Reviews",
      fields: [
        { key: "rowNum", label: "#" },
        { key: "name", label: "Staff name" },
        // { key: "email", label: "Staff email" },
        "period",
        { key: "evaluation", label: "Evaluation" },
        "remark",
        { key: "isReviewed", label: "Reviewed?" },
        "actions"
      ]
    };
  },
  computed: {
    ...mapState("performance_review", ["loading", "baseUrl", "performance_reviews", "pagination"])
  },
  methods: {
    ...mapActions("performance_review", ["list", "deleteOne"]),
    onAdd() {
      router.push("/performance-review/new");
    },
    onEdit({ row }) {
      router.push(`/performance-review/${row.item.id}`);
    },
    onDelete({ row }) {
      Vue.swal({
        title: "Are you sure?",
        text: "You won't be able to revert this.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        preConfirm: () => {
          this.deleteOne({
            type: "perf-reviews",
            userId: row.item.id
          });
        }
      });
    }
  }
};
</script>