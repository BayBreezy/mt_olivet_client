<template>
  <v-row no-gutters align="center" class="fill-height">
    <v-col md="6" cols="12">
      <v-card
        flat
        :max-width="$vuetify.breakpoint.mdAndUp ? '60%' : '90%'"
        class="pa-md-10 mx-auto "
      >
        <h1 class="text-center text-h4 mb-10">Reset Password</h1>

        <v-form
          class="mt-5"
          ref="resetForm"
          @submit.prevent="Handle"
          lazy-validation
        >
          <v-row no-gutters>
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
              <v-text-field
                :type="cptype"
                v-model.trim="cpassword"
                outlined
                @click:append="
                  cptype == 'password'
                    ? (cptype = 'text')
                    : (cptype = 'password')
                "
                :rules="[rules.required, rules.password_length, match]"
                :append-icon="cptype == 'password' ? 'mdi-eye' : 'mdi-eye-off'"
                title="Re-enter password"
                label="Confirm Password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
                min-width="200"
                class="pg text-capitalize text-subtitle-1"
                dark
                type="submit"
                block
                >Update</v-btn
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
  data() {
    return {
      image: "",
      ptype: "password",
      password: null,
      cptype: "password",
      cpassword: null
    };
  },
  mounted() {
    if (!this.$route.query.code) {
      return this.$router.push("/");
    }
  },
  methods: {
    async Handle() {
      if (!this.$refs.resetForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.resetPassword({
          code: this.$route.query.code,
          password: this.password,
          passwordConfirmation: this.cpassword
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Password updated. You may now log in."
        });
        this.$router.push("/");
        console.log(d);
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "error",
          text: error
        });
      }
    }
  },
  computed: {
    match() {
      return (
        (!!this.cpassword && this.cpassword === this.password) ||
        "Passwords do not match."
      );
    }
  }
};
</script>

<style></style>
