<template>
  <div class="p-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>User</h4>
            <button class="btn btn-sm btn-primary" @click="create">
              Tambah User
            </button>
            <hr />

            <div v-if="emptyProducts" class="alert alert-info">
              Belum ada user
            </div>
            <table v-else class="table table-striped table-bordered mt-4">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Nama</th>
                  <th scope="col">Email</th>
                  <th class="text-center" scope="col">Role</th>
                  <th class="text-center" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in users" :key="index">
                  <td>{{ data.name }}</td>
                  <td>{{ data.email }}</td>
                  <td class="text-center">
                    <span v-if="data.is_admin" class="badge bg-light text-dark"
                      >Admin</span
                    >
                    <span v-else class="badge bg-dark">User</span>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-primary mx-1"
                      @click="update(data.id)"
                    >
                      Update
                    </button>
                    <button
                      class="btn btn-sm btn-danger mx-1"
                      @click="destroy(data.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal
    v-model:visible="showModal"
    :title="user.id ? 'Update User' : 'Tambah User'"
    type="clean"
  >
    <div class="card text-center">
      <div class="card-header">
        <h4>{{ user.id ? "Update User" : "Tambah User" }}</h4>
      </div>
      <div class="card-body">
        <div class="form-group mb-3">
          <label class="mb-1" for="role">Role</label>
          <select
            class="form-control"
            id="role"
            v-model="user.role"
            placeholder="Role"
          >
            <option value="admin" :selected="user.is_admin">Admin</option>
            <option value="user" :selected="!user.is_admin">User</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label class="mb-1" for="name">Nama</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="user.name"
            placeholder="Nama"
          />
          <div v-if="validation.name" class="alert alert-danger mt-2">
            {{ validation.name }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="mb-1" for="email">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="user.email"
            placeholder="Email"
          />
          <div v-if="validation.email" class="alert alert-danger mt-2">
            {{ validation.email }}
          </div>
        </div>
        <div v-if="!user.id" class="form-group mb-3">
          <label class="mb-1" for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="user.password"
            placeholder="Password"
          />
          <div v-if="validation.password" class="alert alert-danger mt-2">
            {{ validation.password }}
          </div>
        </div>
        <div v-if="!user.id" class="form-group mb-3">
          <label class="mb-1" for="password_confirmation"
            >Konfirmasi Password</label
          >
          <input
            type="password"
            class="form-control"
            id="password_confirmation"
            v-model="user.password_confirmation"
            placeholder="Konfirmasi Password"
          />
          <div
            v-if="validation.password_confirmation"
            class="alert alert-danger mt-2"
          >
            {{ validation.password_confirmation }}
          </div>
        </div>
      </div>
      <div class="card-footer text-muted">
        <button
          class="btn btn-primary"
          @click="user.id ? updateStore(user.id) : store()"
        >
          Simpan
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import axios from "@/httpAxios.js";
import { Modal } from "usemodal-vue3";

export default {
  components: {
    Modal,
  },
  setup() {
    const user = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
      is_admin: false,
    });
    const validation = ref([]);
    let users = ref([]);
    let showModal = ref(false);
    let emptyProducts = ref(false);

    //mounted
    onMounted(() => {
      //get API from Laravel Backend
      axios
        .get("/users")
        .then((response) => {
          //assign state users with response data
          users.value = response.data.data;
          if (response.data.data.length == 0) {
            emptyProducts.value = true;
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    //return
    return {
      users,
      emptyProducts,
      showModal,
      user,
      validation,
    };
  },

  methods: {
    create() {
      this.user = {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "admin",
      };
      this.validation = [];
      this.showModal = true;
    },

    store() {
      axios
        .post("/register", this.user)
        .then(() => {
          this.showModal = false;
          window.location.reload();
        })
        .catch((error) => {
          this.validation = error.response.data;
        });
    },

    update(id) {
      axios
        .get("/users/" + id)
        .then((response) => {
          this.user = response.data.data;
          this.user.role = this.user.is_admin ? "admin" : "user";
          this.validation = [];
          this.showModal = true;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    updateStore(id) {
      axios
        .put("/users/" + id, this.user)
        .then(() => {
          this.showModal = false;
          window.location.reload();
        })
        .catch((error) => {
          this.validation = error.response.data;
        });
    },

    destroy(id) {
      axios
        .delete("/users/" + id)
        .then((response) => {
          console.log(response);
          this.$router.go();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
};
</script>