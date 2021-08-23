<template>
  <div>
    <v-form
      v-if="user"
      @submit.prevent="UpdateUser"
      ref="personalForm"
      class="mt-5 px-3"
      lazy-validation
    >
      <v-row no-gutters>
        <v-col cols="12" md="4" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.firstname"
            :rules="[rules.required]"
            label="First name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.middlename"
            label="Middle name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="px-md-2">
          <v-text-field
            :dense="$vuetify.breakpoint.smAndDown"
            outlined
            v-model.trim="user.lastname"
            :rules="[rules.required]"
            type="text"
            label="Last name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-text-field
            :dense="$vuetify.breakpoint.smAndDown"
            outlined
            v-model.trim="user.email"
            :rules="[rules.required, rules.email]"
            type="email"
            label="Email"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-text-field
            :dense="$vuetify.breakpoint.smAndDown"
            outlined
            type="text"
            v-model.trim="user.username"
            :rules="[rules.required]"
            label="Username"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-text-field
            :dense="$vuetify.breakpoint.smAndDown"
            outlined
            v-model.trim="user.trn"
            type="text"
            label="TRN"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-text-field
            :dense="$vuetify.breakpoint.smAndDown"
            outlined
            type="date"
            v-model.trim="user.dob"
            label="DOB"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-text-field
            outlined
            v-model.trim="user.age"
            :dense="$vuetify.breakpoint.smAndDown"
            type="number"
            label="Age"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-text-field
            outlined
            v-model.trim="user.nationality"
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
            label="Profile image"
            accept="image/*"
          ></v-file-input>
        </v-col>
        <v-col cols="12" md="6" class="px-md-2">
          <v-select
            :dense="$vuetify.breakpoint.smAndDown"
            outlined
            :items="genders"
            v-model="user.sex"
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
      image: null
    };
  },
  methods: {
    /**
     * Method used to create the user
     */
    async UpdateUser() {
      if (!this.$refs.personalForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let u = await this.$strapi.update("users", this.user.id, {
          firstname: this.user.firstname,
          middlename: this.user.middlename,
          lastname: this.user.lastname,
          username: this.user.username,
          email: this.user.email,
          trn: this.user.trn,
          sex: this.user.sex,
          dob: this.user.dob,
          nationality: this.user.nationality,
          age: this.user.age
        });

        if (this.image) {
          // Remove image if one was present
          if (this.user.image) {
            await this.$strapi.delete("upload/files/" + this.user.image.id);
          }
          //create FormData to send data
          let fd = new FormData();
          //Add image to fd
          fd.append("files", this.image);
          fd.append("refId", this.user.id);
          fd.append("ref", "user");
          fd.append("source", "users-permissions");
          fd.append("field", "image");

          await this.$strapi.create("upload", fd);
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Account updated."
        });
        this.$emit("PersonalUpdated", true);
        this.image = null;
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
