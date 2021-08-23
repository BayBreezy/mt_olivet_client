<template>
  <div>
    <v-card outlined>
      <v-data-table :headers="headers" :items="qualifications">
        <template #item.actions="{item}">
          <v-btn @click="removeQualification(item.id)" icon small>
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
    qualifications: {
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
          text: "Subject",
          value: "subject",
          align: "center",
          divider: true
        },
        {
          text: "Grade",
          value: "grade",
          align: "center",
          divider: true
        },
        {
          text: "Exam Body",
          value: "exam_body",
          align: "center",
          divider: true
        },
        {
          text: "Award",
          value: "award_type",
          align: "center",
          divider: true
        },
        {
          text: "Award Date",
          value: "award_date",
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
    async removeQualification(id) {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("qualifications", id);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Qualification record removed."
        });
        this.dialog = false;
        this.$emit("QualificationRemoved", false);
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
