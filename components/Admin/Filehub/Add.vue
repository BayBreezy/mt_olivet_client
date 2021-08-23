<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="500"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Add File</v-card-title>
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
          @submit.prevent="CreateFile"
          lazy-validation
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                outlined
                type="text"
                v-model="name"
                :rules="[rules.required]"
                label="File name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-file-input
                outlined
                multiple
                label="File(s)"
                v-model="files"
                :rules="[rules.required]"
                prepend-icon=""
                append-icon="mdi-file"
              ></v-file-input>
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
      name: null,
      files: null,
      targets: []
    };
  },
  methods: {
    async CreateFile() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let e = await this.$strapi.create("filehubs", {
          name: this.name,
          targets: this.targets
        });

        //create FormData to send data
        let fd = new FormData();
        //Add image to fd
        fd.append("refId", e.id);
        fd.append("ref", "filehub");
        fd.append("field", "files");
        this.files.forEach(f => fd.append("files", f, f.name));

        await this.$strapi.create("upload", fd);

        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "File created."
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.dialog = false;
        this.$emit("FileAdded", false);
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
