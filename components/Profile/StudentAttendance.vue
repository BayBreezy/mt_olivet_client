<template>
  <v-container>
    <v-row justify="space-between">
      <v-col class="" md="3" cols="7">
        <v-text-field
          v-model="search"
          outlined
          dense
          placeholder="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card outlined>
      <v-data-table
        :search="search"
        dense
        :items="attendance"
        :headers="headers"
      >
        <template #item.actions="{item}">
          <v-btn @click="removeAttendance(item.id)" icon small>
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    attendance: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Date", value: "date", align: "center", divider: true },
        { text: "Status", value: "status", align: "center", divider: true },
        {
          text: "Course",
          value: "course.name",
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
    async removeAttendance(id) {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("student-attendances", id);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Attendance removed."
        });
        this.dialog = false;
        this.$emit("StaffAttendanceRemoved", false);
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
