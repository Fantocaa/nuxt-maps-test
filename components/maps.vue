<script>
import { defineComponent, ref, onMounted } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";
// import $ from "jquery"; // Import jQuery

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const center = ref({ lat: 0, lng: 0 });
    const markers = ref([]);
    const klikmarker = ref([]);

    const getCurrentLocation = () => {
      if (markers.value.length > 0) {
        // Set the center to the first marker's position
        center.value = markers.value[0].position;
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              center.value = userLocation;
              // markers.value.push({
              //   position: userLocation,
              //   label: "",
              //   title: "Your Location",
              // });
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }
    };

    const formInput = ref({
      // title: "",
      notes: "",
    });

    const handleMapClick = (event) => {
      const clickedPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      markers.value.push({
        position: clickedPosition,
        label: "",
        title: "New Marker",
        showForm: true,
      });

      center.value = clickedPosition;
      klikmarker = [];
      $("#showmarker").hide();
    };

    const handleMarkerClick = (clickedMarker) => {
      const index = markers.value.findIndex(
        (marker) =>
          marker.position.lat === clickedMarker.position.lat &&
          marker.position.lng === clickedMarker.position.lng
      );
      klikmarker.value.push({
        notes: clickedMarker.title,
        showForm: true,
      });
      $("#showmarker").show();
      console.log(klikmarker.value);
    };

    const fetchData = () => {
      // Lakukan permintaan GET ke API menggunakan AJAX
      $.ajax({
        url: "http://api-backend-map-test.test/api/maps",
        type: "GET",
        success: function (data) {
          // Process the data and update the markers
          markers.value = data.map((map) => ({
            position: {
              lat: parseFloat(map.lat), // Convert lat to float
              lng: parseFloat(map.lng), // Convert lng to float
            },
            label: "",
            title: map.notes,
          }));
        },
        error: function (error) {
          console.error("Error fetching data:", error);
        },
      });
    };

    const saveFormData = () => {
      // lat: markers.value[markers.value.length - 1].position.lat,
      // lng: markers.value[markers.value.length - 1].position.lng,
      if (markers.value.length > 0) {
        const lastMarker = markers.value[markers.value.length - 1];

        if (
          lastMarker.position &&
          lastMarker.position.lat &&
          lastMarker.position.lng
        ) {
          const formData = {
            notes: formInput.value.notes,
            lat: lastMarker.position.lat,
            lng: lastMarker.position.lng,
          };

          // Menggunakan Ajax jQuery untuk mengirim data
          $.ajax({
            url: "http://api-backend-map-test.test/api/maps",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
              alert("Data saved:", data);

              markers.value[markers.value.length - 1].showForm = false;
              formInput.value = {
                notes: "",
              };
            },
            error: function (error) {
              console.error("Error saving data:", error);
            },
          });
        } else {
          console.error("Error: Marker position data is incomplete");
        }
      } else {
        console.error("Error: No markers available to save");
      }
    };

    // const setPlace = (place) => {
    //   // Handle place changed event
    //   console.log("Place set:", place);
    //   // You can do something with the place data if needed
    // };

    onMounted(() => {
      fetchData();
      // fetchDataForMarker();
      getCurrentLocation();
      // initAutocomplete();
      $("#showmarker").hide();
    });

    return {
      center,
      markers,
      // input, // Provide the reference to the input element
      handleMapClick,
      handleMarkerClick,
      formInput,
      klikmarker,
      saveFormData,
      // setPlace,
      // initAutocomplete, // Expose initAutocomplete so it can be called later
    };
  },
});
</script>

<template>
  <div class="text-center mx-auto relative h-[1920px]">
    <!-- <div class="absolute z-10 pt-8">
      <h1 class="text-2xl font-semibold pb-2 text-center">Your Coordinate :</h1>
      <p>{{ center.lat }} Latitude, {{ center.lng }} Longitude</p>
    </div> -->
    <GoogleMap
      api-key="AIzaSyBLtF9LaqalS-VgqvjA8o8Jiwg24xRt9zA"
      id="google-map"
      style="width: 100%; height: 100vh"
      :center="center"
      :zoom="5"
      @click="handleMapClick"
    >
      <!-- Menampilkan semua marker dalam array markers -->
      <Marker
        v-for="marker in markers"
        :key="marker.position.lat + marker.position.lng"
        :options="marker"
        @click="() => handleMarkerClick(marker)"
      />
      <!-- @load="initAutocomplete" -->
      <!-- Menampilkan formulir input jika showForm aktif -->
      <!-- <GMapAutocomplete
        placeholder="This is a placeholder"
        @place_changed="setPlace"
      >
      </GMapAutocomplete> -->
      <div
        v-if="markers.length && markers[markers.length - 1].showForm"
        class="absolute z-10 inset-1/2 transform translate-x-8 -translate-y-40"
      >
        <!-- Tambahkan kelas bg-white pada div untuk memberikan latar belakang putih -->
        <div class="bg-white w-72 h-auto rounded-md p-8">
          <form @submit.prevent="saveFormData">
            <label for="notes">Description:</label>
            <textarea
              v-model="formInput.notes"
              id="notes"
              class="w-full mb-2 p-2 border"
            ></textarea>

            <div class="flex gap-4 justify-center">
              <button
                type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                class="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        id="showmarker"
        class="absolute z-10 inset-1/2 transform translate-x-8 -translate-y-40"
        style="display: none"
      >
        <!-- Tambahkan kelas bg-white pada div untuk memberikan latar belakang putih -->
        <div class="bg-white w-72 h-auto rounded-md p-8">
          <form @submit.prevent="saveFormData">
            <label for="notes">Description:</label>
            <textarea id="notes" class="w-full mb-2 p-2 border">{{
              klikmarker != "" ? klikmarker[0].notes : ""
            }}</textarea>

            <div class="flex gap-4 justify-center">
              <button
                type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                class="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </GoogleMap>
  </div>
</template>
