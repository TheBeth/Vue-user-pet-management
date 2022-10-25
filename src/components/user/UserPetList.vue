<template>
  <tr>
    <td>{{ index + 1 }}</td>
    <td class="text-truncate" style="max-width: 130px">{{ petName }}</td>
    <td>{{ petType }}</td>
    <td>
      <v-btn
        color="red"
        size="x-small"
        icon="mdi-delete"
        @click="deletePet = true"
        :dialog="deletePet"
      ></v-btn>
    </td>
  </tr>

  <v-row justify="center" v-if="spinner">
    <v-dialog v-model="deletePet">
      <base-loading></base-loading>
    </v-dialog>
  </v-row>
  <v-row justify="center">
    <v-dialog v-model="deletePet" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h4 align-center">Leave Pet</span>
        </v-card-title>
        <v-card-text>
          <p>
            Are you to let's {{ petName }} go, if don't sure to let it go you
            can choose Close
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deletePet = false">
            Close
          </v-btn>
          <v-btn
            color="red lighten-3"
            text
            type="submit"
            @click="submitDeletePet"
          >
            Detete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <v-snackbar
    v-model="snackOpen"
    :timeout="2000"
    color="error"
    location="bottom right"
  >
    {{ snackMsg }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackOpen = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import axios from "axios";
import BaseLoading from "@/UI/BaseLoading.vue";
export default {
  components: { BaseLoading },
  props: ["petName", "petType", "id", "index", "userId"],
  data() {
    return {
      deletePet: false,
      snackMsg: "",
      snackOpen: false,
      spinner: false,
    };
  },
  methods: {
    async submitDeletePet() {
      try {
        this.spinner = true;
        const res = await axios.put(
          "http://localhost:8000/users/deletePet/" + this.userId,
          { petId: this.id },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        if (res) {
          this.snackMsg = "Pet Removed";
          this.snackEdit = true;
          this.deletePet = false;
          this.snackOpen = true;
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
        }
        this.spinner = false;
      } catch (err) {
        console.log(err);
        this.snackMsg = err.response.data.message;
        this.deletePet = false;
        this.snackOpen = true;
      } finally {
        this.spinner = false;
      }
    },
  },
};
</script>

<style scoped>
ul {
  padding: 15px;
  width: 170px;
}
li {
  list-style-type: none;
}
.list {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-around;
}
</style>
