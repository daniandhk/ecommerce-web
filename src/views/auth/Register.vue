<template>
  <div class="container-fluid mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>Register</h4>
            <hr />
            <form @submit.prevent="register">
              <div class="row gy-3 mb-3">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label class="mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      v-model="user.name"
                      class="form-control"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div v-if="validation.name" class="mt-2 alert alert-danger">
                    {{ validation.name[0] }}
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <label class="mb-1">Email address</label>
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
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <label class="mb-1">Password</label>
                    <input
                      type="password"
                      v-model="user.password"
                      class="form-control"
                      placeholder="Password"
                    />
                  </div>
                  <div
                    v-if="validation.password"
                    class="mt-2 alert alert-danger"
                  >
                    {{ validation.password[0] }}
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <label class="mb-1">Konfirmasi Password</label>
                    <input
                      type="password"
                      v-model="user.password_confirmation"
                      class="form-control"
                      placeholder="Konfirmasi Password"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                Register
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
import { useRouter } from "vue-router";
import axios from "@/httpAxios.js";

export default {
  setup() {
    const router = useRouter();
    const user = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    const validation = ref([]);

    function register() {
      //define variable
      let name = user.name;
      let email = user.email;
      let password = user.password;
      let password_confirmation = user.password_confirmation;

      //send server with axios
      axios
        .post("/register", {
          name,
          email,
          password,
          password_confirmation,
        })
        .then(() => {
          return router.push({
            name: "login",
          });
        })
        .catch((error) => {
          validation.value = error.response.data;
        });
    }

    return {
      user, // <-- state user
      validation, // <-- state validation
      register, // <-- method register
    };
  },
};
</script>