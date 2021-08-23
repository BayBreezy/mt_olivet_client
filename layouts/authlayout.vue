<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
    <Loader />
    <Message />
  </v-app>
</template>

<script>
export default {
  middleware: "already",
  data() {
    return {};
  }
};
</script>
