<template>
    <div>
        <div class="table-top-wrapper">
            <div v-if="totalCount" class="row-total-count">
                <span>Total Count:</span>
                {{ totalCount }}
            </div>
        </div>
        <b-table :items="items" :fields="fields" striped responsive="sm">
            <template v-slot:cell(name)="data">
                <b-link :to="{ path: `/performance-review/details/${data.item.id}` }">
                    <b style="marginRight: 10px">{{ data.value.toUpperCase() }}</b>
                    <font-awesome-icon :icon="['fas', 'external-link-alt']" class="mr-1" />
                </b-link>
            </template>
            
            <template v-slot:cell(email)="data">
                <label class="text-primary">{{ data.value }}</label>
            </template>

            <template v-slot:cell()="data">
                <label>{{ data.value }}</label>
            </template>

            <template v-slot:cell(name)="data">
                <label>{{ getStaffName(data.item.performance_review.employeeId) || "None" }}</label>
            </template>

            <template v-slot:cell(feedback)="data">
                <label>{{ data.value || "None" }}</label>
            </template>

            <template v-slot:cell(remark)="data">
                <label>{{ data.item.performance_review.remark }}</label>
            </template>

            <template v-slot:cell(evaluation)="data">
                <label>{{ data.item.performance_review.evaluation }}</label>
            </template>

            <template v-slot:cell(period)="data">
                <label>{{ data.item.performance_review.month }}, {{ data.item.performance_review.year }}</label>
            </template>

            <template v-slot:cell(actions)="row">
                <b-button-group size="sm">
                    <b-button size="sm" variant="secondary" @click="clickEdit(row)">
                        <font-awesome-icon :icon="['fas', 'edit']" class="mr-1" />
                        Give Feedback
                    </b-button>
                </b-button-group>
            </template>
            
        </b-table>
        <b-row class="mt-2 mx-2">
            <div v-if="!loading && items.length === 0" class="table-row table-row-empty">
                <div class="table-column table-column-full text-center">{{ emptyText }}</div>
            </div>
            <div v-if="loading" class="table-row table-row-empty">
                <div class="table-column table-column-full text-center">
                <span class="spinner spinner-white"></span>
                </div>
            </div>
        </b-row>
        <b-row class="table-bottom-wrapper mt-2 mx-0">
            <b-col :cols="6" class="px-0">
                <b-link 
                    size="sm" 
                    variant="success" 
                    class="btn btn-primary" 
                    :to="{ path: '/performance-review/feedback/assigned' }"
                >
                    <font-awesome-icon :icon="['fas', 'arrow-right']" class="mr-1" />
                    See all assigned
                </b-link>
            </b-col>
            <b-col :cols="6" class="px-0" v-if="showAdd">
                <b-button size="sm" variant="success" @click="clickAdd">
                    <font-awesome-icon :icon="['fas', 'plus']" class="mr-1" />
                    {{ addText }}
                </b-button>
            </b-col>
            <b-col :cols="6" class="px-0 text-right">
                <b-pagination-nav
                    v-if="items.length"
                    :link-gen="linkGen"
                    :number-of-pages="totalNumberOfPage"
                    use-router
                    align="right"
                ></b-pagination-nav>
            </b-col>
        </b-row>
    </div>
</template>


<script>

import {mapState} from 'vuex'

export default {
    props: {
        fields: Array,
        items: Array,
        emptyText: String,
        pagination: Object,
        showAdd: Boolean,
        addText: String,
        loading: Boolean,
        baseUrl: String
    },
    name: 'TableBox',
    data() {
        return{
            employeeName: ''
        }
    },
    computed: {
        ...mapState("user", ['users']),
        totalNumberOfPage() {
            if (this.pagination.total_rows && this.pagination.page_size) {
                return Math.ceil(this.pagination.total_rows / this.pagination.page_size);
            }
            return 1;
        },
        totalCount() {
            return this.items.length;
        }
    },
    methods: {
        linkGen(pageNum) {
            return { path: this.baseUrl, query: { page: pageNum } };
        },
        getStaffName(employeeId) {
            const employeeName =  this.users.find(el => el.id === employeeId).name
            return employeeName
        },
        clickAdd() {
            this.$emit('add', {});
        },
        clickEdit(row) {
            this.$emit('feedback', { row  });
        },
        clickDelete(row) {
            this.$emit('delete', { row });
        }
    }
}
</script>

<style scoped>
    .table-row {
        display: flex;
        flex-flow: row wrap;
        border-left: solid 1px #d9d9d9;
        transition: 0.5s;
        margin-left: 0;
        margin-right: 0;
    }
    .table-top-wrapper {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        justify-content: left;
    }
</style>