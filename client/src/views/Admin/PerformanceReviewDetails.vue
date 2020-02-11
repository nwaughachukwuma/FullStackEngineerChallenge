<template>
  <div class="page-class page-staff-form my-5">
    <h1 class="page-title">{{ title }}</h1>
    <h1 class="page-subtitle">{{ employeeData.name }} ({{employeeData.email}})</h1>
    <b-table striped hover :items="prData" :fields="fields" >
        <template v-slot:cell(period)="data">
            <label>{{ data.item.month }}, {{ data.item.year }}</label>
        </template>
    </b-table>
    <b-row class="justify-content-center">
        <b-col xs="12" sm="6" md="4" lg="4" v-for="(reviewer, key) in reviewers" :key="key">
            <b-card 
                :title="'Review - ' + (key+1)" 
                :sub-title="reviewer.name">
                <b-card-text>
                    {{reviewer.jobDefinition || 'No Job Definition'}}
                </b-card-text>

                <b-card-text>{{reviewer.feedback || 'No feedback given'}}</b-card-text>

                <pre class="text-primary">{{reviewer.rank}} Staff</pre>
            </b-card>
        </b-col>
    </b-row>
    <reviewer-box
      list-url="/performance-reviews"
      :pr-id="prId"
      @add="onAdd"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import ReviewerBox from '@/components/ReviewerBox.vue';
import router from '@/router';

export default {
  name: 'PerformanceReviewDetails',
  components: {
    ReviewerBox
  },
  async mounted() {
    this.prId = this.$route.params.id;
    await this.getOne({
        type: 'perf-reviews',
        prId: this.prId,
        router
    });
    await this.userList({ type: "employees", query: this.$route.query });
  },
  data() {
    return {
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
    ...mapState('user', ['users']),
    ...mapGetters('performance_review', ['reviewers']),
  },
  methods: {
    ...mapActions('performance_review', ['getOne', 'postOneReviewer']),
    ...mapActions("user", {userList: 'list'}),
    onAdd({ reviewer }) {
      this.postOneReviewer({
        type: 'create-reviewer',
        reviewer,
        router,
        redirectUrl: ''
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
      },
      users(newVal) {
          if (newVal) {
              console.log('users >>>', newVal)
          }
      },
  }
};
</script>