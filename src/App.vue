<template>
  <v-app>
    <v-main>
      <nav-header></nav-header>
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import NavHeader from "./components/NavHeader.vue";

export default {
  components: { NavHeader },
  data() {
    return {};
  },
};
</script>

<style>
body {
  min-height: 600px;
}
.route-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.route-enter-active {
  transition: all 0.5s ease-out;
}

.route-leave-active {
  transition: all 0.5s ease-in;
}

.route-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.route-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
