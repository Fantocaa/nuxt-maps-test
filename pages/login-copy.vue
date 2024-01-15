<script lang="ts" setup>
import { ref } from "vue";

const form = ref({
  email: "user@tako.co.id",
  password: "12341234",
});

const auth = useAuthStore();

// const handleLogin = async () => {
async function handleLogin() {
  const { error } = await auth.login(form.value);
}
</script>

<template>
  <div>Page: login</div>
  <form @submit.prevent="handleLogin">
    <label> Email <input type="email" v-model="form.email" /></label>
    <label> Password <input type="password" v-model="form.password" /></label>
    <button type="submit">Login</button>
  </form>
</template>
