<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
    <router-link :to="{ name: 'home' }" class="navbar-brand"
      >E-Commerce</router-link
    >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div v-if="!role" class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link :to="{ name: 'login' }" class="nav-link"
            >Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'register' }" class="nav-link"
            >Register</router-link
          >
        </li>
      </ul>
    </div>
    <div v-else class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li v-if="role == 'admin'" class="nav-item">
          <router-link :to="{ name: 'dashboard' }" class="nav-link"
            >Pesanan</router-link
          >
        </li>
        <li v-if="role == 'user'" class="nav-item">
          <router-link :to="{ name: 'history' }" class="nav-link"
            >Pesanan Anda</router-link
          >
        </li>
        <!-- <li v-if="role == 'user' " class="nav-item">
          <router-link :to="{ name: 'dashboard' }" class="nav-link"
            >Dashboard</router-link
          >
        </li> -->
        <li
          @click.prevent="logout"
          class="nav-item nav-link"
          style="cursor: pointer"
        >
          Logout
        </li>
      </ul>
    </div>
  </nav>
  <router-view />
</template>

<script>
// import { useRouter } from "vue-router";
import axios from "@/httpAxios.js";

export default {
  setup() {
    // const router = useRouter();
    function logout() {
      axios
        .post("/logout")
        .then((response) => {
          if (response.data.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }

    return {
      logout,
    };
  },

  data() {
    return {
      role: null,
    };
  },

  mounted() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      this.role = role;
    }
  },
};
</script>

<style>
body {
  background: lightgray !important;
}
</style>