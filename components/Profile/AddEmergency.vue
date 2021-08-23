<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="500"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Add Emergency Contact</v-card-title>
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
          @submit.prevent="CreateEmergency"
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                v-model.trim="name"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                v-model.trim="address"
                outlined
                type="text"
                label="Address"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="phone"
                :rules="[rules.required]"
                type="tel"
                label="Phone"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="relationship"
                :rules="[rules.required]"
                type="text"
                label="Relationship"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
                type="submit"
                min-width="200"
                class="pg text-capitalize text-subtitle-1"
                dark
                >Create</v-btn
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
    addEmergency: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      name: null,
      address: null,
      phone: null,
      relationship: null
    };
  },
  methods: {
    /**
     * Method used to create a course
     */
    async CreateEmergency() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.create("emergency-contacts", {
          name: this.name,
          address: this.address,
          phone: this.phone,
          relationship: this.relationship,
          user: this.id
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Emergencyt Contact Created."
        });
        this.dialog = false;
        this.$emit("EmergencyAdded", false);
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
        return this.addEmergency;
      },
      set(v) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseAddEmergency", false);
      }
    }
  }
};
</script>

<style></style>
