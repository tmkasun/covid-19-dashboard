import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';

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

const customMarker = new L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
// https://opencagedata.com/demo

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const VaxMap = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [data, error, isLoading] = useVaccinationCenters();
    const [showDose1, setShowDose1] = useState(true);
    const [showDose2, setShowDose2] = useState(true);
    const [haveVaccine, setHaveVaccine] = useState(true);
    const reset = () => {
        setShowDose1(true);
        setCurrentLocation(null);
        setShowDose2(true);
        setHaveVaccine(true);
    }
    const mapCenter = currentLocation ?
        [currentLocation.coords.latitude, currentLocation.coords.longitude] : [7.79, 80.91]
    const zoom = currentLocation ? 13 : 8

    const filteredData = data && data.filter((center) => {
        const { district } = center;
        if (!district) {
            return false;
        }
        if (!haveVaccine) {
            return true
        }
        const isDose1Available = center.dose1.toLowerCase() === 'true'
        const isDose2Available = center.dose2.toLowerCase() === 'true'
        if (haveVaccine && (!isDose1Available && !isDose2Available)) {
            return false;
        }
        let shouldShow = false;
        if (showDose1 && isDose1Available) {
            shouldShow = true;
        }
        if (showDose2 && isDose2Available) {
            shouldShow = true;
        }
        return shouldShow;
    })
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
        >
            <Grid container
                direction="row"
                justifyContent="center"
                xs={12} sm={4} item>
                <Box my={4} />
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4" gutterBottom>Find COVID-19 Vaccines Near You</Typography>
                    {isLoading && <LinearProgress />}
                </Grid>
                <Grid item xs={12} container spacing={3}>
                    <AreaSelect onLocationChange={setCurrentLocation} />
                </Grid>

                <Grid item xs={12}>
                    <Box my={3} >
                        <Typography variant="h6" component="h6">
                            Show COVID-19 Vaccines
                        </Typography>
                    </Box>
                    <Box>
                        <Checkbox
                            disabled={!haveVaccine}
                            checked={showDose1}
                            onChange={(e) => setShowDose1(e.target.checked)}
                            color="primary"
                            inputProps={{ 'aria-label': 'Dose 2' }}
                        /> 1<sup>st</sup> Dose
                    </Box>
                    <Box>
                        <Checkbox
                            disabled={!haveVaccine}
                            checked={showDose2}
                            onChange={(e) => setShowDose2(e.target.checked)}
                            color="primary"
                            inputProps={{ 'aria-label': 'Dose 2' }}
                        /> 2<sup>nd</sup> Dose
                    </Box>
                    {!showDose1 && !showDose2 && "WTF ?"}
                </Grid>

                <Grid item xs={12}>
                    <Box my={3} >
                        <Typography variant="h6" component="h6">
                            Show Only Locations That
                        </Typography>
                    </Box>
                    <Box>
                        <Checkbox
                            checked={haveVaccine}
                            onChange={(e) => setHaveVaccine(e.target.checked)}
                            color="primary"
                            inputProps={{ 'aria-label': 'Have vaccines' }}
                        /> Have vaccines  available
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box my={3}>
                        <Button style={{ color: '#a20000' }} onClick={reset} >RESET</Button>
                    </Box>
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
                        {filteredData && filteredData.map((vaccineCenter) => (
                            <Marker
                                key={vaccineCenter.fuzzy_key}
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
        </Grid >
    )
}

export default VaxMap