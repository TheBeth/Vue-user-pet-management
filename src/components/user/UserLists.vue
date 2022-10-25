<template>
  <div class="item">
    <v-row class="d-flex" justify="center">
      <v-card :elevation="12" outlined class="pa-5 mt-5 mx-3" width="40vw">
        <div>
          <h3>{{ userName }} Detail</h3>
          <p>Firstname : {{ firstName ? firstName : "no data" }}</p>
          <p>Lastname : {{ lastName ? lastName : "no data" }}</p>
          <p>Age : {{ age ? age : "no data" }}</p>

          <v-row>
            <v-col cols="12">
              <v-expansion-panels class="mt-4">
                <v-expansion-panel bg-color="#f0f0f0">
                  <v-expansion-panel-title class="text-button"
                    >Pet List
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-table v-if="havePet.length > 0">
                      <thead>
                        <tr>
                          <th class="text-left">No.</th>
                          <th class="text-left">Name</th>
                          <th class="text-left">Type</th>
                          <th class="text-left">Button</th>
                        </tr>
                      </thead>
                      <tbody>
                        <user-pet-list
                          v-for="(pet, index) in havePet"
                          :key="pet.id"
                          :petName="pet.petName"
                          :petType="pet.petType"
                          :index="index"
                          :id="pet.id"
                          :userId="userId"
                        ></user-pet-list>
                      </tbody>
                    </v-table>
                    <p v-else>You have no pet</p>
                    <v-btn
                      color="purple darken-1"
                      text
                      class="bth-con"
                      dark
                      @click="addPetDialog = true"
                      :dialog="addPetDialog"
                    >
                      Add Pet
                    </v-btn>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </div>

        <!-- Button -->
        <div class="center">
          <v-btn
            color="orange darken-1"
            text
            class="bth-con"
            dark
            @click="editDialog = true"
            :dialog="editDialog"
            >Edit
          </v-btn>
          <v-btn
            color="red lighten-3"
            text
            class="bth-con"
            dark
            @click="deleteDialog = true"
            :dialog="deleteDialog"
            >Delete
          </v-btn>
        </div>
      </v-card>
    </v-row>
  </div>

  <!-- Snack Bar -->
  <v-snackbar
    v-model="snackEdit"
    :timeout="2000"
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

  <!-- Delete User -->

  <v-row justify="center" v-if="spinner">
    <v-dialog v-model="deleteDialog">
      <base-loading></base-loading>
    </v-dialog>
  </v-row>
  <v-row justify="center">
    <v-dialog v-model="deleteDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h4 align-center">Delete User</span>
        </v-card-title>
        <v-card-text>
          <p>
            Are you to delete user "{{ userName }}", if don't sure to delete you
            can choose Close
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">
            Close
          </v-btn>
          <v-btn
            color="red lighten-3"
            text
            type="submit"
            @click="submitDeleteUser"
          >
            Detete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <!-- Edit User -->
  <v-row justify="center" v-if="spinner">
    <v-dialog v-model="editDialog">
      <base-loading></base-loading>
    </v-dialog>
  </v-row>
  <v-row justify="center">
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <form @submit.prevent="submitForm">
        <v-card class="w-500">
          <v-card-title>
            <span class="text-h4 align-center">Edit {{ userName }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="First Name*"
                    v-model="newFirst"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Last Name*"
                    v-model="newLast"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Age"
                    v-model.number="newAge"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>

            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="clearValue">
              Default
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="editDialog = false">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              type="submit"
              :disabled="newFirst == '' && newLast == '' && newAge == ''"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </v-row>

  <v-row justify="center" v-if="spinner">
    <v-dialog v-model="addPetDialog">
      <base-loading></base-loading>
    </v-dialog>
  </v-row>
  <v-row justify="center">
    <v-dialog v-model="addPetDialog" persistent max-width="600px">
      <form @submit.prevent="submitAddPet">
        <v-card class="w-500">
          <v-card-title>
            <span class="text-h4 align-center">Add Pet</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="notOwn"
                    label="Item"
                    item-title="petName"
                    item-value="id"
                    required
                    v-model="newPet.value"
                    :rules="[(v) => !!v || 'Pet is required']"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <p v-if="!this.newPet.isValid" class="err">Pet Type require*</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="newPet.value = ''">
              Clear
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addPetDialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import BaseLoading from "@/UI/BaseLoading.vue";
import UserPetList from "./UserPetList.vue";
export default {
  components: { BaseLoading, UserPetList },
  props: ["userName", "firstName", "lastName", "age", "id", "petName"],
  data() {
    return {
      show: {
        type: Boolean,
        required: true,
      },
      error: null,
      editDialog: false,
      deleteDialog: false,
      deletePet: false,
      addPetDialog: false,
      newFirst: "",
      newLast: "",
      newAge: "",
      newPet: {
        value: "",
        isValid: true,
      },
      formIsValid: true,
      firstNameRules: [(v) => !!v || "Name is required"],
      userNameRules: [(v) => !!v || "Username is required"],
      lastNameRules: [(v) => !!v || "Lastname is required"],
      snackEdit: false,
      havePet: [],
      notOwn: [],
      spinner: false,
      snackMsg: "",
      userId: this.id,
      status: "",
    };
  },
  created() {
    this.fetchPet();
    this.petNotOwn();
  },
  methods: {
    async fetchPet() {
      this.spinner = true;
      try {
        const res = await axios.get(
          "http://localhost:8000/users/getPet/" + this.id,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );

        const resData = res.data.Pets;
        for (let i in resData) {
          let pet = {
            id: resData[i].id,
            petName: resData[i].petName,
            petType: resData[i].petType,
          };
          if (pet) {
            this.havePet.push(pet);
          } else {
            console.log("hello");
          }
        }
        this.havePet = this.havePet.sort((a, b) => {
          return a.id - b.id;
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.spinner = false;
      }
    },
    async petNotOwn() {
      try {
        const res = await axios.get(
          "http://localhost:8000/users/notOwn/" + this.id,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        const resData = res.data.NotOwn;
        return (this.notOwn = resData);
      } catch (err) {
        console.log(err);
      }
    },
    clearValue() {
      this.newFirst = this.firstName;
      this.newLast = this.lastName;
      this.newAge = this.age;
      this.petNotOwn();
    },
    formValidation() {
      this.formIsValid = true;
      if (this.newPet.value === "") {
        this.newPet.isValid = false;
        this.formIsValid = false;
      }
    },
    async submitForm() {
      try {
        this.spinner = true;

        const formData = {
          firstName: this.newFirst,
          lastName: this.newLast,
          age: this.newAge,
        };
        const res = await axios.put(
          "http://localhost:8000/users/" + this.id,
          formData,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        if (res) {
          console.log(res);
          console.log(formData);
          this.status = "success";
          this.snackMsg = "User Edited";
          this.editDialog = false;
          this.snackEdit = true;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        this.snackEdit = true;
        this.snackMsg = err.response.data.message;
      } finally {
        setTimeout(() => {
          this.spinner = false;
        });
      }
    },
    async submitAddPet() {
      try {
        this.spinner = true;
        this.formValidation();
        if (!this.formIsValid) {
          return;
        }
        const formSubmit = {
          petId: this.newPet.value,
        };

        const res = await axios.put(
          "http://localhost:8000/users/addPet/" + this.id,
          formSubmit,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        if (res) {
          this.spinner = false;
          this.status = "success";
          this.snackMsg = "Pet Added";
          this.snackEdit = true;
          this.addPetDialog = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.log(err);
        this.snackMsg = err.response;
        this.snackEdit = true;
      } finally {
        console.log("...");
      }
    },
    async submitDeleteUser() {
      try {
        this.spinner = true;
        const res = await axios.delete(
          "http://localhost:8000/users/" + this.id,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }
        );
        if (res) {
          this.status = "error";
          this.snackMsg = "User Deleted";
          this.snackEdit = true;
          this.deleteDialog = false;
        }
      } catch (err) {
        console.log(err, 34);
        this.snackMsg = "error";
        this.snackEdit = true;
      } finally {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.spinner = false;
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
  margin: 30px auto;
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
ul {
  padding-bottom: 20px;
}
.err {
  color: red;
}
.center {
  display: flex;
  margin-top: 5px;
  float: right;
}
.basic {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
