<template>
  <div class="container">
    <header class="py-3 border-bottom">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link"
            exact-active-class="active"
          >
            Home
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/about"
            class="nav-link"
            active-class="active"
          >
            About
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/firebase-register"
            class="nav-link"
            active-class="active"
          >
            Firebase Register
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/firebase-signin"
            class="nav-link"
            active-class="active"
          >
            Firebase Sign In
          </router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
defineOptions({
  name: 'BHeader',
})
</script>