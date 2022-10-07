<template>
  <div>
    <div class="d-flex justify-center align-center mt-4">
      <h1>Pet Manager</h1>
    </div>

    <v-row justify="center" v-if="spinner">
      <v-dialog v-model="dialog">
        <base-loading></base-loading>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ attrs }">
          <v-btn
            color="blue brighten-4"
            dark
            v-bind="attrs"
            @click="dialog = true"
            :dialog="dialog"
          >
            New Pet
          </v-btn>
        </template>
        <form @submit.prevent="submitForm">
          <v-card class="w-500">
            <v-card-title>
              <span class="text-h4 align-center">Add new Pet</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Pet Name*"
                      required
                      v-model="petName.value"
                      :rules="petNameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="petType.value"
                      :items="types"
                      :rules="[(v) => !!v || 'Type is required']"
                      label="Type*"
                      required
                    ></v-select>
                    <p class="err" v-if="!this.petType.isValid">
                      You must to choose pet type
                    </p>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
              <p class="err" v-if="!formIsValid">Form is Invalid</p>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue darken-1" text @click="clearValue">
                Clear
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </v-dialog>
    </v-row>

    <v-snackbar
      v-model="snackNewPet"
      :timeout="3000"
      color="success"
      location="bottom right"
    >
      {{ snackMsg }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackNewPet = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-row justify="center">
      <v-card class="mt-6" width="600" variant="outlined">
        <v-col cols="12">
          sort :
          <v-btn
            class="ma-2"
            @click="sortId"
            :color="sort === 'id' ? '#90CAF9' : 'white'"
            size="x-small"
            >Id</v-btn
          >
          <v-btn
            class="ma-1"
            @click="sortName"
            :color="sort === 'name' ? '#90CAF9' : 'white'"
            size="x-small"
            >Name</v-btn
          >
          <v-btn
            class="ma-1"
            @click="sortType"
            :color="sort === 'type' ? '#90CAF9' : 'white'"
            size="x-small"
            >Type</v-btn
          >
          <v-spacer></v-spacer>
          filter :
          <v-btn
            class="ma-1"
            @click="filterTypeDog"
            :color="filterType === 'Dog' ? '#90CAF9' : 'white'"
            size="x-small"
            >Dog</v-btn
          >
          <v-btn
            class="ma-1"
            @click="filterTypeCat"
            :color="filterType === 'Cat' ? '#90CAF9' : 'white'"
            size="x-small"
            >Cat</v-btn
          >
          <v-btn
            class="ma-1"
            @click="filterTypeBird"
            :color="filterType === 'Bird' ? '#90CAF9' : 'white'"
            size="x-small"
            >Bird</v-btn
          >
          <v-btn
            class="ma-1"
            @click="filterTypeFish"
            :color="filterType === 'Fish' ? '#90CAF9' : 'white'"
            size="x-small"
            >Fish</v-btn
          >
          <v-btn
            class="ma-1"
            @click="filterTypeMouse"
            :color="filterType === 'Mouse' ? '#90CAF9' : 'white'"
            size="x-small"
            >Mouse</v-btn
          >
          <div v-if="pets.length === 0">
            <v-row justify="center">
              <base-loading v-if="spinner"></base-loading>
              <div class="text-h6 mt-7" v-else>No Pet Data</div>
            </v-row>
          </div>
          <v-table v-else height="400px">
            <thead>
              <tr>
                <th class="text-left">No.</th>
                <th class="text-left">Name</th>
                <th class="text-left">Type</th>
                <th class="text-center">Button</th>
              </tr>
            </thead>

            <!-- sort Name -->
            <tbody v-if="sort == 'name'">
              <pet-lists
                v-for="(pet, index) in pets"
                :key="pet.id"
                :index="index"
                :id="pet.id"
                :petName="pet.petName"
                :petType="pet.petType"
              ></pet-lists>
            </tbody>
            <!-- sort id -->
            <tbody v-else-if="sort == 'id'">
              <pet-lists
                v-for="(pet, index) in sortById"
                :key="pet.id"
                :index="index"
                :id="pet.id"
                :petName="pet.petName"
                :petType="pet.petType"
              ></pet-lists>
            </tbody>
            <!-- sort type -->
            <tbody v-else-if="sort == 'type'">
              <pet-lists
                v-for="(pet, index) in sortByType"
                :key="pet.id"
                :index="index"
                :id="pet.id"
                :petName="pet.petName"
                :petType="pet.petType"
              ></pet-lists>
            </tbody>
            <!-- Filter Pet -->
            <tbody v-else-if="filterType">
              <pet-lists
                v-for="(pet, index) in filter"
                :key="pet.id"
                :index="index"
                :id="pet.id"
                :petName="pet.petName"
                :petType="pet.petType"
              ></pet-lists>
            </tbody>
          </v-table>
        </v-col>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import PetLists from "../components/pets/PetLists.vue";
import axios from "axios";
import BaseLoading from "@/UI/BaseLoading.vue";

export default {
  components: { PetLists, BaseLoading },
  data() {
    return {
      snackNewPet: false,
      dialog: false,
      petName: {
        value: "",
        isValid: true,
      },
      petType: {
        value: "",
        isValid: true,
      },
      formIsValid: true,
      types: ["Dog", "Cat", "Bird", "Fish", "Mouse"],
      petNameRules: [(v) => !!v || "Pet Name is required"],
      petTypeRules: [(v) => !!v || "Pet type is required"],
      pets: [],
      spinner: false,
      snackMsg: "",
      sort: "",
      filterType: "",
      color: "primary",
    };
  },
  methods: {
    clearValue() {
      this.petName.value = "";
      this.petType.value = "";
      this.petType.isValid = true;
      this.formIsValid = true;
      console.log(this.filterType);
    },
    formValiditor() {
      this.formIsValid = true;
      if (this.petType.value === "") {
        this.petType.isValid = false;
        this.formIsValid = false;
      }
    },
    async submitForm() {
      try {
        this.formValiditor();
        if (!this.formIsValid) {
          return;
        }
        this.spinner = true;

        const formData = {
          petName: this.petName.value,
          petType: this.petType.value,
        };
        const res = await axios.post("http://localhost:8000/pets", formData);
        if (res) {
          this.dialog = false;
          this.snackMsg = "Pet Created";
          this.snackNewPet = true;
          this.$router.push("pet");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        console.log(err);
        this.snackMsg = err.response.data.message;
        this.snackNewPet = true;
      } finally {
        this.spinner = false;
      }
    },
    async fetchData() {
      this.spinner = true;
      const res = await axios.get("http://localhost:8000/pets");
      const resData = res.data.Items;
      for (let i in resData) {
        let pet = {
          id: resData[i].id,
          petName: resData[i].petName,
          petType: resData[i].petType,
        };
        this.pets.push(pet);
      }
      // this.pets = this.pets.sort((a, b) => {
      //   return a.id - b.id;
      // });
      function compare(a, b) {
        if (a.petName < b.petName) return -1;
        if (a.petName > b.petName) return 1;
        return 0;
      }
      if (resData.length > 0) {
        this.sort = "id";
      } else {
        this.sort = "";
      }

      this.filterType = "";
      this.spinner = false;
      return this.pets.sort(compare);
    },
    sortName() {
      this.sort = "name";
      this.filterType = "";
    },
    sortId() {
      this.sort = "id";
      this.filterType = "";
    },
    sortType() {
      this.sort = "type";
      this.filterType = "";
    },
    filterTypeDog() {
      this.sort = "";
      this.filterType = "Dog";
    },
    filterTypeCat() {
      this.sort = "";
      this.filterType = "Cat";
    },
    filterTypeBird() {
      this.sort = "";
      this.filterType = "Bird";
    },
    filterTypeFish() {
      this.sort = "";
      this.filterType = "Fish";
    },
    filterTypeMouse() {
      this.sort = "";
      this.filterType = "Mouse";
      this.color = "red";
    },
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    sortById() {
      return this.pets.map((item) => item).sort((a, b) => a.id - b.id);
    },
    sortByType() {
      function compare(a, b) {
        if (a.petType < b.petType) return -1;
        if (a.petType > b.petType) return 1;
        return 0;
      }
      return this.pets.map((item) => item).sort(compare);
    },
    filter() {
      return this.pets
        .map((item) => item)
        .filter((item) => item.petType === this.filterType);
    },
  },
};
</script>

<style scoped>
h1 {
  margin: 10px auto;
}

.err {
  color: red;
}

.w-500 {
  width: 500px;
}
</style>
