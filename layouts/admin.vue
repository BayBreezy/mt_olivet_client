<template>
  <v-app>
    <NavAdmin />
    <v-main>
      <nuxt />
    </v-main>
    <Loader />
    <Message />
  </v-app>
</template>

<script>
export default {
  middleware: ["loggedIn"],
  data() {
    return {};
  }
};
</script>
