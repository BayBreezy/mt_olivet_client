<template>
  <v-container>
    <br />
    <p class="text--disabled ma-0 text-uppercase">Events</p>
    <br />
    <v-row>
      <v-col md="3" sm="6" cols="12">
        <v-btn @click.stop="prev()" color="grey" plain fab outlined small>
          <v-icon color="primary">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          color="grey"
          min-height="42"
          outlined
          @click="setToday"
          class="text-capitalize mx-1"
        >
          Today
        </v-btn>
        <v-btn @click.stop="next()" color="grey" plain fab outlined small>
          <v-icon color="primary">mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col md="3" sm="6" cols="12" class="text-right d-flex">
        <v-select
          v-model="calendarType"
          outlined
          dense
          class="mr-2 text-capitalize"
          hide-details="auto"
          :items="['day', 'week', 'month']"
        ></v-select>
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
      <v-calendar
        :type="calendarType"
        :events="calendarEvents"
        ref="calendar"
        :event-height="40"
        @click:event="showEvent"
        @click:day="addDialog = true"
        @click:date="addDialog = true"
        v-model="calendarFocus"
        color="primary"
      ></v-calendar>
    </v-card>

    <!-- Menu used to show selected event -->
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
      transition="scroll-x-transition"
      left
      offset-y
      bottom
    >
      <v-card color="grey lighten-4" min-width="350" max-width="500" flat>
        <v-toolbar
          flat
          dark
          :color="selectedEvent.color ? selectedEvent.color : ''"
        >
          <v-container class="ma-0 pa-0" fluid>
            <v-row align="center">
              <v-col cols="2">
                <v-btn @click="setEdit" icon>
                  <v-icon size="19">
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="8">
                <p class="text-truncate ma-0">
                  {{ selectedEvent.name }}
                </p>
              </v-col>
              <v-col cols="2">
                <v-btn
                  @click="
                    deleteItem = selectedEvent;
                    deleteDialog = true;
                  "
                  icon
                >
                  <v-icon size="19">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
        <v-card-text>
          <p style="white-space: pre;">{{ selectedEvent.description }}</p>
          <span class="text-caption">
            <span class="primary--text">
              Start:
            </span>
            {{ $dayjs(selectedEvent.start).format("MMMM D, YYYY h:mmA") }}</span
          >
          <br />
          <span class="text-caption">
            <span class="secondary--text">
              End:
            </span>
            {{ $dayjs(selectedEvent.end).format("MMMM D, YYYY h:mmA") }}</span
          >
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="text-capitalize"
            text
            @click="
              selectedOpen = false;
              selectedEvent = {};
            "
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <!-- Add Event -->
    <AdminEventAdd
      :roles="roles"
      @EventAdded="$nuxt.refresh()"
      @CloseAdd="addDialog = $event"
      :addDialog="addDialog"
    />
    <!-- Update Event -->
    <AdminEventEdit
      :roles="roles"
      :event="editItem"
      @EventUpdated="$nuxt.refresh()"
      @CloseEdit="editDialog = $event"
      :editDialog="editDialog"
    />
    <!-- Dialog used to delete an event -->
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
          Are you sure you want to delete this event?
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="DeleteEvent" color="red" dark depressed
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
      let events = [],
        roles = [];
      events = await $strapi.find("events");
      roles = await $strapi.find("users-permissions/roles");
      return { events, roles: roles.roles };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      addDialog: false,
      calendarType: "month",
      calendarFocus: "",
      // Show event vars
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      editDialog: false,
      editItem: null,
      // Delete Vars
      deleteDialog: false,
      deleteItem: null
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  computed: {
    calendarEvents() {
      let e = [];
      if (this.events) {
        e = JSON.parse(JSON.stringify(this.events));
        e.forEach(ev => {
          ev.start = this.$dayjs(ev.start).format("YYYY-MM-DD H:mm");
          ev.end = this.$dayjs(ev.end).format("YYYY-MM-DD H:mm");
        });
      }
      return e;
    }
  },
  methods: {
    setToday() {
      this.calendarFocus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    setEdit() {
      //get event from original object
      let ev = this.events.filter(e => e.id === this.selectedEvent.id)[0];
      ev.start = this.$dayjs(ev.start).format("YYYY-MM-DDTHH:mm");
      ev.end = this.$dayjs(ev.end).format("YYYY-MM-DDTHH:mm");
      this.editItem = JSON.parse(JSON.stringify(ev));
      this.editDialog = true;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = JSON.parse(JSON.stringify(event));
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    /**
     * Used to delete an event
     */
    async DeleteEvent() {
      if (!this.deleteItem) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.delete("events", this.deleteItem.id);
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Set_Snack", {
          show: true,
          color: "green",
          text: "Event removed."
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
