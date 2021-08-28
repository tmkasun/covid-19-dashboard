import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import throttle from 'lodash.throttle';


const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}));

export default function PlaceSelector(props) {
    const { onValueChange } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        onValueChange(value)
    }, [value])
    const fetchX = React.useMemo(
        () =>
            throttle((inputValue, callback) => {
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=47a4473508fc49518ad05cb0d84f94b8&countrycode=lk`)
                    .then(r => r.json()).then(callback)
            }, 200),
        [],
    );

    React.useEffect(() => {



        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }
        if (inputValue.length > 2) {
            fetchX(inputValue, (results) => {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = results.results;
                }

                setOptions(newOptions);
            });
        }

    }, [value, inputValue, fetchX]);

    return (
        <Autocomplete
            id="klocation"
            style={{ width: 500 }}
            getOptionLabel={(option) => option.formatted}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Add a location" variant="outlined" fullWidth />
            )}
            renderOption={(option) => {
                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color="textSecondary">
                                {option.formatted}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}