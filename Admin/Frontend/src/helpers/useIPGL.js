import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useIPGL = () => {
    const [ipAddress, setIpAddress] = useState();
    const [browser,setBrowser] = useState({
        ipAddress   : '',
        lat         : '',
        lon         : '',
    })
    const [location, setLocation] = useState({
        lat: '',
        lon: ''
    });
    const [error, setError] = useState('');


    useEffect(() => {
        axios.get('http://ip-api.com/json/?fields=61439').then((res) => {
            setIpAddress(res.data.query); // Corrected here
            setLocation({
                lat: res.data.lat,
                lon: res.data.lon
            });
            setBrowser({
                ipAddress   : res.data.query,
                lat         : res.data.lat,
                lon         : res.data.lon,
            })
        }).catch(err => {
            setError(err.message);
        });
    }, []);

    return { ipAddress, location, browser, error };
};

export default useIPGL;
