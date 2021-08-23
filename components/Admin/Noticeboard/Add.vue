<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="600"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Add Notice</v-card-title>
        <v-btn
          @click="dialog = false"
          icon
          absolute
          style="top: 10px; right:5px"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
        <br />
        <input
          hidden
          type="file"
          ref="hiddenInput"
          accept=".png, .jpg, .jpeg"
          @change="AddImage"
          @click="$event.target.value = ''"
        />
        <v-avatar
          style="border: solid grey 1px; cursor: pointer;"
          size="120"
          class="mx-auto d-block"
          @click="$refs.hiddenInput.click()"
        >
          <v-img
            :gradient="
              !coverUrl
                ? `to top,rgba(255,255,255,1),rgba(255,255,255,0.7)`
                : ''
            "
            :src="coverUrl ? coverUrl : '/icon.png'"
          >
            <p v-if="!coverUrl" class="my-auto">Click to add cover.</p>
          </v-img>
        </v-avatar>
        <div class="text-center my-3">
          <v-btn @click="$refs.hiddenInput.click()" elevation="0" fab small>
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </div>
        <v-form
          class="mt-5 px-3"
          lazy-validation
          ref="form"
          @submit.prevent="CreateNotice"
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                v-model.trim="name"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Notice Title"
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
                label="Message"
              ></v-textarea>
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
      color: null,
      colorDialog: false,
      cover: null,
      coverUrl: null,
      description: null,

      targets: []
    };
  },
  methods: {
    async AddImage(e) {
      let file = e.target.files[0];
      if (!file) return;
      //Check if the file is image
      if (!file.type.match("image/")) return;
      let reader = new FileReader();
      this.cover = file;
      reader.onload = e => {
        this.coverUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    /**
     * Method used to create a course
     */
    async CreateNotice() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.create("notices", {
          name: this.name,
          targets: this.targets,
          color: this.color ? this.color.hex : null,
          description: this.description
        });
        if (this.cover) {
          //create FormData to send data
          let fd = new FormData();
          //Add image to fd
          fd.append("files", this.cover);
          fd.append("refId", d.id);
          fd.append("ref", "notices");
          fd.append("field", "cover");

          await this.$strapi.create("upload", fd);
          this.$store.commit("utils/Set_Overlay", false);
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Notice created."
        });
        this.dialog = false;
        this.$emit("NoticeAdded", false);
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
        return this.addDialog;
      },
      set(v) {
        this.cover = this.coverUrl = null;
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseAdd", false);
      }
    }
  }
};
</script>
