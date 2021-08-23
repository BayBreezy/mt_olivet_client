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
        <v-card-title>Confirm Email</v-card-title>
        <v-card-actions>
          <v-form lazy-validation ref="confirmForm" @submit.prevent="Handle">
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
    confirmDialog: {
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
        return this.confirmDialog;
      },
      set(v) {
        this.$refs.confirmForm.reset();
        this.$refs.confirmForm.resetValidation();
        this.$emit("CloseConfirm", false);
      }
    }
  },
  methods: {
    async Handle() {
      if (!this.$refs.confirmForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.sendEmailConfirmation({ email: this.email });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Confirmation email sent."
        });
        console.log(d);
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
