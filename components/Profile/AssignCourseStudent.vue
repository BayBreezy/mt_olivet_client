<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="500"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Asign Course</v-card-title>
        <v-btn
          @click="dialog = false"
          icon
          absolute
          style="top: 10px; right:5px"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
        <v-form
          class="mt-5 px-3"
          lazy-validation
          ref="form"
          @submit.prevent="CreatCourse"
        >
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="start"
                :rules="[rules.required]"
                outlined
                type="date"
                label="Start Date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="end"
                outlined
                :rules="[rules.required]"
                type="date"
                label="End Date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-select
                outlined
                v-model="course"
                :rules="[rules.required]"
                type="text"
                label="Course"
                :items="courses"
                item-text="name"
                item-value="id"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
                type="submit"
                depressed
                min-width="200"
                class="pg text-capitalize text-subtitle-1"
                dark
                >Create</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  props: {
    assignCourseDialog: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: Number,
      default: () => 0
    },
    courses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      start: null,
      end: null,
      course: null
    };
  },
  methods: {
    /**
     * Method used to create a course
     */
    async CreatCourse() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.create("student-courses", {
          start: this.start,
          end: this.end,
          course: this.course,
          student: this.id
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Course assigned."
        });
        this.dialog = false;
        this.$emit("CourseAssigned", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error);
        console.log(error.response);
      }
    }
  },
  computed: {
    dialog: {
      get() {
        return this.assignCourseDialog;
      },
      set(v) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseAssignC", false);
      }
    }
  }
};
</script>

<style></style>
