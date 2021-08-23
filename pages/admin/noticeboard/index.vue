<template>
  <v-container>
    <br />
    <p class="text--disabled ma-0 text-uppercase">Noticeboard</p>
    <br />
    <v-row>
      <v-col md="3" cols="8">
        <v-text-field
          hide-details="auto"
          placeholder="search"
          class="flex-shrink-1"
          outlined
          v-model.trim="search"
          dense
        ></v-text-field>
      </v-col>
      <v-spacer />
      <v-col md="3" cols="3" class="text-right">
        <v-btn
          @click="addDialog = !addDialog"
          min-width="100"
          dark
          class="pg text-capitalize font-weight-thin flex-grow-0"
          >Add</v-btn
        >
      </v-col>
    </v-row>
    <br />

    <v-row>
      <template v-for="n in FilteredNotices">
        <v-col :key="n.id" cols="11" sm="6" md="4">
          <v-hover v-slot="{ hover }">
            <v-card dark :color="n.color" outlined>
              <v-img
                :gradient="hover ? '180deg, rgba(0,0,0,0.1),rgba(0,0,0,0)' : ''"
                style="background: white"
                :src="n.cover ? noticeImage(n) : '/notice.jpg'"
                max-height="200"
              >
                <template #placeholder>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-progress-circular
                      size="100"
                      class="text-center"
                      color="primary"
                      width="3"
                      indeterminate
                    ></v-progress-circular>
                  </v-row>
                </template>
                <v-slide-y-transition>
                  <v-card-actions v-if="hover">
                    <v-btn
                      @click="setEdit(n)"
                      light
                      elevation="0"
                      color=""
                      fab
                      small
                    >
                      <v-icon color="primary darken-1" size="19">
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      @click="
                        deleteItem = n;
                        deleteDialog = true;
                      "
                      light
                      elevation="0"
                      color=""
                      fab
                      small
                    >
                      <v-icon color="red" size="19">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-slide-y-transition>
              </v-img>
              <v-card-title>
                {{ n.name }}
              </v-card-title>
              <v-card-text>{{ n.description }}</v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>

    <!-- Add Notice -->
    <AdminNoticeboardAdd
      @CloseAdd="addDialog = $event"
      @NoticeAdded="$nuxt.refresh()"
      :addDialog="addDialog"
      :roles="roles"
    />
    <!-- Edit User -->
    <AdminNoticeboardEdit
      @CloseEdit="editDialog = $event"
      @NoticeUpdated="$nuxt.refresh()"
      :editDialog="editDialog"
      :roles="roles"
      :notice="editItem"
    />
    <!-- Dialog used to delete aa notice -->
    <v-dialog
      persistent
      transition="scroll-y-transition"
      max-width="350"
      v-model="deleteDialog"
    >
      <v-card class="pa-3 pt-7">
        <div class="text-center">
          <v-btn elevation="0" dark fab x-large color="red">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <p class="my-3">Confirm Delete</p>
        </div>
        <v-card-text class="text-center my-2">
          Are you sure you want to delete this notice?
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="DeleteNotice" color="red" dark depressed
            >Delete</v-btn
          >
          <v-spacer />
          <v-btn
            @click.stop="
              deleteItem = null;
              deleteDialog = false;
            "
            class="text-capitalize"
            depressed
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $strapi }) {
    try {
      let u = [],
        r = [];
      u = await $strapi.find("notices");
      r = await $strapi.find("users-permissions/roles");
      return { notices: u, roles: r.roles };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      search: "",
      addDialog: false,
      // Delete Vars
      deleteDialog: false,
      deleteItem: null,
      // Edit Vars
      editDialog: false,
      editItem: null
    };
  },
  computed: {
    FilteredNotices() {
      let n = [];
      if (this.notices) {
        n = this.notices.filter(notice => {
          return (
            notice.name.toLowerCase().includes(this.search.toLowerCase()) ||
            notice.description.toLowerCase().includes(this.search.toLowerCase())
          );
        });
      }
      return n;
    }
  },
  methods: {
    /**
     * Used to set the notice that should be edited
     */
    setEdit(i) {
      this.editItem = JSON.parse(JSON.stringify(i));
      this.editDialog = true;
    },
    /**
     * Returns notice cover if one is there
     */
    noticeImage(u) {
      return u.cover ? `${process.env.STRAPI_URL}${u.cover.url}` : null;
    },
    /**
     * Used to delete a notice
     */
    async DeleteNotice() {
      if (!this.deleteItem) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("notices", this.deleteItem.id);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Notice removed."
        });
        this.deleteItem = null;
        this.deleteDialog = false;
        this.$nuxt.refresh();
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
