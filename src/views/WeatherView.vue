<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-7">
        <h1 class="text-center mb-4">
          Weather App
        </h1>

        <form
          class="input-group mb-3"
          @submit.prevent="searchByCity"
        >
          <input
            v-model.trim="city"
            type="text"
            class="form-control"
            placeholder="Enter city, for example Clayton, AU"
            aria-label="City"
          />

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          class="btn btn-outline-secondary w-100 mb-4"
          :disabled="loading"
          @click="fetchCurrentLocationWeather"
        >
          Use Current Location
        </button>

        <div
          v-if="loading"
          class="alert alert-info"
        >
          Loading weather...
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

            <p
              v-if="searchedLocation"
              class="text-muted"
            >
              Search result:
              {{ searchedLocation }}
            </p>

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
              <strong>Coordinates:</strong>
              {{ weatherData.coord.lat }},
              {{ weatherData.coord.lon }}
            </p>
          </div>
        </div>
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

const city = ref('')
const weatherData = ref(null)
const searchedLocation = ref('')
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

const checkApiKey = () => {
  if (apiKey) {
    return true
  }

  errorMessage.value =
    'OpenWeather API key is missing from .env.local.'

  return false
}

const fetchWeatherByCoordinates = async (
  latitude,
  longitude,
) => {
  const response = await axios.get(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: 'metric',
      },
    },
  )

  weatherData.value = response.data
}

const searchByCity = async () => {
  errorMessage.value = ''
  searchedLocation.value = ''

  if (!checkApiKey()) {
    return
  }

  if (!city.value) {
    errorMessage.value =
      'Please enter a city name.'

    return
  }

  loading.value = true

  try {
    const geocodingResponse =
      await axios.get(
        'https://api.openweathermap.org/geo/1.0/direct',
        {
          params: {
            q: city.value,
            limit: 1,
            appid: apiKey,
          },
        },
      )

    if (
      !Array.isArray(geocodingResponse.data) ||
      geocodingResponse.data.length === 0
    ) {
      throw new Error(
        'No matching city was found.',
      )
    }

    const location =
      geocodingResponse.data[0]

    searchedLocation.value = [
      location.name,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(', ')

    await fetchWeatherByCoordinates(
      location.lat,
      location.lon,
    )
  } catch (error) {
    weatherData.value = null

    errorMessage.value =
      error.response?.data?.message ??
      error.message ??
      'Unable to search for the city.'

    console.error(
      'City weather search error:',
      error,
    )
  } finally {
    loading.value = false
  }
}

const fetchCurrentLocationWeather = () => {
  errorMessage.value = ''
  searchedLocation.value = ''

  if (!checkApiKey()) {
    return
  }

  if (!navigator.geolocation) {
    errorMessage.value =
      'Geolocation is not supported by this browser.'

    return
  }

  loading.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await fetchWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        )

        searchedLocation.value =
          'Current browser location'
      } catch (error) {
        weatherData.value = null

        errorMessage.value =
          error.response?.data?.message ??
          error.message ??
          'Unable to retrieve current weather.'

        console.error(
          'Current weather error:',
          error,
        )
      } finally {
        loading.value = false
      }
    },
    (error) => {
      errorMessage.value =
        `Unable to access current location: ${error.message}`

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