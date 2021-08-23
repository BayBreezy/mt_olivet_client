<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="600"
      v-model="dialog"
    >
      <v-card v-if="material" class="pb-4">
        <v-card-title>Edit Item</v-card-title>
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
            <v-col cols="12" class="px-md-2">
              <v-text-field
                v-model.trim="material.item_name"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.number="material.quantity"
                :rules="[rules.required]"
                type="number"
                label="Quantity"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="material.supplier"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Supplier"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="material.date"
                :rules="[rules.required]"
                outlined
                type="date"
                label="Date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-select
                v-model="material.user"
                :rules="[rules.required]"
                outlined
                :items="users"
                item-value="id"
                label="Received By"
              >
                <template #item="{item}">
                  <span>{{ item.firstname + " " + item.lastname }}</span>
                </template>
                <template #selection="{item}">
                  <span>{{ item.firstname + " " + item.lastname }}</span>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-btn
                min-height="42"
                depressed
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
    users: {
      type: Array,
      default: () => []
    },
    material: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dialog: {
      get() {
        return this.editDialog;
      },
      set(v) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseEdit", false);
      }
    }
  },
  methods: {
    /**
     * Method used to edit an material
     */
    async Create() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let e = await this.$strapi.update(
          "materials",
          this.material.id,
          this.material
        );
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Material updated."
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.dialog = false;
        this.$emit("MaterialEdited", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
