<template>
  <div class="page-class page-user-list my-5">
    <h1 class="page-title">{{ title }}</h1>

    <table-box
      :fields="fields"
      :items="users"
      :loading="loading"
      :pagination="pagination"
      :baseUrl="baseUrl"
      emptyText="No employee record found. Please add new employee."
      :showAdd="true"
      addText="Create new employee"
      @add="onAdd"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TableBox from "@/components/TableBox.vue";
import router from "@/router";

export default {
  name: "EmployeeList",
  components: {
    TableBox
  },
  metaInfo() {
    return {
      title: "Employees",
      meta: [
        {
          name: "List of employees",
          content: `Manage employee list`
        }
      ]
    };
  },
  mounted() {
    this.list({ type: "employees", query: this.$route.query });
  },
  data() {
    return {
      title: "Employees",
      fields: [
        { key: "rowNum", label: "#" },
        { key: "name", label: "Full name" },
        "email",
        { key: "enabledName", label: "Status" },
        "role",
        "actions"
      ]
    };
  },
  computed: {
    ...mapState("user", ["loading", "baseUrl", "users", "pagination"])
  },
  methods: {
    ...mapActions("user", ["list", "deleteOne"]),
    onAdd() {
      router.push("/employee/new");
    },
    onEdit({ row }) {
      router.push(`/employee/${row.item.id}`);
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
            type: "user",
            userId: row.id
          });
        }
      });
    }
  }
};
</script>