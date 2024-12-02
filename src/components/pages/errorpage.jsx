import React from 'react'
import { useRouteError } from 'react-router-dom';

export default function Errorpage() {
    const error = useRouteError();
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Oops!</h1>
            <p>Something went wrong.</p>
            {error && (
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            )}
            <a href="/">Go to Home </a>
        </div>
    )
}
