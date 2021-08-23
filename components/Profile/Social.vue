<template>
  <div>
    <v-form
      v-if="!user.social_media"
      @submit.prevent="UpdateUser"
      class="mt-5 px-3"
      lazy-validation
    >
      <v-row no-gutters>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="facebook"
            label="Facebook"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="twitter"
            label="Twitter"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="instagram"
            label="Instagram"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="tiktok"
            label="TikTok"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="snapchat"
            label="Snapchat"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="youtube"
            label="Youtube"
          ></v-text-field>
        </v-col>

        <v-col cols="7" class="px-md-2">
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
    <v-form
      v-else
      @submit.prevent="UpdateUser"
      class="mt-5 px-3"
      lazy-validation
    >
      <v-row no-gutters>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.social_media.facebook"
            label="Facebook"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.social_media.twitter"
            label="Twitter"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.social_media.instagram"
            label="Instagram"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.social_media.tiktok"
            label="TikTok"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.social_media.snapchat"
            label="Snapchat"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7" class="px-md-2">
          <v-text-field
            outlined
            :dense="$vuetify.breakpoint.smAndDown"
            type="text"
            v-model.trim="user.social_media.youtube"
            label="Youtube"
          ></v-text-field>
        </v-col>

        <v-col cols="7" class="px-md-2">
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
    },
    id: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      valid: true,
      facebook: null,
      twitter: null,
      instagram: null,
      tiktok: null,
      snapchat: null,
      youtube: null
    };
  },
  methods: {
    /**
     * Method used to create the user
     */
    async UpdateUser() {
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let u;
        if (this.user.social_media) {
          u = await this.$strapi.update(
            "social-medias",
            this.user.socila_media.id,
            this.user.social_media
          );
        } else {
          u = await this.$strapi.create("social-medias", {
            facebook: this.facebook,
            twitter: this.twitter,
            instagram: this.instagram,
            tiktok: this.tiktok,
            snapchat: this.snapchat,
            youtube: this.youtube,
            user: this.user.id
          });
        }
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Social Media updated."
        });
        this.$emit("SocialUpdated", true);
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
