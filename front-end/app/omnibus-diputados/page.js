"use server"

import Representatives from "../components/representatives";
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

function App() {
    return (
        <PrimeReactProvider>
            <Representatives />
        </PrimeReactProvider>
    );
}

export default App;