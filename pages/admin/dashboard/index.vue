<template>
  <v-container>
    <br />
    <v-row>
      <v-col md="4" cols="6">
        <v-card
          nuxt
          to="/admin/student"
          hover
          :ripple="{ class: 'primary--text' }"
        >
          <v-card-title class="text--disabled text-body-2">
            STUDENTS
          </v-card-title>
          <v-card-text>
            <h2 class="primary--text text-h4 font-weight-black">
              {{ studentCount }}
            </h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="4" cols="6">
        <v-card
          nuxt
          to="/admin/staff"
          hover
          :ripple="{ class: 'primary--text' }"
        >
          <v-card-title class="text--disabled text-body-2">
            STAFF
          </v-card-title>
          <v-card-text>
            <h2 class="primary--text text-h4 font-weight-black">
              {{ staffCount }}
            </h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="4" cols="6">
        <v-card
          nuxt
          to="/admin/courses"
          hover
          :ripple="{ class: 'primary--text' }"
        >
          <v-card-title class="text--disabled text-body-2">
            COURSES
          </v-card-title>
          <v-card-text>
            <h2 class="primary--text text-h4 font-weight-black">
              {{ courseCount }}
            </h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <br />
    <v-row class="mt-2">
      <v-col md="6" cols="12">
        <div class="d-flex justify-space-between align-center">
          <p class="text--disabled ma-0">Events</p>
          <v-btn
            nuxt
            to="/admin/events"
            small
            dark
            class="pg text-capitalize font-weight-thin"
            >See All</v-btn
          >
        </div>
        <v-card class="mt-5" flat>
          <v-card-text class="mx-0 px-0" style="height:400px; overflow: auto;">
            <template v-for="n in lastFiveEvents">
              <v-hover v-slot="{ hover }" :key="`event-${n.id}`">
                <v-card
                  :ripple="{
                    class: 'primary--text'
                  }"
                  :flat="!hover"
                  :hover="hover"
                  :elevation="hover ? 5 : 0"
                  class="mb-3 mx-3"
                >
                  <v-card-title>{{ n.name }}</v-card-title>
                  <v-card-subtitle class="text-caption primary--text pb-2">{{
                    $dayjs(n.start).format("MMMM D, YYYY")
                  }}</v-card-subtitle>
                  <v-card-text>{{ n.description }}</v-card-text>
                </v-card>
              </v-hover>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6" cols="12">
        <div class="d-flex justify-space-between align-center">
          <p class="text--disabled ma-0">Notifications</p>
          <v-btn
            nuxt
            to="/admin/noticeboard"
            small
            dark
            class="pg text-capitalize font-weight-thin"
            >See All</v-btn
          >
        </div>
        <v-card class="mt-5" flat>
          <v-card-text class="mx-0 px-0" style="height:400px; overflow: auto;">
            <template v-for="n in lastFiveNotices">
              <v-hover v-slot="{ hover }" :key="`notification-${n.id}`">
                <v-card
                  :ripple="{ class: 'primary--text' }"
                  :flat="!hover"
                  :hover="hover"
                  :elevation="hover ? 5 : 0"
                  class="mb-3 mx-3"
                >
                  <v-card-title>{{ n.name }}</v-card-title>
                  <v-card-text>{{ n.description }}</v-card-text>
                </v-card>
              </v-hover>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $strapi }) {
    try {
      let sta = 0,
        stu = 0,
        crs = 0,
        lastFiveEvents = [],
        lastFiveNotices = [];
      sta = await $strapi.count("users", { "role.type": "staff" });
      stu = await $strapi.count("users", { "role.type": "student" });
      crs = await $strapi.count("courses");
      lastFiveEvents = await $strapi.find("events", { _limit: 5 });
      lastFiveNotices = await $strapi.find("notices", { _limit: 5 });
      return {
        staffCount: sta,
        studentCount: stu,
        courseCount: crs,
        lastFiveEvents,
        lastFiveNotices
      };
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style></style>
