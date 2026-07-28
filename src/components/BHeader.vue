<template>
  <div class="container">
    <header class="py-3 border-bottom">
      <ul
        class="
          nav
          nav-pills
          justify-content-center
          gap-1
        "
      >
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

        <li class="nav-item">
          <router-link
            to="/firebase-account"
            class="nav-link"
            active-class="active"
          >
            Account / Logout
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/add-book"
            class="nav-link"
            active-class="active"
          >
            Add Book
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/WeatherCheck"
            class="nav-link"
            active-class="active"
          >
            Get Weather
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            to="/CountBookAPI"
            class="nav-link"
            active-class="active"
          >
            Count Books API
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