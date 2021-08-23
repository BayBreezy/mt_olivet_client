<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="500"
      v-model="dialog"
    >
      <v-card v-if="address" class="pb-4">
        <v-card-title>Edit Address</v-card-title>
        <v-btn
          @click="dialog = false"
          icon
          absolute
          style="top: 10px; right:5px"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
        <v-form
          class="mt-5 px-3"
          lazy-validation
          ref="form"
          @submit.prevent="UpdateAddress"
        >
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="address.street1"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Line 1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="address.street2"
                outlined
                type="text"
                label="Line 2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="address.town"
                :rules="[rules.required]"
                type="text"
                label="Town"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="address.parish"
                :rules="[rules.required]"
                type="text"
                label="Parish"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="address.country"
                :rules="[rules.required]"
                type="text"
                label="Country"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
                type="submit"
                min-width="200"
                class="pg text-capitalize text-subtitle-1"
                dark
                >Update</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  props: {
    editAddrDialog: {
      type: Boolean,
      default: () => false
    },
    address: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    /**
     * Method used to create a course
     */
    async UpdateAddress() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.update(
          "addresses",
          this.address.id,
          this.address
        );
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Address updated."
        });
        this.dialog = false;
        this.$emit("AddressUpdated", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error);
        console.log(error.response);
      }
    }
  },
  computed: {
    dialog: {
      get() {
        return this.editAddrDialog;
      },
      set(v) {
        this.$emit("CloseEditAddress", false);
      }
    }
  }
};
</script>

<style></style>
