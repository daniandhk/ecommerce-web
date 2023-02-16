<template>
  <div class="container-fluid mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div v-if="loginFailed" class="alert alert-danger">
          Email atau Password Anda salah.
        </div>
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>LOGIN</h4>
            <hr />
            <form @submit.prevent="login">
              <div class="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  v-model="user.email"
                  class="form-control"
                  placeholder="Email Address"
                />
              </div>
              <div v-if="validation.email" class="mt-2 alert alert-danger">
                {{ validation.email[0] }}
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  v-model="user.password"
                  class="form-control"
                  placeholder="Password"
                />
              </div>
              <div v-if="validation.password" class="mt-2 alert alert-danger">
                {{ validation.password[0] }}
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
// import { useRouter } from "vue-router";
import axios from "@/httpAxios.js";

export default {
  setup() {
    //inisialisasi vue router on Composition API
    // const router = useRouter();

    //state user
    const user = reactive({
      email: "",
      password: "",
    });

    //state validation
    const validation = ref([]);

    //state loginFailed
    const loginFailed = ref(null);

    //method login
    function login() {
      //define variable
      let email = user.email;
      let password = user.password;
      let wait = false;

      //send server with axios
      axios
        .post("/login", {
          email,
          password,
        })
        .then((response) => {
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data));
            localStorage.setItem("role", response.data.role);

            wait = true;
            if (response.data.role == "admin") {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/";
            }
          }
          if (!wait) {
            loginFailed.value = true;
          }
        })
        .catch((error) => {
          validation.value = error.response.data;
        });
    }

    return {
      user, // <-- state user
      validation, // <-- state validation
      loginFailed, // <-- state loggedIn
      login, // <-- method login
    };
  },
};
</script>