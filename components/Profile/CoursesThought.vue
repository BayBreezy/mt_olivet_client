<template>
  <v-card class="py-4">
    <v-avatar
      class="mx-auto d-block "
      :color="coursesThought.course.cover ? '' : 'primary'"
    >
      <v-img
        v-if="coursesThought.course.cover"
        :src="courseImage(coursesThought.course)"
      ></v-img>
      <v-icon v-else dark>mdi-script-text-outline</v-icon>
    </v-avatar>
    <p class="text-caption font-weight-bold text-center mt-4 mb-2">
      {{ coursesThought.course.course_code }}
    </p>
    <p class="text-center text-body-2">{{ coursesThought.course.name }}</p>
    <p class="text-center text-caption mb-1">
      From: {{ $dayjs(coursesThought.start).format("MMM D, YYYY") }}
    </p>
    <p class="text-center text-caption">
      To: {{ $dayjs(coursesThought.end).format("MMM D, YYYY") }}
    </p>
    <v-card-actions class="d-flex justify-space-between">
      <v-btn block text @click="RemoveCourse" color="error" small>Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    coursesThought: {
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
    /**
     * Returns course cover if one is there
     */
    courseImage(u) {
      return u.cover ? `${process.env.STRAPI_URL}${u.cover.url}` : null;
    },
    async RemoveCourse() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("course-lecturers", this.coursesThought.id);
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
