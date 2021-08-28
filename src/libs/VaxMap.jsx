import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AreaSelect from './components/AreaSelect'
import useVaccinationCenters from './hooks/useVaccinationCenters'
import MarkerCard from './components/MarkerCard'
import './css/map.css'
import "leaflet/dist/leaflet.css";

const getMarker = (vaccineCenter) => {
    const isDose1Available = vaccineCenter.dose1.toLowerCase() === 'true'
    const isDose2Available = vaccineCenter.dose2.toLowerCase() === 'true'
    let pinClass = 'pin-oneavailable'
    let pinEffectClass = 'pin-oneavailable-effect'

    if (!(isDose1Available || isDose2Available)) {
        pinClass = 'pin-notavailable'
        pinEffectClass = 'pin-notavailable-effect'
    } else if ((isDose1Available && isDose2Available)) {
        pinClass = "pin";
        pinEffectClass = "pin-effect";
    }
    return new L.divIcon({ html: `<div class="${pinClass}"></div> <div class="${pinEffectClass}"></div>` })
}

const customMarker = new L.divIcon({ html: '<div class="pin"></div> <div class="pin-effect"></div>' })
// https://opencagedata.com/demo

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const VaxMap = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [data, error, isLoading] = useVaccinationCenters();

    const mapCenter = currentLocation ?
        [currentLocation.coords.latitude, currentLocation.coords.longitude] : [7.79, 80.91]
    const zoom = currentLocation ? 13 : 8
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={4}
        >
            <Grid item sm={1} />
            <Grid container
                direction="row"
                justifyContent="center"
                xs={12} sm={4} item>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4" gutterBottom>Find COVID-19 Vaccines Near You</Typography>
                </Grid>
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={6}>
                        <AreaSelect onLocationChange={setCurrentLocation} />
                    </Grid>
                    <Grid item xs={6}>
                        dsada
                    </Grid>
                </Grid>
            </Grid>

            <Grid xs={12} sm={7} item>
                <Box border={0} boxShadow={3}>
                    <MapContainer zoomControl style={{ overflow: 'hidden', height: '90vh' }} center={mapCenter} zoom={zoom} scrollWheelZoom>
                        <ChangeView center={mapCenter} zoom={zoom} />
                        <TileLayer
                            url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
                            accessToken='pk.eyJ1IjoidG1rYXN1biIsImEiOiJlNmZhOTYwNGJlODcxYWE5YjNmYjYzZmJiM2NlZWM4YiJ9.UT41ORairJ1PQ7woCnCH-A'
                            id='mapbox/streets-v11'
                            tileSize={512}
                            zoomOffset={-1}
                        />
                        {data && data.slice(0, 30).map((vaccineCenter) => (
                            <Marker
                                icon={getMarker(vaccineCenter)}
                                position={[vaccineCenter.lat, vaccineCenter.lng]}>
                                <Popup>
                                    <MarkerCard vaccineCenter={vaccineCenter} />
                                </Popup>
                            </Marker>
                        )
                        )}
                        {currentLocation &&
                            <Marker
                                icon={customMarker}
                                position={mapCenter}>
                                <Popup>
                                    Current location
                                </Popup>
                            </Marker>}
                    </MapContainer>
                </Box>
            </Grid>
        </Grid>
    )
}

export default VaxMap