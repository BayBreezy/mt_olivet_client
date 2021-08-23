<template>
  <v-container>
    <br />
    <p class="text--disabled ma-0 text-uppercase">Students</p>
    <br />
    <v-row>
      <v-col md="3" cols="8">
        <v-text-field
          hide-details="auto"
          placeholder="search"
          class="flex-shrink-1"
          outlined
          v-model.trim="search"
          dense
        ></v-text-field>
      </v-col>
      <v-spacer />
      <v-col md="3" cols="3" class="text-right">
        <v-btn
          nuxt
          to="/admin/new_user?t=student"
          min-width="100"
          dark
          class="pg text-capitalize font-weight-thin flex-grow-0"
          >Add</v-btn
        >
      </v-col>
    </v-row>
    <br />

    <v-card outlined>
      <v-data-table :items="students" :search="search" :headers="headers">
        <template #item.email="{item}">
          <a :href="`mailto:${item.email}`">{{ item.email }}</a>
        </template>
        <template #item.image="{item}">
          <v-avatar size="35" v-if="item.image">
            <v-img :src="userImage(item)"></v-img>
          </v-avatar>
          <v-avatar size="35" color="primary" v-else>
            <v-icon small color="white">mdi-account</v-icon>
          </v-avatar>
        </template>
        <template #item.action="{item}">
          <v-btn nuxt :to="`/admin/student/${item.id}`" icon small>
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $strapi }) {
    try {
      let u = [];
      u = await $strapi.find("users", { "role.type": "student" });
      return { students: u };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Image",
          value: "image",
          divider: true,
          sortable: false,
          align: "center"
        },
        {
          text: "First name",
          value: "firstname",
          divider: true,
          align: "center"
        },
        {
          text: "Last name",
          value: "lastname",
          divider: true,
          align: "center"
        },
        { text: "Email", value: "email", divider: true, align: "center" },
        {
          text: "Action",
          value: "action",
          divider: true,
          sortable: false,
          align: "center"
        }
      ]
    };
  },
  methods: {
    userImage(u) {
      return u.image ? `${process.env.STRAPI_URL}${u.image.url}` : null;
    }
  }
};
</script>

<style></style>
