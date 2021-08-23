<template>
  <v-container>
    <br />
    <v-avatar
      style="border: solid grey 1px; cursor: pointer;"
      size="120"
      class="mx-auto d-block"
    >
      <v-img
        :gradient="
          !user.image ? `to top,rgba(255,255,255,1),rgba(255,255,255,0.7)` : ''
        "
        :src="user.image ? userImage() : '/icon.png'"
      >
      </v-img>
    </v-avatar>
    <br />
    <br />
    <v-tabs
      active-class="font-weight-bold"
      centered
      v-model="tab"
      :show-arrows="true"
      center-active
      slider-color="grey"
      slider-size="1"
    >
      <v-tab class="text-capitalize">Personal</v-tab>
      <v-tab class="text-capitalize">Education</v-tab>
      <v-tab class="text-capitalize">Qualification</v-tab>
      <v-tab class="text-capitalize">Next of Kin</v-tab>
      <v-tab class="text-capitalize">Address</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <br />
        <ProfilePersonal :user="user" />
      </v-tab-item>
      <v-tab-item>
        <br />
        <v-btn class="pg text-capitalize" dark>Add</v-btn>
        <br />
        <br />
        <ProfileEducation />
      </v-tab-item>
      <v-tab-item>
        <br />
        <v-btn class="pg text-capitalize" dark>Add</v-btn>
        <br />
        <br />
        <ProfileQualification />
      </v-tab-item>
      <v-tab-item>
        <br />
        <ProfileNextofkin />
      </v-tab-item>
      <v-tab-item>
        <br />
        <v-btn class="pg text-capitalize" dark>Add</v-btn>
        <br />
        <br />
        <ProfileAddress />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $strapi, query }) {
    try {
      let u = await $strapi.findOne("users", query.id);
      return { user: u };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      image: null,
      tab: 0
    };
  },
  methods: {
    /**
     * Used to return the user's image
     */
    userImage() {
      let i = "";
      if (this.user && this.user.image) {
        i = `${process.env.STRAPI_URL}${this.user.image.url}`;
      }
      return i;
    },
    AddImage(e) {
      let file = e.target.files[0];
      if (!file) return;
      //Check if the file is image
      if (!file.type.match("image/")) return;
      let reader = new FileReader();
      reader.onload = e => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style></style>
