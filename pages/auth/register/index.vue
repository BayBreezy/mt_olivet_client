<template>
  <v-row no-gutters align="center" class="fill-height">
    <v-col md="6" cols="12">
      <v-card
        flat
        :max-width="$vuetify.breakpoint.mdAndUp ? '60%' : '90%'"
        class="pa-md-10 mx-auto my-10 my-md-0"
      >
        <h1 class="text-center mb-5">Register</h1>
        <div class="text-center my-5">
          <span class="text-caption">
            Already have an account?
            <nuxt-link class="text-decoration-none" to="/"
              >Login here</nuxt-link
            >
          </span>
        </div>
        <v-form
          ref="regForm"
          @submit.prevent="Register"
          class="mt-5"
          lazy-validation
        >
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                type="text"
                v-model.trim="firstname"
                outlined
                :rules="[rules.required]"
                title="Enter Firstname"
                label="Firstname"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="text"
                v-model.trim="lastname"
                outlined
                :rules="[rules.required]"
                title="Enter Lastname"
                label="Lastname"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="text"
                v-model.trim="username"
                outlined
                :rules="[rules.required]"
                title="Enter Username"
                label="Username"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="email"
                v-model.trim="email"
                outlined
                :rules="[rules.required, rules.email]"
                title="Enter email"
                label="Email"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :type="ptype"
                v-model.trim="password"
                outlined
                @click:append="
                  ptype == 'password' ? (ptype = 'text') : (ptype = 'password')
                "
                :rules="[rules.required, rules.password_length]"
                :append-icon="ptype == 'password' ? 'mdi-eye' : 'mdi-eye-off'"
                title="Enter password"
                label="Password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                type="submit"
                min-height="42"
                min-width="200"
                class="pg text-capitalize text-subtitle-1"
                dark
                >Register</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
    <v-col md="6" v-if="$vuetify.breakpoint.mdAndUp">
      <v-img :src="image" height="100vh">
        <template #placeholder>
          <v-row class="fill-height" align="center" justify="center">
            <v-progress-circular
              size="200"
              class="text-center"
              color="primary"
              width="5"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
  </v-row>
</template>

<script>
import { Picsum } from "picsum-photos";

import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  layout: "authlayout",
  async created() {
    let { download_url } = await Picsum.random();
    this.image = download_url;
  },
  async mounted() {
    this.socket = this.$nuxtSocket({});
  },
  data() {
    return {
      socket: null,
      image: "",
      ptype: "password",
      email: null,
      password: null,
      username: null,
      firstname: null,
      lastname: null
    };
  },
  methods: {
    async Register() {
      if (!this.$refs.regForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let user = await this.$strapi.register({
          email: this.email,
          username: this.username,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname
        });
        console.log(user);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "primary",
          text: "Thank you for registering. Confirm email to continue"
        });
        this.$router.push("/");
        this.$store.commit("utils/Set_Overlay", false);
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
