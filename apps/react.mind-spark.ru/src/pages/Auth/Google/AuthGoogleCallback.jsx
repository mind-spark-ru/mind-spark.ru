import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthGoogleCallback(){
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    const code = searchParams.get('code');

    useEffect(()=> {
        console.log(1)
        console.log(code)
        if (code){
            fetch('http://localhost:8000/v1/google/callback', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code : code })
            })
            .then(response => {
                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json()
            })
            .then((data) =>{
                try{
                    fetch(`http://localhost:8000/v1/users/email/${data.email}`, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response =>{
                        if (response.ok){
                            try{
                                //***************************
                            }catch(error){
                                setError(error);
                            }
                        }else if (response.status == 404){
                            try{
                                fetch(`http://localhost:8000/v1/users/`, {
                                    method: 'POST',
                                    mode: 'cors',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ 
                                        email: data.email,
                                        username: "NoName", 
                                        password: "",
                                        fullname: data.name
                                    })
                                })
                                .then(response => {
                                    console.log(data)
                                })

                            }catch(error){
                                setError(error);
                            }
                        }else{
                            setError("Error");
                        }
                    })
                }catch(error){
                    setError(error);
                }
                })
            .catch(error => {
                setError(error);
            });
        }else{
            setError('No Auth data')
        }
    }, [code]);
    if (error) return <div>{error}</div>;

    return 1
}