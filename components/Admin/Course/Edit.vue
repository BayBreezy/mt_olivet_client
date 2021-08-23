<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="600"
      v-model="dialog"
    >
      <v-card v-if="course" class="pb-4">
        <v-card-title>Edit Course</v-card-title>
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
              !course.cover && !coverUrl
                ? `to top,rgba(255,255,255,1),rgba(255,255,255,0.7)`
                : ''
            "
            :src="
              coverUrl ? coverUrl : course.cover ? courseImage() : '/icon.png'
            "
          >
            <p v-if="!course.cover && !coverUrl" class="my-auto">
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
          @submit.prevent="CreateCourse"
        >
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="course.course_code"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="course.credits"
                :rules="[rules.required]"
                type="number"
                label="Credits"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                outlined
                v-model.trim="course.name"
                :rules="[rules.required]"
                type="text"
                label="Course name"
              ></v-text-field>
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
    course: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cover: null,
      coverUrl: null
    };
  },
  methods: {
    courseImage() {
      return this.course.cover
        ? `${process.env.STRAPI_URL}${this.course.cover.url}`
        : null;
    },
    /**
     * Handle image upload
     */
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
    async CreateCourse() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.update("courses", this.course.id, this.course);
        if (this.cover) {
          //create FormData to send data
          let fd = new FormData();
          //Add image to fd
          fd.append("files", this.cover);
          fd.append("refId", this.course.id);
          fd.append("ref", "course");
          fd.append("field", "cover");

          await this.$strapi.create("upload", fd);
          this.$store.commit("utils/Set_Overlay", false);
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Course updated."
        });
        this.dialog = false;
        this.$emit("CourseUpdated", false);
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

<style></style>
