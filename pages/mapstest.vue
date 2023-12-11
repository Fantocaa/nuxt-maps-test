<script>
import { defineComponent, ref, onMounted } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker },
  // emits: ["tilt_changed"], // Declare the necessary events here
  setup() {
    const center = ref({ lat: 0, lng: 0 });
    const markers = ref([]);
    const klikmarker = ref([]);
    const selectedMarker = ref(null);

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
      klikmarker.value = [];
      $("#showmarker").hide();
    };

    const handleMarkerClick = (clickedMarker) => {
      const index = markers.value.findIndex(
        (marker) =>
          marker.position.lat === clickedMarker.position.lat &&
          marker.position.lng === clickedMarker.position.lng
      );

      // Check if the clicked marker has an ID
      if (!markers.value[index].id) {
        // Marker does not have an ID, remove it directly
        markers.value.splice(index, 1);
      } else {
        selectedMarker.value = {
          id: markers.value[index].id, // Add the id property
          notes: clickedMarker.notes,
          showForm: true,
        };
        $("#showmarker").show();
      }
    };

    const fetchData = async () => {
      try {
        const response = await $.ajax({
          url: "http://api-backend-map-test.test/api/maps",
          type: "GET",
        });

        markers.value = response.map((map) => ({
          position: {
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lng),
          },
          id: map.id,
          label: "",
          notes: map.notes,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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

    const editSaveFormData = async () => {
      try {
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

            const response = await fetch(
              "http://api-backend-map-test.test/api/maps/edit",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              }
            );

            if (response.ok) {
              const data = await response.json();
              alert("Data saved:", data);

              markers.value[markers.value.length - 1].showForm = false;
              formInput.value = {
                notes: "",
                lat: "",
                lng: "",
              };
            } else {
              console.error(
                "Error saving data. Server returned:",
                response.status
              );
            }
          } else {
            console.error("Error: Marker position data is incomplete");
          }
        } else {
          console.error("Error: No markers available to save");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    const deleteSaveFormData = async () => {
      try {
        if (selectedMarker.value && selectedMarker.value.id) {
          const response = await fetch(
            `http://api-backend-map-test.test/api/maps/delete/${selectedMarker.value.id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            const data = await response.json();
            alert("Data deleted:", data);

            // Remove the marker from the markers array
            const index = markers.value.findIndex(
              (marker) => marker.id === selectedMarker.value.id
            );
            markers.value.splice(index, 1);

            // Hide the showmarker element
            $("#showmarker").hide();
          } else {
            console.error(
              "Error deleting data. Server returned:",
              response.status
            );
          }
        } else {
          console.error("Error: No marker selected for deletion");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    };

    const setPlace = (place) => {
      // Handle place changed event
      const selectedPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      // console.log("Place set:", place);
      center.value = selectedPosition;
      // You can do something with the place data if needed
    };

    const closeShowMarker = () => {
      // if (markers.value.length > 0) {
      //   // Remove the last marker from the array
      //   markers.value.pop();

      //   // Set showForm to false for the last marker
      //   markers.value[markers.value.length - 1].showForm = false;
      // }

      if (markers.value.length > 0) {
        const lastMarker = markers.value[markers.value.length - 1];

        if (lastMarker.id) {
          // If the marker has an id, only hide the form
          lastMarker.showForm = false;
        } else {
          // If the marker doesn't have an id, remove it from the array
          markers.value.pop();

          // Set showForm to false for the new last marker
          if (markers.value.length > 0) {
            markers.value[markers.value.length - 1].showForm = false;
          }
        }
      }

      // Hide the showmarker element
      $("#showmarker").hide();
    };

    onMounted(async () => {
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
      editSaveFormData,
      setPlace,
      selectedMarker,
      deleteSaveFormData,
      closeShowMarker, // Expose selectedMarker
    };
  },
});
</script>

<template>
  <div class="text-center mx-auto relative">
    <!-- <div class="absolute z-10 pt-8">
      <h1 class="text-2xl font-semibold pb-2 text-center">Your Coordinate :</h1>
      <p>{{ center.lat }} Latitude, {{ center.lng }} Longitude</p>
    </div> -->
    <GMapMap
      api-key="AIzaSyBLtF9LaqalS-VgqvjA8o8Jiwg24xRt9zA"
      id="google-map"
      style="width: 100%; height: 100vh"
      :center="center"
      :zoom="7"
      @click="handleMapClick"
    >
      <GMapMarker
        :clickable="true"
        v-for="marker in markers"
        :key="marker.position.lat + marker.position.lng"
        :options="marker"
        @click="() => handleMarkerClick(marker)"
      />
      <!-- Menampilkan semua marker dalam array markers -->
      <div class="absolute right-24 top-8">
        <GMapAutocomplete
          placeholder="Search"
          @place_changed="setPlace"
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        >
        </GMapAutocomplete>
      </div>
      <!-- Menampilkan formulir input jika showForm aktif -->
      <div
        v-if="markers.length && markers[markers.length - 1].showForm"
        class="absolute z-10 inset-1/2 transform translate-x-8 -translate-y-40"
      >
        <!-- Tambahkan kelas bg-white pada div untuk memberikan latar belakang putih -->
        <div class="bg-white w-72 h-auto rounded-md p-8 relative">
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
          <div class="absolute top-0 right-1">
            <button
              @click="closeShowMarker"
              class="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
            >
              X
            </button>
          </div>
        </div>
      </div>
      <div
        id="showmarker"
        v-if="selectedMarker"
        class="absolute z-10 inset-1/2 transform translate-x-8 -translate-y-40"
        style="display: none"
      >
        <!-- Tambahkan kelas bg-white pada div untuk memberikan latar belakang putih -->
        <div class="bg-white w-72 h-auto rounded-md p-8 relative">
          <form @submit.prevent="editSaveFormData">
            <label for="notes">Description:</label>
            <!-- v-model="formInput.notes" -->
            <textarea
              v-if="selectedMarker"
              id="notes"
              class="w-full mb-2 p-2 border"
              >{{ selectedMarker.notes }}</textarea
            >

            <!-- {{ klikmarker != "" ? klikmarker[0].notes : "" }} -->

            <div class="flex gap-4 justify-center">
              <button
                type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
            </div>
            <button
              @click="deleteSaveFormData"
              type="button"
              class="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Delete
            </button>
          </form>
          <div class="absolute top-0 right-1">
            <button
              @click="closeShowMarker"
              class="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </GMapMap>
  </div>
</template>
