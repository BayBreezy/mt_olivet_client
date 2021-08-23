<template>
  <v-card v-if="nok.name">
    <v-card-text>
      <p class="font-weight-bold">{{ nok.name }}</p>
      <p class="mb-2">
        <a :href="`tel:${nok.phone}`">
          {{ nok.phone }}
        </a>
      </p>
      <p class="mb-2">Relationship: {{ nok.relationship }}</p>
      <p class="mb-2">{{ nok.address }}</p>
    </v-card-text>
    <v-card-actions class="d-flex justify-space-between">
      <v-btn @click="editNOK = true" depressed class="pg" dark small
        >Edit</v-btn
      >
      <v-btn @click="DeleteKin" outlined color="error" small>Delete</v-btn>
    </v-card-actions>
    <ProfileEditNOK
      @CloseEditNOK="editNOK = false"
      @NOKUpdated="$nuxt.refresh()"
      :editNOK="editNOK"
      :nok="nok"
    />
  </v-card>
</template>

<script>
export default {
  props: {
    nok: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editNOK: false
    };
  },
  methods: {
    async DeleteKin() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("kins", this.nok.id);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "blue",
          text: "Kin Removed."
        });
        this.$nuxt.refresh();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
