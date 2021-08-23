<template>
  <v-container>
    <br />
    <p class="text--disabled ma-0 text-uppercase">File Hub</p>
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
    <br />

    <v-row>
      <template v-for="n in FilteredFiles">
        <v-col md="2" cols="6" :key="`fileNumber-${n.id}`">
          <v-menu
            open-on-hover
            :close-on-content-click="false"
            close-delay="200"
            transition="slide-x-transition"
            offset-x
            right
          >
            <template #activator="{on}">
              <div v-on="on">
                <div class="text-center">
                  <v-icon
                    v-ripple="{ class: 'primary--text text--lighten-2' }"
                    class="pa-7 ficon"
                    >{{ fileIcon(n) }}</v-icon
                  >
                </div>
                <p class="text-center text-body-2 mt-3 mb-1">{{ n.name }}</p>
                <p class="text-center text-caption">
                  {{ n.files.length }}
                  {{ n.files.length > 1 ? "Files" : "File" }}
                </p>
              </div>
            </template>
            <v-card flat class="px-2">
              <v-list dense>
                <v-subheader>Files</v-subheader>
                <template v-for="(file, i) in n.files">
                  <v-list-item dense :key="file.id">
                    <v-list-item-action class="d-flex">
                      <v-btn
                        target="_blank"
                        :href="fileDownloadLink(file)"
                        icon
                        color="blue"
                      >
                        <v-icon size="19">mdi-download</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ file.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action class="d-flex">
                      <v-btn @click="removeSingleFile(file)" icon color="red">
                        <v-icon size="19">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="`file-${file.name}-${i}-${file.id}`" />
                </template>
              </v-list>
              <v-card-actions>
                <v-btn
                  @click="
                    $refs.hiddenInputAdd.click();
                    newFilesIndex = n.id;
                  "
                  color="green"
                  dark
                  class="text-capitalize text-body-2"
                >
                  Add Files
                </v-btn>
                <v-spacer />
                <v-btn
                  color="red lighten-2"
                  depressed
                  @click="DeletEntry(n)"
                  dark
                  class="text-capitalize text-body-2"
                >
                  Delete Entry
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </template>
    </v-row>

    <input
      hidden
      type="file"
      multiple
      ref="hiddenInputAdd"
      @change="AddFile"
      @click="$event.target.value = ''"
    />

    <!-- Add File -->
    <AdminFilehubAdd
      :roles="roles"
      @FileAdded="$nuxt.refresh()"
      @CloseAdd="addDialog = $event"
      :addDialog="addDialog"
    />
    <!-- Dialog used to delete a file entry -->
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
          Are you sure you want to delete this course?
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="DeleteCourse" color="red" dark depressed
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
      let filehub = [],
        roles = [];
      filehub = await $strapi.find("filehubs");
      roles = await $strapi.find("users-permissions/roles");
      return { filehub, roles: roles.roles };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      search: "",
      addDialog: false,
      fileMenu: false,
      //Delete item vars
      deleteItem: null,
      deleteDialog: false,
      // Add new file vars
      newFilesIndex: null
    };
  },
  computed: {
    FilteredFiles() {
      let f = [];
      if (this.filehub) {
        f = this.filehub.filter(file =>
          file.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      return f;
    }
  },
  methods: {
    /**
     * Used to return the file icon
     */
    fileIcon(f) {
      let type = f.files[0];
      if (!type) return;
      switch (type.ext) {
        case ".pdf":
          return "mdi-file-pdf";
          break;
        case ".xls":
          return "mdi-microsoft-excel";
          break;
        case ".xlsx":
          return "mdi-microsoft-excel";
          break;
        case ".jpg":
          return "mdi-image";
          break;
        case ".jpeg":
          return "mdi-image";
          break;

        default:
          return "mdi-file-pdf";
          break;
      }
    },
    /**
     * Used to return the download link for a file
     */
    fileDownloadLink(f) {
      return `${process.env.STRAPI_URL}${f.url}`;
    },
    /**
     * Used to add file(s) to the given entry
     */
    async AddFile(e) {
      let files = e.target.files;
      if (!files) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);

        let fd = new FormData();
        //Add image to fd
        fd.append("refId", this.newFilesIndex);
        fd.append("ref", "filehub");
        fd.append("field", "files");
        files.forEach(f => fd.append("files", f, f.name));

        await this.$strapi.create("upload", fd);

        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "File added."
        });
        this.$nuxt.refresh();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    },
    /**
     * Used to remove a single file
     */
    async removeSingleFile(f) {
      if (!f) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("upload/files", f.id);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "File removed."
        });
        this.$nuxt.refresh();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    },
    /**
     * Used to remove an entire entry
     */
    async DeletEntry(f) {
      if (!f) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        //Remove individual files
        for (let i = 0; i < f.files.length; i++) {
          const file = f.files[i];
          await this.removeSingleFile(file);
        }
        //Remove entry
        await this.$strapi.delete("filehubs", f.id);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Entry removed."
        });
        this.$nuxt.refresh();
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
