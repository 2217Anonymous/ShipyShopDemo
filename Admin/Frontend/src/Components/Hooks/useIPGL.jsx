import axios from 'axios';
import { useEffect, useState } from 'react';

const useIPGL = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [browser, setBrowser] = useState({
        ipAddress: '',
        lat: '',
        lon: '',
    });
    const [location, setLocation] = useState({
        lat: '',
        lon: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://ip-api.com/json/?fields=61439')
            .then((res) => {
                setIpAddress(res.query);
                setLocation({
                    lat: res.lat,
                    lon: res.lon,
                });
                setBrowser({
                    ipAddress: res.query,
                    lat: res.lat,
                    lon: res.lon,
                });
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    return { ipAddress, location, browser, error };
};

export default useIPGL;
