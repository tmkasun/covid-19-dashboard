import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
//https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=[YOUR_LAT],[YOUR_LNG]
// https://www.vaccines.gov/search/
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

/**
 * {
    "district": "Gampaha",
    "police": "Gampaha",
    "center": "Oruthota Community Hall",
    "dose1": "False",
    "dose2": "False",
    "fuzzy_key": "GMPHGMPHRTHTCMMNTYHLL",
    "alt_name": "",
    "district_name_norm": "Gampaha",
    "district_id": "LK-12",
    "district_lat": "7.123598",
    "district_lng": "80.018508",
    "ps_name_norm": "Gampaha",
    "ps_id": "PS-120237",
    "ps_lat": "7.087765",
    "ps_lng": "80.01228",
    "lat": "7.082963",
    "lng": "79.986759",
    "formatted_address": "Orutota Rd, Gampaha, Sri Lanka",
    "dis_center_to_police": "2.867209",
    "tags": "",
    "district_si": "ගම්පහ",
    "police_si": "ගම්පහ",
    "center_si": "ඔරුතොට ප්‍රජා ශාලාව",
    "district_ta": "கம்பஹா",
    "police_ta": "கம்பஹா",
    "center_ta": "ஒருத்தோட சமுதாயக் கூடம்",
    "formatted_address_si": "ඔරුතොට පාර, ගම්පහ, ශ්‍රී ලංකාව",
    "formatted_address_ta": "ஒருதோட்டா வீதி, கம்பஹா, இலங்கை"
}
 * @param {*} props 
 * @returns 
 */
export default function MarkerCard(props) {
    const { vaccineCenter } = props;
    const classes = useStyles();
    const isDose1Available = vaccineCenter.dose1.toLowerCase() === 'true'
    const isDose2Available = vaccineCenter.dose2.toLowerCase() === 'true'
    return (
        <Box className={classes.root}>
            <Box>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Center
                </Typography>
                <Box ml={3}>
                    <Typography variant="h6" component="h6">
                        <code>{vaccineCenter.center}</code>
                    </Typography>
                </Box>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Address
                </Typography>
                <Box ml={3}>
                    <Typography variant="h6" component="h6">
                        <code>{vaccineCenter.formatted_address}</code>
                    </Typography>
                </Box>
                <Typography className={classes.pos} color="textSecondary">
                    Available Vaccines
                </Typography>
                <Box ml={3}>
                    <Typography variant="body2" component="p">
                        1<sup>st</sup> Dose <Checkbox
                            checked={isDose1Available}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </Typography>
                    <Typography variant="body2" component="p">
                        2<sup>nd</sup> Dose<Checkbox
                            checked={isDose2Available}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </Typography>
                </Box>
            </Box>
            <CardActions>
                <Link
                    target="_blank"
                    rel="noopener"
                    href={`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${vaccineCenter.lat},${vaccineCenter.lng}`}>
                    <Button variant='outlined' color='primary' size="small">Directions</Button>
                </Link>
            </CardActions>
        </Box >
    );
}