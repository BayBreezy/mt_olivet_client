<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="700"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Add User</v-card-title>
        <v-btn
          @click="dialog = false"
          icon
          absolute
          style="top: 10px; right:5px"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
        <v-form class="mt-5 px-3" lazy-validation>
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                type="text"
                label="First name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                type="text"
                label="Last name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field outlined type="email" label="Email"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                type="password"
                label="Password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field outlined type="tel" label="Phone"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field outlined type="date" label="DOB"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field outlined type="text" label="TRN"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field outlined type="text" label="NIS"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-file-input
                prepend-icon=""
                outlined
                label="Passport image"
                accept="image/*"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-select outlined type="text" label="Gender"></v-select>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
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
export default {
  props: {
    addDialog: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    dialog: {
      get() {
        return this.addDialog;
      },
      set(v) {
        this.$emit("CloseAdd", false);
      }
    }
  }
};
</script>

<style></style>
