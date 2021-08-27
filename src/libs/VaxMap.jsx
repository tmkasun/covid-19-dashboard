import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AreaSelect from './components/AreaSelect'
import './css/map.css'
const customMarker = new L.divIcon({ html: '<div class="pin"></div> <div class="pin-effect"></div>' });

// https://opencagedata.com/demo

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const VaxMap = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState(null);
    const getLocationHandler = () => {

        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation(position);
            setLocationStatus(null)
        },
            () => setLocationStatus('Unable to retrieve your location'));
    }
    const mapCenter = currentLocation ?
        [currentLocation.coords.latitude, currentLocation.coords.longitude] : [51.505, -0.09]
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={4}
        >
            <Grid container
                direction="row"
                justifyContent="center"
                xs={12} sm={5} item>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4" gutterBottom>Find COVID-19 Vaccines Near You</Typography>
                </Grid>
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={6}>
                        <AreaSelect getLocationHandler={getLocationHandler} />
                    </Grid>
                    <Grid item xs={6}>
                        dsada
                    </Grid>
                </Grid>
            </Grid>

            <Grid xs={12} sm={7} item>
                {locationStatus}
                <Box border={0} boxShadow={3}>
                    <MapContainer style={{ overflow: 'hidden', height: '90vh' }} center={mapCenter} zoom={13} scrollWheelZoom={false}>
                        <ChangeView center={mapCenter} zoom={13} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            icon={customMarker}
                            position={[51.505, -0.09]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                        <Marker
                            icon={customMarker}
                            position={[51.507, -0.08]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
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