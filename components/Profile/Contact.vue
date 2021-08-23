<template>
  <div>
    <v-form
      v-if="!user.contact"
      @submit.prevent="UpdateUser"
      class="mt-5 px-3"
      lazy-validation
    >
      <v-row no-gutters>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="home"
            label="Home phone"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="mobile1"
            label="Mobile 1"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="mobile2"
            label="Mobile 2"
          ></v-text-field>
        </v-col>

        <v-col cols="7" class="px-md-2">
          <v-btn
            min-height="42"
            type="submit"
            :dense="$vuetify.breakpoint.smAndDown"
            min-width="200"
            class="pg text-capitalize text-subtitle-1"
            dark
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-form
      v-else
      @submit.prevent="UpdateUser"
      class="mt-5 px-3"
      lazy-validation
    >
      <v-row no-gutters>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.contact.home"
            label="Home phone"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.contact.mobile1"
            label="Mobile 1"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.contact.mobile2"
            label="Mobile 2"
          ></v-text-field>
        </v-col>

        <v-col cols="7" class="px-md-2">
          <v-btn
            min-height="42"
            type="submit"
            :dense="$vuetify.breakpoint.smAndDown"
            min-width="200"
            class="pg text-capitalize text-subtitle-1"
            dark
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      valid: true,
      home: null,
      mobile1: null,
      mobile2: null
    };
  },
  methods: {
    /**
     * Method used to create the user
     */
    async UpdateUser() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let u;
        if (this.user.contact) {
          u = await this.$strapi.update(
            "contacts",
            this.user.contact.id,
            this.user.contact
          );
        } else {
          u = await this.$strapi.create("contacts", {
            home: this.home,
            mobile1: this.mobile1,
            mobile2: this.mobile2,
            user: this.user.id
          });
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Contact updated."
        });
        this.$emit("ContactUpdated", true);
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
