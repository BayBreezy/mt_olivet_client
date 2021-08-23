<template>
  <v-container>
    <br />
    <p class="text--disabled ma-0 text-uppercase">Fees</p>
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

    <v-card outlined>
      <v-data-table :items="fees" :search="search" :headers="headers">
        <template #item.action="{item}">
          <v-btn @click="setEdit(item)" icon small>
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            @click="
              deleteItem = item;
              deleteDialog = true;
            "
            icon
            small
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add Fee -->
    <AdminFeesAdd
      @FeeAdded="$nuxt.refresh()"
      @CloseAdd="addDialog = $event"
      :addDialog="addDialog"
    />
    <!-- Update Fee -->
    <AdminFeesEdit
      @FeeUpdated="$nuxt.refresh()"
      @CloseEdit="editDialog = $event"
      :editDialog="editDialog"
      :fee="editItem"
    />

    <!-- Dialog used to delete a course -->
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
          Are you sure you want to delete this fee?
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="DeleteFee" color="red" dark depressed
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
      let u = [];
      u = await $strapi.find("fees");
      return { fees: u };
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    setEdit(i) {
      this.editItem = JSON.parse(JSON.stringify(i));
      this.editDialog = true;
    },
    /**
     * Used to remove a fee
     */
    async DeleteFee() {
      if (!this.deleteItem) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("fees", this.deleteItem.id);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Fee removed."
        });
        this.deleteItem = null;
        this.deleteDialog = false;
        this.$nuxt.refresh();
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error.response);
      }
    }
  },
  data() {
    return {
      search: "",
      addDialog: false,
      //Edit vars
      editDialog: false,
      editItem: null,
      // Delete vars
      deleteItem: null,
      deleteDialog: false,
      headers: [
        {
          text: "Name",
          value: "name",
          divider: true,
          align: "center"
        },
        {
          text: "Amount",
          value: "amount",
          divider: true,
          align: "center"
        },
        {
          text: "Description",
          value: "description",
          divider: true,
          align: "center",
          sortable: false
        },
        {
          text: "Action",
          value: "action",
          divider: true,
          sortable: false,
          align: "center"
        }
      ]
    };
  }
};
</script>

<style></style>
