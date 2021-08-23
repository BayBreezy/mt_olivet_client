<template>
  <v-row no-gutters align="center" class="fill-height">
    <v-col md="6" v-if="$vuetify.breakpoint.mdAndUp">
      <v-img :src="image" height="100vh">
        <template #placeholder>
          <v-row class="fill-height" align="center" justify="center">
            <v-progress-circular
              size="200"
              class="text-center"
              color="primary"
              width="3"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col md="6" cols="12">
      <v-card
        flat
        :max-width="$vuetify.breakpoint.mdAndUp ? '50%' : '90%'"
        class="pa-md-10 mx-auto"
      >
        <h1 class="text-center mb-5">Login</h1>
        <div class="text-center my-5">
          <span class="text-caption">
            Don’t have an account?
            <nuxt-link class="text-decoration-none" to="/auth/register"
              >Register Today</nuxt-link
            >
          </span>
        </div>
        <v-form ref="form" @submit.prevent="Login" class="mt-5" lazy-validation>
          <v-row no-gutters>
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
                block
                title="Click to log in"
                class="pg text-capitalize text-subtitle-1"
                dark
                >Login</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
        <div class="d-flex justify-space-between">
          <span
            @click="resetDialog = true"
            class="primary--text d-inline-block mt-10 text-caption"
            >Reset password?</span
          >
          <span
            @click="confirmDialog = true"
            class="primary--text d-inline-block mt-10 text-caption"
            >Confirm email</span
          >
        </div>
      </v-card>
    </v-col>
    <!-- Forgot password dialog -->
    <UserResetPassword
      @ClosePassReset="resetDialog = false"
      :resetDialog="resetDialog"
    />
    <!-- Confirm email dialog -->
    <UserConfirmEmail
      @CloseConfirm="confirmDialog = false"
      :confirmDialog="confirmDialog"
    />
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
      //resetDialog
      resetDialog: false,
      //confirmDialog
      confirmDialog: false,
      //Socket
      socket: null,
      image: "",
      ptype: "password",
      email: null,
      password: null
    };
  },
  methods: {
    async Login() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let user = await this.$strapi.login({
          identifier: this.email,
          password: this.password
        });
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "primary",
          text: "Welcome back."
        });
        window.location.reload();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "error",
          text: error
        });
        console.log(error);
      }
    }
  }
};
</script>

<style></style>
