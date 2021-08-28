import React, { useEffect,useState } from 'react';
import Papa from "papaparse";

import sample from '../../tests/vax'

export default function useVaccinationCenters() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    useEffect(() => {
        const asyncFun = async () => {
            setIsLoading(true)
            const response = await fetch(
                "https://raw.githubusercontent.com/nuuuwan/covid19/data/covid19.lk_vax_centers.latest.tsv"
            ).catch(setError).finally(() => {
                setIsLoading(false)
            });
            const jsonData = await response.text();
            const parsedData = await Papa.parse(jsonData, {header: true});
            setData(parsedData.data);
        };
        setData(sample);
        // asyncFun();
    }, [])
    return [data, error, isLoading]
}