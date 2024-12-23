// let mapToken = mapBoxToken;

// console.log(mapToken);

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(coordinates);

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({
    color: "red",
})
.setLngLat(listing.geometry.coordinates)   // Coordinates of the location (Listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({
        offset: 25,     
    })
    .setHTML(
        `<h5>${listing.title}</h5><p>Exact location will be provided after booking.</p>`
    )
    .setMaxWidth("300px")
)
.addTo(map);