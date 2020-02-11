<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">
      <b-navbar-brand :to="{ path: '/' }">
        <img src="../assets/logo.png" width="25" />
        App
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="isLoggedIn() === true">
          <b-nav-item :to="{ path: '/' }" data-cy="nav-bar-dashboard">
            <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="mr-1" />Dashboard
          </b-nav-item>
          <b-nav-item :to="{ path: '/performance-review/feedback/pending' }" data-cy="nav-bar-todo">
            <font-awesome-icon :icon="['fas', 'list-alt']" class="mr-1" />
            Reviews Feedback
          </b-nav-item>
          <b-nav-item
            :to="{ path: '/employees' }"
            v-if="showNavigation('manageUser')"
            data-cy="nav-bar-user"
          >
            <font-awesome-icon :icon="['fas', 'portrait']" class="mr-1" />Staff
          </b-nav-item>
          <b-nav-item
            :to="{ path: '/performance-reviews' }"
            v-if="showNavigation('manageReviews')"
            data-cy="nav-bar-staff"
          >
            <font-awesome-icon :icon="['fas', 'clipboard-list']" class="mr-1" />
            Performance Reviews
          </b-nav-item>
          <!-- <b-nav-item-dropdown
            right
            v-if="showNavigation('manageSetting')"
            data-cy="nav-bar-manage-setting"
          >
            <template v-slot:button-content>
              <font-awesome-icon :icon="['fas', 'cog']" class="mr-1" />Settings
            </template>
            <b-dropdown-item
              :to="{ path: '/setting' }"
              v-if="showNavigation('manageSetting')"
              data-cy="nav-bar-general-settings"
            >General Settings</b-dropdown-item>
          </b-nav-item-dropdown> -->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="isLoggedIn() === false">
          <b-nav-item 
            :to="{ path: '/login' }" 
            data-cy="nav-bar-login" 
            link-classes="btn btn-info text-light mx-1"
            >Login</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-if="isLoggedIn() === true">
          <b-nav-item
            v-if="user"
            data-cy="nav-bar-welcome-text"
          >Welcome, {{ user.name.split(' ')[0] }}</b-nav-item>

          <b-nav-item
            :to="{ path: '/logout' }"
            link-classes="btn btn-grey mx-1"
            data-cy="nav-bar-logout"
          >
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-1" />
            Logout
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapGetters } from "vuex";
import permissionService from "@/services/permissionService";
export default {
  name: "NavBar",
  computed: {
    ...mapState("auth", ["user"]),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    showNavigation(permissionKey) {
      if (!this.user) return false;
      switch (this.user.role) {
        case 'superadmin':
          return true;
        case 'admin':
          return true;
        default:
          return _.includes(this.user.permission_keys, permissionKey)
      }
    }
  }
};
</script>