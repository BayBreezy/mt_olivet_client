<template>
  <v-card>
    <v-card-text>
      <p>{{ address.street1 }}</p>
      <p>{{ address.street2 }}</p>
      <p>{{ address.town + "," }} {{ address.parish }}</p>
      <p>{{ address.country }}</p>
    </v-card-text>
    <v-card-actions class="d-flex justify-space-between">
      <v-btn @click="editAddrDialog = true" depressed class="pg" dark small
        >Edit</v-btn
      >
      <v-btn @click="DeleteAddress" outlined color="error" small>Delete</v-btn>
    </v-card-actions>
    <ProfileEditAddress
      @CloseEditAddress="editAddrDialog = false"
      @AddressUpdated="$nuxt.refresh()"
      :editAddrDialog="editAddrDialog"
      :address="address"
    />
  </v-card>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editAddrDialog: false
    };
  },
  methods: {
    async DeleteAddress() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("addresses", this.address.id);
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
