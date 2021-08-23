<template>
  <v-container>
    <v-card class="pb-4">
      <v-card-title>Add New User</v-card-title>

      <v-form
        v-model="valid"
        class="mt-5 px-3"
        lazy-validation
        ref="form"
        @submit.prevent="CreateUser"
      >
        <v-row no-gutters>
          <v-col cols="12" md="4" class="px-md-2">
            <v-text-field
              outlined
              :dense="$vuetify.breakpoint.smAndDown"
              type="text"
              v-model.trim="firstname"
              :rules="[rules.required]"
              label="First name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="px-md-2">
            <v-text-field
              outlined
              :dense="$vuetify.breakpoint.smAndDown"
              type="text"
              v-model.trim="middlename"
              label="Middle name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="px-md-2">
            <v-text-field
              :dense="$vuetify.breakpoint.smAndDown"
              outlined
              v-model.trim="lastname"
              :rules="[rules.required]"
              type="text"
              label="Last name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="px-md-2">
            <v-text-field
              :dense="$vuetify.breakpoint.smAndDown"
              outlined
              v-model.trim="email"
              :rules="[rules.required, rules.email]"
              type="email"
              label="Email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="px-md-2">
            <v-text-field
              :dense="$vuetify.breakpoint.smAndDown"
              outlined
              type="text"
              v-model.trim="username"
              :rules="[rules.required]"
              label="Username"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="px-md-2">
            <v-text-field
              outlined
              v-model.trim="password"
              :rules="[rules.required, rules.password_length]"
              :dense="$vuetify.breakpoint.smAndDown"
              type="password"
              label="Password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="px-md-2">
            <v-text-field
              :dense="$vuetify.breakpoint.smAndDown"
              outlined
              v-model.trim="trn"
              type="text"
              label="TRN"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="px-md-2">
            <v-text-field
              :dense="$vuetify.breakpoint.smAndDown"
              outlined
              type="date"
              v-model.trim="dob"
              label="DOB"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="px-md-2">
            <v-text-field
              outlined
              v-model.trim="age"
              :dense="$vuetify.breakpoint.smAndDown"
              type="number"
              label="Age"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="px-md-2">
            <v-text-field
              outlined
              v-model.trim="nationality"
              :dense="$vuetify.breakpoint.smAndDown"
              type="text"
              label="Nationality"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="px-md-2">
            <v-file-input
              prepend-icon=""
              v-model="image"
              outlined
              :dense="$vuetify.breakpoint.smAndDown"
              label="Passport image"
              accept="image/*"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="6" class="px-md-2">
            <v-select
              :dense="$vuetify.breakpoint.smAndDown"
              outlined
              :items="genders"
              v-model="sex"
              type="text"
              label="Gender"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-btn
              min-height="42"
              type="submit"
              :dense="$vuetify.breakpoint.smAndDown"
              min-width="200"
              class="pg text-capitalize text-subtitle-1"
              dark
              >Create</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  layout: "admin",
  async asyncData({ $strapi }) {
    try {
      let t = await $strapi.find("users-permissions/roles");
      return { roles: t.roles };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      valid: true,
      firstname: null,
      middlename: null,
      lastname: null,
      username: null,
      email: null,
      password: null,
      trn: null,
      sex: null,
      dob: null,
      nationality: null,
      employed: null,
      image: null,
      age: null
    };
  },
  methods: {
    /**
     * Method used to create the user
     */
    async CreateUser() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let r = this.roles.filter(v => v.type == this.$route.query.t)[0];
        let u = await this.$strapi.create("users", {
          firstname: this.firstname,
          middlename: this.middlename,
          lastname: this.lastname,
          username: this.username,
          email: this.email,
          password: this.password,
          trn: this.trn,
          sex: this.sex,
          dob: this.dob,
          nationality: this.nationality,
          employed: this.employed,
          age: this.age,
          confirmed: true,
          role: r.id
        });

        if (this.image) {
          //create FormData to send data
          let fd = new FormData();
          //Add image to fd
          fd.append("files", this.image);
          fd.append("refId", u.id);
          fd.append("ref", "user");
          fd.append("source", "users-permissions");
          fd.append("field", "image");

          await this.$strapi.create("upload", fd);
          this.$store.commit("utils/Set_Overlay", false);
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Account created."
        });
        this.$router.push("/admin/" + this.$route.query.t);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "error",
          text: error
        });
        console.log(error);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
