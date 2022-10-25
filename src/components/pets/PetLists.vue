<template>
  <tr>
    <td>
      <h4>{{ index + 1 }}</h4>
    </td>
    <td>
      <h4 class="text-truncate" style="max-width: 150px">
        {{ petName ? petName : "no data" }}
      </h4>
    </td>
    <td>
      <h4>{{ petType ? petType : "no data" }}</h4>
    </td>
    <td class="d-flex justify-space-around">
      <v-btn
        icon="mdi-pencil"
        size="small"
        color="orange darken-1"
        text
        class="bth-con"
        dark
        @click="editDialog = true"
        :dialog="editDialog"
      >
      </v-btn>
      <v-btn
        icon="mdi-delete"
        size="small"
        color="red lighten-3"
        text
        class="bth-con"
        dark
        @click="deleteDialog = true"
        :dialog="deleteDialog"
      >
      </v-btn>
    </td>
  </tr>

  <v-row justify="center" v-if="spinner">
    <v-dialog v-model="editDialog">
      <base-loading></base-loading>
    </v-dialog>
  </v-row>
  <v-dialog v-else v-model="editDialog" persistent max-width="600px">
    <form @submit.prevent="submitForm">
      <v-card class="w-500">
        <v-card-title>
          <span class="text-h4 align-center">Edit {{ petName }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="newPetType.value"
                  :items="types"
                  :rules="[(v) => !!v || 'Type is required']"
                  label="Pet Type*"
                  required
                ></v-select>
                <p class="err" v-if="!this.newPetType.isValid">
                  You must to choose pet type
                </p>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
            :disabled="newPetType.value === ''"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>

  <v-snackbar
    v-model="snackEdit"
    :timeout="5000"
    :color="
      status == 'success' ? 'success' : status == 'error' ? 'error' : 'warning'
    "
    location="bottom right"
  >
    {{ snackMsg }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackEdit = false"> Close </v-btn>
    </template>
  </v-snackbar>

  <v-row justify="center" v-if="spinner">
    <v-dialog v-model="deleteDialog">
      <base-loading></base-loading>
    </v-dialog>
  </v-row>
  <v-dialog v-model="deleteDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h4 align-center">Delete Pet</span>
      </v-card-title>
      <v-card-text>
        <p>
          Are you to delete user
          <span class="text-truncate" style="max-width: 150px"
            >"{{ petName }}"</span
          >, if don't sure to delete you can choose Close
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="deleteDialog = false">
          Close
        </v-btn>
        <v-btn color="red lighten-3" text type="submit" @click="submitDelete">
          Detete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import BaseLoading from "@/UI/BaseLoading.vue";
export default {
  components: { BaseLoading },
  props: ["petName", "petType", "index", "id"],
  data() {
    return {
      formIsValidate: true,
      deleteDialog: false,
      editDialog: false,
      types: ["Dog", "Cat", "Fish", "Mouse", "Bird"],
      newPetType: {
        value: "",
        isValid: true,
      },
      snackEdit: false,
      snackMsg: "",
      spinner: false,
      snackColor: "",
      status: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        this.spinner = true;
        const res = await axios.put(
          "http://localhost:8000/pets/" + this.id,
          {
            petType: this.newPetType.value,
          },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        if (res) {
          this.status = "success";
          this.editDialog = false;
          this.snackMsg = "Pet Edited";
          this.snackEdit = true;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        this.snackEdit = true;
        this.snackMsg = err.response.data.message;
        console.log(err);
      } finally {
        this.spinner = false;
      }
    },
    async submitDelete() {
      try {
        this.spinner = true;
        const res = await axios.delete(
          "http://localhost:8000/pets/" + this.id,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        if (res) {
          this.status = "error";
          this.snackMsg = "Pet Deleted";
          this.deleteDialog = false;
          this.snackEdit = true;
        }
      } catch (err) {
        this.snackEdit = true;
        this.snackMsg = err.response.data.message;
      } finally {
        setTimeout(() => {
          window.location.reload();
          this.spinner = false;
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  width: 40%;
  align-items: center;
  margin: 10px auto;
  padding: 5px;
}
.bth-con {
  display: grid;
  margin: 3px;
}
.w-500 {
  width: 500px;
}
p {
  margin-left: 20px;
}
li {
  padding: 5px;
}
.err {
  color: red;
}
</style>
