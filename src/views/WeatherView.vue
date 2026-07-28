<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-center mb-4">
          Weather App
        </h1>

        <div
          v-if="loading"
          class="alert alert-info"
        >
          Loading current location weather...
        </div>

        <div
          v-if="errorMessage"
          class="alert alert-danger"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="weatherData"
          class="card shadow-sm"
        >
          <div class="card-body text-center">
            <h2 class="h4">
              {{ weatherData.name }},
              {{ weatherData.sys.country }}
            </h2>

            <img
              v-if="iconUrl"
              :src="iconUrl"
              :alt="weatherDescription"
              width="100"
              height="100"
            />

            <p class="display-5 mb-2">
              {{ temperature }} °C
            </p>

            <p class="text-capitalize mb-2">
              {{ weatherDescription }}
            </p>

            <p class="mb-1">
              <strong>Feels like:</strong>
              {{ feelsLike }} °C
            </p>

            <p class="mb-1">
              <strong>Humidity:</strong>
              {{ weatherData.main.humidity }}%
            </p>

            <p class="mb-0">
              <strong>Source:</strong>
              Browser current location
            </p>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-outline-primary mt-3 w-100"
          :disabled="loading"
          @click="fetchCurrentLocationWeather"
        >
          Refresh Current Location Weather
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import axios from 'axios'

defineOptions({
  name: 'WeatherView',
})

const apiKey =
  import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherData = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const temperature = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return Math.round(
    weatherData.value.main.temp,
  )
})

const feelsLike = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return Math.round(
    weatherData.value.main.feels_like,
  )
})

const weatherDescription = computed(() => {
  return (
    weatherData.value?.weather?.[0]?.description ??
    ''
  )
})

const iconUrl = computed(() => {
  const icon =
    weatherData.value?.weather?.[0]?.icon

  if (!icon) {
    return ''
  }

  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
})

const fetchWeatherByCoordinates = async (
  latitude,
  longitude,
) => {
  const url =
    'https://api.openweathermap.org/data/2.5/weather'

  const response = await axios.get(url, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: apiKey,
      units: 'metric',
    },
  })

  weatherData.value = response.data
}

const fetchCurrentLocationWeather = async () => {
  loading.value = true
  errorMessage.value = ''

  if (!apiKey) {
    errorMessage.value =
      'OpenWeather API key is missing from .env.local.'

    loading.value = false
    return
  }

  if (!navigator.geolocation) {
    errorMessage.value =
      'Geolocation is not supported by this browser.'

    loading.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await fetchWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        )
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message ??
          error.message ??
          'Unable to retrieve weather data.'

        console.error(
          'Current weather API error:',
          error,
        )
      } finally {
        loading.value = false
      }
    },
    (error) => {
      errorMessage.value =
        `Unable to access the current location: ${error.message}`

      loading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    },
  )
}

onMounted(() => {
  fetchCurrentLocationWeather()
})
</script>