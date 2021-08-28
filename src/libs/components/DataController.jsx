import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import StyledSelect from "../StyledSelect";


const DataController = (props) => {
    const {
        dataType,
        setDataType,
        lastXDays,
        setLastXDays,
    } = props;
    return (
        <>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    onChange={(e) => {
                        setDataType(e.currentTarget.value);
                    }}
                    value={dataType}
                    defaultValue="total"
                >
                    <FormControlLabel
                        value="total"
                        control={<Radio color="secondary" />}
                        label="Total"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        value="Dose1"
                        control={<Radio color="secondary" />}
                        label={
                            <>
                                1<sup>st</sup> Dose
                            </>
                        }
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        value="dose2"
                        control={<Radio color="secondary" />}
                        label={
                            <>
                                2<sup>nd</sup> Dose
                            </>
                        }
                        labelPlacement="top"
                    />
                </RadioGroup>
            </FormControl>
            <StyledSelect lastXDays={lastXDays} setLastXDays={setLastXDays} />
        </>
    )
}


export default DataController