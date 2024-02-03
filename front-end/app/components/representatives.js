"use client";
import React, { useEffect, useState } from "react";
import WhatsappIcon from "../assets/WhatsAppIcon.png";
import TwitterIcon from "../assets/TwitterIcon.png";
import FacebookIcon from "../assets/FacebookIcon.png";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
        
export default function Representatives() {
    const [currentUrl, setCurrentUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    useEffect(() => {
		document.title = "Agorar | Omnibus-Diputados";
	}, []);

    const [representatives, setRepresentatives] = useState([]);

    useEffect(() => {
        fetchRepresentatives();
    }, []);

    const fetchRepresentatives = async () => {
        try {
            const response = await fetch("https://agorar-fb7184e25907.herokuapp.com/representatives");
            if (!response.ok) {
				throw new Error("Failed to fetch representatives");
			}
			const data = await response.json();
            setRepresentatives(data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching representatives:', error);
        }
    };

    const [party] = useState(['Por Santa Cruz', 'Hacemos Coalicion Federal', 'Union Por La Patria', 'Ucr - Union Civica Radical', 'Pro', 'La Libertad Avanza', 'Produccion Y Trabajo', 'La Union Mendocina', 'Innovacion Federal', 'Independencia', 'Hacemos Coalicion Federal', 'Frente De Izquierda Y De Trabajadores Unidad', 'Creo', 'Buenos Aires Libre', 'Avanza Libertad']);

    const [statuses] = useState(['NEGATIVO', 'AFIRMATIVO', 'PRESIDENTE', 'AUSENTE']);

    const getSeverity = (status) => {
        switch (status) {
            case 'NEGATIVO':
                return 'danger';

            case 'AFIRMATIVO':
                return 'success';

            case 'PRESIDENTE':
                return 'info';

            case 'AUSENTE':
                return 'warning';
        }
    };

    const representativeBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.party}</span>
            </div>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const vote = rowData.vote;
        return <Tag value={vote} severity={getSeverity(vote)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const representativeRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={party}
                itemTemplate={representativesItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="nombre"
                placeholder="Todos"
                className="p-column-filter"
                style={{ minWidth: '14rem' }}
            />
        );
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Selecciona uno" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };
    
    return (
        <main className="flex min-h-screen flex-col bg-[#F3F6F9]">
            <div className="flex flex-row px-8 py-4 justify-center">
                <span className="font-vidaloka text-white text-4xl bg-[#38485C] px-2 py-1">
                Agorar
                </span>
            </div>
            <div className="flex flex-row justify-center text-[#8F8F8F] font-bold gap-6 text-center">
                <a href="/omnibus-tematicas" className={"hover:text-[#404040]"}>
                Ley Omnibus: Temáticas
                </a>
                <a href="/" className={"hover:text-[#404040]"}>
                DNU
                </a>
                <a
                href="/omnibus-diputados"
                className="text-[#38485C]"
                >
                Ley Omnibus: Diputados
                </a>
            </div>
            <div className="flex flex-row justify-center gap-6 mt-4">
                <a
                    href={`whatsapp://send?text=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus%20-%20${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={WhatsappIcon.src} alt="Compartir en WhatsApp" />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={TwitterIcon.src} alt="Compartir en Twitter" />
                </a>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=Estado%20de%20las%20temáticas%20del%20mega%20DNU%20y%20la%20Ley%20Ómnibus`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={FacebookIcon.src} alt="Compartir en Facebook" />
                </a>
            </div>
            <DataTable value={representatives} dataKey="id" filterDisplay="row" loading={loading} style={{ backgroundColor: 'white', marginTop: '5rem', marginBottom: '5rem', marginLeft: '10%', marginRight: '10%'}}
                    globalFilterFields={['name', 'party', 'state', 'vote']} emptyMessage="No se encontraron resultados.">       
                <Column header="Partido" filterField="party" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
                <Column field="name" header="Nombre" filter filterPlaceholder="Busca por nombre" style={{ minWidth: '12rem' }} />
                <Column field="state" header="Provincia" filter filterPlaceholder="Busca por provincia" style={{ minWidth: '12rem' }} />
                <Column field="vote" header="Voto" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            </DataTable>
        </main>
    );
}