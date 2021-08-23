<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="600"
      v-model="dialog"
    >
      <v-card v-if="notice" class="pb-4">
        <v-card-title>Edit Notice</v-card-title>
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
              !notice.cover && !coverUrl
                ? `to top,rgba(255,255,255,1),rgba(255,255,255,0.7)`
                : ''
            "
            :src="
              coverUrl ? coverUrl : notice.cover ? noticeImage() : '/icon.png'
            "
          >
            <p v-if="!coverUrl && !notice.cover" class="my-auto">
              Click to add cover.
            </p>
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
                v-model.trim="notice.name"
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
                    :value="notice.color ? notice.color : notice.color.hex"
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
                v-model="notice.targets"
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
                v-model="notice.description"
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
    roles: {
      type: Array,
      default: () => []
    },
    notice: {
      type: Object,
      default: () => {}
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
    noticeImage() {
      return this.notice.cover
        ? `${process.env.STRAPI_URL}${this.notice.cover.url}`
        : null;
    },
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
        await this.$strapi.update("notices", this.notice.id, this.notice);
        if (this.cover) {
          //create FormData to send data
          let fd = new FormData();
          //Add image to fd
          fd.append("files", this.cover);
          fd.append("refId", this.notice.id);
          fd.append("ref", "notices");
          fd.append("field", "cover");

          await this.$strapi.create("upload", fd);
          this.$store.commit("utils/Set_Overlay", false);
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Notice updated."
        });
        this.dialog = false;
        this.$emit("NoticeUpdated", false);
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
        return this.editDialog;
      },
      set(v) {
        this.cover = this.coverUrl = null;
        this.$emit("CloseEdit", false);
      }
    }
  }
};
</script>
