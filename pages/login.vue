<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const form = ref({
      email: "user@tako.co.id",
      password: "12341234",
    });

    // const handleLogin = async () => {
    async function handleLogin() {
      // try {
      await useFetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const token = useCookie("XSRF-TOKEN");

      await useFetch("http://localhost:8000/login", {
        credentials: "include",
        method: "POST",
        body: form.value,
        watch: false,
        headers: {
          "X-XSRF-TOKEN": token.value as string,
        },
      });

      const { data } = await useFetch("http://localhost:8000/api/user", {
        credentials: "include",
        watch: false,
        headers: {
          "X-XSRF-TOKEN": token.value as string,
        },
      });
      console.log(data);
    }

    return {
      form,
      handleLogin,
    };
  },
};
</script>

<template>
  <div>Page: login</div>
  <form @submit.prevent="handleLogin">
    <label> Email <input type="email" v-model="form.email" /></label>
    <label> Password <input type="password" v-model="form.password" /></label>
    <button type="submit">Login</button>
  </form>
</template>
