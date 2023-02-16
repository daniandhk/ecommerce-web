<template>
  <div class="p-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>Produk</h4>
            <button class="btn btn-sm btn-primary" @click="create">
              Tambah Produk
            </button>
            <hr />

            <div v-if="emptyProducts" class="alert alert-info">
              Belum ada produk
            </div>
            <table v-else class="table table-striped table-bordered mt-4">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Nama</th>
                  <th scope="col">Deskripsi</th>
                  <th scope="col">Harga</th>
                  <th class="text-center" scope="col">Stok</th>
                  <th class="text-center" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in products" :key="index">
                  <td>{{ product.name }}</td>
                  <td>{{ product.description }}</td>
                  <td>
                    Rp.
                    {{
                      product.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }}
                    / pcs
                  </td>
                  <td class="text-center">{{ product.quantity }} pcs</td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-primary mx-1"
                      @click="update(product.id)"
                    >
                      Update
                    </button>
                    <button
                      class="btn btn-sm btn-danger mx-1"
                      @click="destroy(product.id)"
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
    :title="product.id ? 'Update Produk' : 'Tambah Produk'"
    type="clean"
  >
    <div class="card text-center">
      <div class="card-header">
        <h4>{{ product.id ? "Update Produk" : "Tambah Produk" }}</h4>
      </div>
      <div class="card-body">
        <div class="form-group mb-3">
          <label class="mb-1" for="name">Nama Produk</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="product.name"
            placeholder="Nama Produk"
          />
          <div v-if="validation.name" class="alert alert-danger mt-2">
            {{ validation.name }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="mb-1" for="description">Deskripsi Produk</label>
          <textarea
            class="form-control"
            id="description"
            v-model="product.description"
            placeholder="Deskripsi Produk"
          ></textarea>
          <div v-if="validation.description" class="alert alert-danger mt-2">
            {{ validation.description }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="mb-1" for="price">Harga Produk</label>
          <div class="input-group input-group-merge input-price">
            <span class="input-group-text fw-bold text-muted">Rp.</span>
            <input
              type="number"
              class="form-control"
              min="1"
              id="price"
              v-model="product.price"
              placeholder="Harga Produk"
            />
          </div>
          <div v-if="validation.price" class="alert alert-danger mt-2">
            {{ validation.price }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="mb-1" for="quantity">Stok Produk</label>
          <div class="input-group input-group-merge input-price">
            <input
              type="number"
              class="form-control"
              min="1"
              id="quantity"
              v-model="product.quantity"
              placeholder="Stok Produk"
            />
            <span class="input-group-text fw-bold text-muted">Pcs</span>
          </div>
          <div v-if="validation.quantity" class="alert alert-danger mt-2">
            {{ validation.quantity }}
          </div>
        </div>
      </div>
      <div class="card-footer text-muted">
        <button
          class="btn btn-primary"
          @click="product.id ? updateStore(product.id) : store()"
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
    const product = reactive({
      name: "",
      description: "",
      price: "",
      quantity: "",
    });
    const validation = ref([]);
    let products = ref([]);
    let showModal = ref(false);
    let emptyProducts = ref(false);

    //mounted
    onMounted(() => {
      //get API from Laravel Backend
      axios
        .get("/products")
        .then((response) => {
          //assign state products with response data
          products.value = response.data.data;
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
      products,
      emptyProducts,
      showModal,
      product,
      validation,
    };
  },

  methods: {
    create() {
      this.product = {
        name: "",
        description: "",
        price: "",
        quantity: "",
      };
      this.showModal = true;
    },

    store() {
      axios
        .post("/products", this.product)
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
        .get("/products/" + id)
        .then((response) => {
          this.product = response.data.data;
          this.showModal = true;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    updateStore(id) {
      axios
        .put("/products/" + id, this.product)
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
        .delete("/products/" + id)
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