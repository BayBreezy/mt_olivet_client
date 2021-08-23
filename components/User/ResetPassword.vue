<template>
  <div>
    <v-dialog
      persistent
      v-model="dialog"
      transition="scroll-y-transition"
      max-width="350"
    >
      <v-card rounded="lg" class="pa-2">
        <v-btn @click.stop="dialog = false" absolute top right icon small>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
        <v-card-title>Reset Password</v-card-title>
        <v-card-actions>
          <v-form lazy-validation ref="resetForm" @submit.prevent="Handle">
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  outlined
                  v-model="email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  label="Email"
                  placeholder="Enter email for password reset"
                ></v-text-field>
              </v-col>
              <v-col class="" cols="12">
                <v-btn
                  min-height="45"
                  block
                  depressed
                  dark
                  class="pg"
                  type="submit"
                  >Submit</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  props: {
    resetDialog: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      email: null
    };
  },
  computed: {
    dialog: {
      get() {
        return this.resetDialog;
      },
      set(v) {
        this.$refs.resetForm.reset();
        this.$refs.resetForm.resetValidation();
        this.$emit("ClosePassReset", false);
      }
    }
  },
  methods: {
    async Handle() {
      if (!this.$refs.resetForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.forgotPassword({ email: this.email });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Reset email sent."
        });
        this.dialog = false;
      } catch (error) {
        console.log(error.response);
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
