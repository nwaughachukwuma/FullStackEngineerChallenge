<template>
  <div class="page-class page-staff-form my-5">
    <h1 class="page-title">{{ title }}</h1>
    <h1 class="page-subtitle">{{ employeeData.name }} ({{employeeData.email}})</h1>
    <b-table striped hover :items="prData" :fields="fields" >
        <template v-slot:cell(period)="data">
            <label>{{ data.item.month }}, {{ data.item.year }}</label>
        </template>
    </b-table>
    <reviewer-box
      list-url="/performance-reviews"
      :form-type="formType"
      :pr-id="prId"
      :permissions="permissions"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ReviewerBox from '@/components/ReviewerBox.vue';
import router from '@/router';

export default {
  name: 'PerformanceReviewDetails',
  components: {
    ReviewerBox
  },
  async mounted() {
    this.permissionList({ router });
    this.formType = 'new';
    this.prId = this.$route.params.id;
    await this.getOne({
        type: 'perf-reviews',
        prId: this.prId,
        router
    });
  },
  data() {
    return {
      formType: '',
      prId: null,
      prData: [],
      employeeData: {},
      fields: [
          'remark',
          'evaluation',
          'period',
          'isReviewed'
      ]
    };
  },
  computed: {
    title() {
      return 'Performance review details';
    },
    ...mapState('performance_review', ['loading', 'performance_review']),
    ...mapState('permission', ['permissions'])
  },
  methods: {
    ...mapActions('performance_review', ['getOne', 'postOne', 'patchOne']),
    ...mapActions('permission', {
      permissionList: 'list'
    }),
    onAdd({ performance_review }) {
      this.postOne({
        type: 'create-perf-review',
        performance_review,
        router,
        redirectUrl: '/performance-reviews'
      });
    },
    onEdit({ performance_review }) {
      this.patchOne({
        type: 'perf-reviews',
        prId: this.prId,
        performance_review,
        router,
        redirectUrl: '/performance-reviews'
      });
    }
  },
  watch: {
      performance_review: {
          handler(newVal) {
              if (newVal) {
                this.prData.pop()
                this.prData.push(newVal);

                this.employeeData = newVal
              }
          },
          immediate: false
      }
  }
};
</script>