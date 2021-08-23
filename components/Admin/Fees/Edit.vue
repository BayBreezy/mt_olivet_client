<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="600"
      v-model="dialog"
    >
      <v-card v-if="fee" class="pb-4">
        <v-card-title>Edit Fee</v-card-title>
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
          @submit.prevent="Create"
          lazy-validation
        >
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="fee.name"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.number="fee.amount"
                :rules="[rules.required]"
                type="number"
                label="Amount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-textarea
                outlined
                rows="3"
                v-model="fee.description"
                :rules="[rules.required]"
                type="text"
                no-resize
                label="Description"
              ></v-textarea>
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
    editDialog: {
      type: Boolean,
      default: () => false
    },
    fee: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      name: null,
      amount: null,
      description: null
    };
  },
  computed: {
    dialog: {
      get() {
        return this.editDialog;
      },
      set(v) {
        this.$emit("CloseEdit", false);
      }
    }
  },
  methods: {
    /**
     * Method used to create an event
     */
    async Create() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let e = await this.$strapi.update("fees", this.fee.id, this.fee);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Fee updated."
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.dialog = false;
        this.$emit("FeeUpdated", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
