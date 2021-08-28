import React, { useState } from 'react';
import NavigationIcon from '@material-ui/icons/Navigation';
import IconButton from '@material-ui/core/IconButton';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import PlaceSelector from './PlaceSelector'

const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -1,
        left: -1,
        zIndex: 1,
    },
}));

export default function AreaSelect(props) {
    const { onLocationChange } = props;
    const [locationStatus, setLocationStatus] = useState(null);
    const [isLocating, setIsLocating] = useState(null);
    const onSelectedLocationChangeHandler = (newLocation) => {
        if (newLocation) {
            const { lat, lng } = newLocation.geometry
            onLocationChange({ coords: { latitude: lat, longitude: lng } })
        }
    }
    const getLocationHandler = () => {
        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            onLocationChange(position);
            setLocationStatus(null)
            setIsLocating(false)
            // const { latitude, longitude } = position.coords;
            // const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=47a4473508fc49518ad05cb0d84f94b8`)
            // const geoData = await response.json()
            // const bestMatch = geoData.results[0];
            // setInputValue(bestMatch.components.town || bestMatch.formatted)
        },
            () => {
                setLocationStatus('Unable to retrieve your location');
                setIsLocating(false)
            });
    }
    const classes = useStyles();
    return (
        <Box justifyContent='center' alignItems='center' display='flex'>
            <PlaceSelector onValueChange={onSelectedLocationChangeHandler} />
            <Box className={classes.wrapper}>
                <IconButton color="primary" onClick={getLocationHandler} aria-label="delete">
                    <NavigationIcon />
                </IconButton>
                {isLocating && <CircularProgress size={35} className={classes.fabProgress} />}
            </Box>
            {isLocating === false && locationStatus && <Box display='block'>
                {locationStatus}
            </Box>}
        </Box>
    );
}