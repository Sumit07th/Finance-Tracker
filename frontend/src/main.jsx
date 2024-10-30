import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {RecoilRoot} from "recoil"; // Ensure Tailwind styles are applied

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RecoilRoot>
        <App />
        </RecoilRoot>
    </React.StrictMode>
);
