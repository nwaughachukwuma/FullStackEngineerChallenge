<template>
  <div class="page-class page-staff-form my-5">
    <h1 class="page-title">{{ title }}</h1>
    <performance-review-box
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
import PerformanceReviewBox from '@/components/PerformanceReviewBox.vue';
import router from '@/router';

export default {
  name: 'PerformanceReviewForm',
  components: {
    PerformanceReviewBox
  },
  async mounted() {
    this.permissionList({ router });
    if (this.$route.name === 'performance-review-new') {
      this.formType = 'new';
      this.prId = null;
    } else {
      this.formType = 'update';
      this.prId = this.$route.params.id;
      await this.getOne({
        type: 'perf-reviews',
        prId: this.prId,
        router
      });
    }
  },
  data() {
    return {
      formType: '',
      prId: null
    };
  },
  computed: {
    title() {
      return 'Performance review management';
    },
    ...mapState('performance_review', ['loading']),
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
  }
};
</script>