import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer, Zoom} from 'react-toastify';
import App from "./App";

import {Provider} from 'react-redux';
import store from './redux/store';
import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'


import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/fontawesome/css/all.css'
import './assets/css/style.css'
import './assets/css/responsive.css'
import {QueryClient, QueryClientProvider} from "react-query";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                limit={5}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Zoom}
                // toastStyle={{ background: 'linear-gradient(180deg, #C0A96E 0%, #63512C 100%)'}}
                />
                    <App/>
            </QueryClientProvider>
        </React.StrictMode>
            </PersistGate>
        </Provider>
    </BrowserRouter>
);
