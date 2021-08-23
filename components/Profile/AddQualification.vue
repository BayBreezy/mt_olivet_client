<template>
  <div>
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="500"
      v-model="dialog"
    >
      <v-card class="pb-4">
        <v-card-title>Add Qualification</v-card-title>
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
          lazy-validation
          ref="form"
          @submit.prevent="CreateQual"
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-md-2">
              <v-text-field
                v-model.trim="subject"
                :rules="[rules.required]"
                outlined
                type="text"
                label="Subject"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="award_type"
                outlined
                type="text"
                label="Award"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="award_date"
                outlined
                :rules="[rules.required]"
                type="date"
                label="Award Date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="grade"
                outlined
                type="text"
                :rules="[rules.required]"
                label="Grade"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-md-2">
              <v-text-field
                v-model.trim="exam_body"
                outlined
                :rules="[rules.required]"
                type="text"
                label="Exam Body"
              ></v-text-field>
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
    addQualificationDialog: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      subject: null,
      award_type: null,
      award_date: null,
      grade: null,
      exam_body: null
    };
  },
  methods: {
    /**
     * Method used to create a course
     */
    async CreateQual() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let d = await this.$strapi.create("qualifications", {
          subject: this.subject,
          award_type: this.award_type,
          award_date: this.award_date,
          grade: this.grade,
          exam_body: this.exam_body,
          user: this.id
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Record added."
        });
        this.dialog = false;
        this.$emit("QualificationAdded", false);
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
        return this.addQualificationDialog;
      },
      set(v) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseAddQual", false);
      }
    }
  }
};
</script>

<style></style>
