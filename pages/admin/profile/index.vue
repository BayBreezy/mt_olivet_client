<template>
  <v-container>
    <input
      hidden
      type="file"
      ref="hiddenInput"
      accept=".png, .jpg, .jpeg"
      @change="AddImage"
      @click="$event.target.value = ''"
    />
    <br />
    <div class="text-center">
      <v-img
        :src="image ? image : userImage ? userImage : '/icon.png'"
        height="150"
        width="150"
        class="rounded-circle mx-auto"
      ></v-img>
      <v-btn
        @click="$refs.hiddenInput.click()"
        class="text-capitalize pg mt-4"
        dark
        small
        >Change</v-btn
      >
    </div>
    <br /><br />
    <v-form lazy-validation @submit.prevent="Handle" ref="profileForm">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="3">
          <v-text-field
            hide-details="auto"
            outlined
            v-model="user.email"
            label="Email"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="8" md="3">
          <v-text-field
            hide-details="auto"
            outlined
            v-model="user.username"
            label="Username"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="8" md="3">
          <v-text-field
            hide-details="auto"
            outlined
            v-model="password"
            label="Password"
          ></v-text-field>
        </v-col>
        <v-col offset-sm="4" offset-md="3" cols="12">
          <v-btn dark class="pg" min-height="45" type="submit">Update</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $strapi }) {
    try {
      let d = await $strapi.findOne("users", $strapi.user.id);
      return { user: d };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      image: null,
      tab: 0,
      //user
      password: null,
      newAvatar: null
    };
  },
  computed: {
    userImage() {
      return this.$strapi.user.image
        ? `${process.env.STRAPI_URL}${this.$strapi.user.image.url}`
        : null;
    }
  },
  methods: {
    async AddImage(e) {
      let file = e.target.files[0];
      if (!file) return;
      //Check if the file is image
      if (!file.type.match("image/")) return;
      let reader = new FileReader();
      this.newAvatar = file;
      reader.onload = e => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    /**
     * Function used to remove file
     */
    async RemoveAvatar(id) {
      try {
        await this.$strapi.delete("upload/files", id);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Method used to update user
     */
    async Handle() {
      if (!this.$refs.profileForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let fd = new FormData();
        if (!!this.newAvatar) {
          fd.append("files", this.newAvatar);
          fd.append("refId", this.user.id);
          fd.append("ref", "user");
          fd.append("source", "users-permissions");
          fd.append("field", "image");
          if (this.user.avatar && this.user.avatar.id) {
            this.RemoveAvatar(this.user.avatar.id);
          }
          await this.$strapi.create("upload", fd);
        }
        fd.append("email", this.user.email);
        fd.append("username", this.user.username);
        if (this.password) fd.append("password", this.password);
        let d = await this.$strapi.update("users", this.user.id, fd);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Account updated."
        });
        if (!!this.newAvatar) window.location.reload();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        console.log(error);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "error",
          text: error
        });
      }
    }
  }
};
</script>

<style></style>
