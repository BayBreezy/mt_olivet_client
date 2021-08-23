<template>
  <div>
    <v-card outlined>
      <v-data-table :headers="headers" :items="educations">
        <template #item.actions="{item}">
          <v-btn @click="removeEducation(item.id)" icon small>
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    educations: {
      type: Array,
      default: () => []
    },
    id: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Institution",
          value: "institution",
          align: "center",
          divider: true
        },
        {
          text: "Start Date",
          value: "start_date",
          align: "center",
          divider: true
        },
        { text: "End Date", value: "end_date", align: "center", divider: true },
        {
          text: "Certificate",
          value: "certificate",
          align: "center",
          divider: true
        },
        { text: "Actions", value: "actions", align: "center", divider: true }
      ]
    };
  },
  methods: {
    /**
     * Method used to remove attendance
     */
    async removeEducation(id) {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("educations", id);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Education record removed."
        });
        this.dialog = false;
        this.$emit("EducationRemoved", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
