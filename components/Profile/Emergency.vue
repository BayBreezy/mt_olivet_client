<template>
  <v-card>
    <v-card-text>
      <p class="font-weight-bold">{{ emergency.name }}</p>
      <p class="mb-2">
        <a :href="`tel:${emergency.phone}`">
          {{ emergency.phone }}
        </a>
      </p>
      <p class="mb-2">Relationship: {{ emergency.relationship }}</p>
      <p class="mb-2">{{ emergency.address }}</p>
    </v-card-text>
    <v-card-actions class="d-flex justify-space-between">
      <v-btn @click="editEmergency = true" depressed class="pg" dark small
        >Edit</v-btn
      >
      <v-btn @click="DeleteEmergency" outlined color="error" small
        >Delete</v-btn
      >
    </v-card-actions>
    <ProfileEditEmergency
      @CloseEditEmergency="editEmergency = false"
      @EmergencyEditUpdated="$nuxt.refresh()"
      :editEmergency="editEmergency"
      :emergency="emergency"
    />
  </v-card>
</template>

<script>
export default {
  props: {
    emergency: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editEmergency: false
    };
  },
  methods: {
    async DeleteEmergency() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("emergency-contacts", this.emergency.id);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "info",
          text: "Emergency Contact Removed."
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
