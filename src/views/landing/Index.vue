<template>
  <div class="p-5">
    <div v-if="emptyProducts" class="text-center">
      <h1 class="display-4">Belum Ada Produk</h1>
    </div>
    <div class="row d-flex">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="col-md-2 col-lg-4"
      >
        <div class="card text-center">
          <div class="card-header">
            <h5 class="card-title">{{ product.name }}</h5>
          </div>
          <div class="card-body">
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text">
              Rp.
              {{
                product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }}
              / pcs
            </p>
            <p class="card-text">Stok: {{ product.quantity }} pcs</p>
          </div>
          <div class="card-footer">
            <button
              v-if="user && product.quantity > 0"
              class="btn btn-primary"
              @click="show(product.id)"
            >
              Beli
            </button>
            <button
              v-else-if="user && product.quantity <= 0"
              class="btn btn-primary"
              disabled
            >
              Stok Habis
            </button>
            <button
              v-if="!user"
              class="btn btn-primary"
              @click="$router.push('/login')"
            >
              Beli
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Modal v-model:visible="showModal" :title="product.name" type="clean">
    <div class="card text-center">
      <div class="card-header">
        <h5 class="card-title">{{ product.name }}</h5>
      </div>
      <div class="card-body">
        <p class="card-text">{{ product.description }}</p>
        <p class="card-text">
          Rp.
          {{ product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}
          / pcs
        </p>
        <p class="card-text">Stok: {{ product.quantity }} pcs</p>
      </div>
      <div class="card-footer text-center">
        <div class="form-group mb-2">
          <label class="mb-2">Jumlah</label>
          <input
            type="number"
            v-model="order.quantity"
            class="form-control"
            placeholder="Jumlah"
            min="1"
            :max="product.quantity"
          />
          <div v-if="validation.quantity" class="mt-2 alert alert-danger">
            {{ validation.quantity[0] }}
          </div>
        </div>
        <div class="form-group mb-2">
          <label class="mb-2">Alamat</label>
          <input
            type="text"
            v-model="order.address"
            class="form-control"
            placeholder="Alamat"
          />
          <div v-if="validation.address" class="mt-2 alert alert-danger">
            {{ validation.address[0] }}
          </div>
        </div>
        <button v-if="user" class="btn btn-primary" @click="store()">
          Beli
        </button>
        <button v-else class="btn btn-primary" @click="$router.push('/login')">
          Beli
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
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    const order = reactive({
      user_id: user ? user.id : "",
      product_id: "",
      quantity: "1",
      address: "",
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
          products.value = response.data.data;
          if (response.data.data.length == 0) {
            emptyProducts.value = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });

    function store() {
      //define variable
      let user_id = order.user_id;
      let product_id = order.product_id;
      let quantity = order.quantity;
      let address = order.address;

      //send server with axios
      axios
        .post("/orders", {
          user_id,
          product_id,
          quantity,
          address,
        })
        .then(() => {
          //close modal
          showModal.value = false;
          window.location.reload();
        })
        .catch((error) => {
          validation.value = error.response.data;
        });
    }

    return {
      user,
      showModal,
      products,
      order,
      store,
      validation,
      emptyProducts,
    };
  },
  data() {
    return {
      product: {
        name: "",
        description: "",
        price: "",
        quantity: "",
      },
    };
  },

  methods: {
    show(id) {
      axios
        .get("/products/" + id)
        .then((response) => {
          this.product = response.data.data;
          this.order.product_id = response.data.data.id;
          this.showModal = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>