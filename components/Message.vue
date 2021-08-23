<template>
  <div>
    <v-snackbar
      top
      app
      :color="color"
      :timeout="7000"
      v-model="show"
      transition="scroll-y-transition"
    >
      <span>{{ snackText }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="show = false">
          <v-icon size="18">mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  computed: {
    snackText() {
      return this.$store.state.utils.snackText;
    },
    color() {
      return this.$store.state.utils.snackColor;
    },
    show: {
      get() {
        return this.$store.state.utils.showSnackText;
      },
      set(value) {
        this.$store.commit("utils/Set_Snack", {
          show: false,
          color: "green",
          text: ""
        });
      }
    }
  }
};
</script>

<style></style>
