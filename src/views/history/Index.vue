<template>
  <div class="p-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>Riwayat Pesanan</h4>
            <hr />

            <div v-if="emptyProducts" class="alert alert-info">
              Belum ada pesanan
            </div>
            <table v-else class="table table-striped table-bordered mt-4">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Barang</th>
                  <th scope="col">Harga</th>
                  <th class="text-center" scope="col">Jumlah</th>
                  <th scope="col">Total</th>
                  <th scope="col">Alamat</th>
                  <th class="text-center" scope="col">Status</th>
                  <th class="text-center" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in orders" :key="index">
                  <td>{{ order.product.name }}</td>
                  <td>
                    Rp.
                    {{
                      order.product.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }}
                    / pcs
                  </td>
                  <td class="text-center">
                    {{ order.quantity }}
                  </td>
                  <td>
                    Rp.
                    {{
                      (order.product.price * order.quantity)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }}
                  </td>
                  <td>
                    {{ order.address }}
                  </td>
                  <td class="text-center">
                    {{ order.status }}
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-danger"
                      @click="destroy(order.id)"
                    >
                      Hapus
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
</template>

<script>
import axios from "@/httpAxios.js";
import { onMounted, ref } from "vue";

export default {
  setup() {
    //reactive state
    let orders = ref([]);
    let user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    let emptyProducts = ref(false);

    //mounted
    onMounted(() => {
      //get API from Laravel Backend
      axios
        .get("/user/" + user.id + "/orders")
        .then((response) => {
          //assign state orders with response data
          orders.value = response.data.data;
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
      orders,
      emptyProducts,
    };
  },

  methods: {
    destroy(id) {
      axios
        .delete("/orders/" + id)
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