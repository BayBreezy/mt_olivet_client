<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="600"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Add Event</v-card-title>
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
          ref="form"
          lazy-validation
          @submit.prevent="CreateEvent"
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                outlined
                :dense="$vuetify.breakpoint.smAndDown"
                v-model="name"
                :rules="[rules.required]"
                type="text"
                label="Event title"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                outlined
                :dense="$vuetify.breakpoint.smAndDown"
                v-model="start"
                :rules="[rules.required]"
                type="datetime-local"
                label="Start"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                outlined
                :dense="$vuetify.breakpoint.smAndDown"
                v-model="end"
                type="datetime-local"
                label="End"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-dialog max-width="400" v-model="colorDialog">
                <template #activator="{on}">
                  <v-text-field
                    outlined
                    readonly
                    :value="color ? color.hex : null"
                    v-on="on"
                    label="Color"
                  ></v-text-field>
                </template>
                <v-card class="pa-2">
                  <v-color-picker
                    class="mx-auto"
                    hide-mode-switch
                    hide-inputs
                    mode="hexa"
                    v-model="color"
                  ></v-color-picker>
                  <v-card-actions>
                    <v-btn
                      @click="colorDialog = false"
                      depressed
                      color="primary"
                      small
                      >Confirm</v-btn
                    >
                    <v-spacer />
                    <v-btn
                      @click="
                        color = null;
                        colorDialog = false;
                      "
                      depressed
                      small
                      >Cancel</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-select
                :items="roles"
                :dense="$vuetify.breakpoint.smAndDown"
                v-model="targets"
                :rules="[rules.required]"
                item-value="id"
                item-text="name"
                multiple
                outlined
                type="text"
                label="Target audience"
              ></v-select>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-textarea
                outlined
                rows="3"
                :dense="$vuetify.breakpoint.smAndDown"
                v-model="description"
                :rules="[rules.required]"
                type="text"
                no-resize
                label="Description"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
                min-width="200"
                class="pg text-capitalize text-subtitle-1"
                dark
                type="submit"
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
    addDialog: {
      type: Boolean,
      default: () => false
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      colorDialog: false,
      name: null,
      start: null,
      end: null,
      description: null,
      color: null,
      targets: []
    };
  },
  methods: {
    /**
     * Method used to create an event
     */
    async CreateEvent() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let e = await this.$strapi.create("events", {
          name: this.name,
          start: this.start,
          end: this.end,
          description: this.description,
          color: this.color ? this.color.hex : null,
          targets: this.targets
        });
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Event created."
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.dialog = false;
        this.$emit("EventAdded", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  },
  computed: {
    dialog: {
      get() {
        return this.addDialog;
      },
      set(v) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseAdd", false);
      }
    }
  }
};
</script>

<style></style>
