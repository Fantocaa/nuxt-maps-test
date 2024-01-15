<template>
  <div class="absolute z-50">
    <div
      class="flex items-center justify-center h-20 w-20 rounded-full bg-blue-500 cursor-pointer"
      @click="showLoginPanel = true"
    >
      <div class="text-white">Account</div>
    </div>

    <div
      v-if="showLoginPanel"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      @click.self="showLoginPanel = false"
    >
      <div class="bg-white p-8 rounded-lg relative">
        <button
          class="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700"
          @click.stop="showLoginPanel = false"
        >
          X
        </button>
        <h2 class="text-2xl font-bold mb-4">Login</h2>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
            >Name:</label
          >
          <input
            v-model="user.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email:</label
          >
          <input
            v-model="user.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "", // Add this line
      },
      token: "",
      showLoginPanel: false,
    };
  },

  methods: {
    async login() {
      try {
        await axios.get("/backend/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        const response = await axios.post(
          "/backend/login",
          {
            email: this.user.email,
            password: this.user.password,
          },
          {
            withCredentials: true,
            headers: {
              "X-XSRF-TOKEN": this.$cookies.get("XSRF-TOKEN"),
            },
          }
        );
        // Ambil informasi pengguna saat ini setelah login berhasil
        await this.getUser();

        this.token = response.data.token; // adjust based on your API response
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },

    async getUser() {
      try {
        const response = await axios.get("/backend/api/user", {
          credentials: "include",
          headers: {
            accept: "application/json",
            "x-xsrf-token": useCookie("XSRF-TOKEN"),
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    // logout() {
    //   // Clear the token and user data
    //   this.token = "";
    //   this.user = {
    //     name: "",
    //     email: "",
    //   };
    //   this.showLoginPanel = false;
    // },

    async handleLogin() {
      try {
        await useFetch("/backend/sanctum/csrf-cookie", {
          credentials: "include",
        });

        // Lanjutkan dengan langkah-langkah selanjutnya setelah CSRF cookie diterima
        await this.login();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },

    async logout() {
      try {
        await axios.post("/backend/logout", null, {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": this.$cookies.get("XSRF-TOKEN"),
          },
        });

        // Clear the token and user data
        this.token = "";
        this.user = {
          name: "",
          email: "",
        };
        this.showLoginPanel = false;
      } catch (error) {
        console.error("An error occurred during logout:", error);
      }
    },
  },

  created() {
    // Get the user data when the component is created
    this.getUser();
    // this.login();
  },
};
</script>

<style>
/* Add any custom styles here */
</style>
