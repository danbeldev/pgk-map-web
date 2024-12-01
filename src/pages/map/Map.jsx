// MapComponent.js
import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, useMapEvents, Polyline, Polygon, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {getAllFields, getFieldById} from "../../network/PgkMapApi";
import {Box, Button, Drawer, IconButton, TextField, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {MapFieldsDrawer} from "./MapFieldsDrawer";
import {MapPointsDrawer} from "./MapPointsDrawer";
import {MapPointDrawer} from "./MapPointDrawer";
import {useParams} from "react-router-dom";

export const LocationFinderDummy = ({setMarkers}) => {
    useMapEvents({
        click(e) {
            setMarkers((prevMarkers) => [...prevMarkers, [e.latlng.lat, e.latlng.lng]]);
        },
    });
    return null;
};

export const customIcon = new L.Icon({
    iconUrl: 'dot.png',
    iconSize: [25, 25],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapComponent = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const latitude = queryParams.get("lat") || undefined
    const longitude = queryParams.get("lon") || undefined
    const fieldId = queryParams.get("fieldId") || undefined

    const [searchQuery, setSearchQuery] = useState("");

    const [field, setField] = useState(null)
    const [point, setPoint] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const [fields, setFields] = useState([])

    const position = [latitude === undefined ? 53.2001 : latitude, latitude === undefined ? 50.15 : longitude];

    useEffect(() => {
        requestGetAllFields()
    }, [])

    useEffect(() => {
        if (fieldId !== undefined) {
            handlePolygonClick(fieldId)
        }
    }, [fieldId])

    const requestGetAllFields = () => {
        getAllFields(searchQuery).then(data => {
            setFields(data.content)
        }).catch(e => console.log(e))
    }

    const handlePolygonClick = (id) => {
        getFieldById(id).then(data => setField(data))
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(open);
    };

    return (
        <Box display="flex">
            <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 999,
                    color: '#fff',
                    backgroundColor: 'rgba(25,118,210,0.7)',
                    '&:hover': {
                        backgroundColor: '#115293',
                    },
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    width: 48,
                    height: 48,
                }}
            >
                <MenuIcon fontSize="large" />
            </IconButton>

            <MapContainer
                center={position}
                zoom={12}
                style={{height: "100vh", width: "100%"}}
                zoomControl={false}
            >
                <Drawer
                    anchor="left"
                    open={isOpen}
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 300, // Ширина панели
                            backgroundColor: '#f4f6f8', // Цвет фона
                            padding: '16px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Тень
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                        role="presentation"
                    >
                        {/* Заголовок */}
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#1976d2',
                                borderBottom: '2px solid #1976d2',
                                paddingBottom: '8px',
                                marginBottom: '16px',
                            }}
                        >
                            { field === null ? 'Поля' : field.name  }
                        </Typography>

                        { field === null && point === null &&
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                                <TextField
                                    label="Поиск"
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            requestGetAllFields()
                                        }
                                    }}
                                    sx={{
                                        marginBottom: '8px',
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#607d8b',
                                        fontSize: '0.875rem',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    Нажмите Enter для поиска
                                </Typography>
                            </Box>
                        }

                        {/* Список */}
                        { field === null &&
                            <MapFieldsDrawer fields={fields} setField={(f) => handlePolygonClick(f.id)} />
                        }

                        { field !== null && point === null &&
                            <MapPointsDrawer points={field.points} setPoint={setPoint}/>
                        }

                        { point !== null &&
                            <MapPointDrawer point={point}/>
                        }

                        {/* Нижняя часть с кнопкой */}
                        <Box
                            sx={{
                                marginTop: 'auto',
                                borderTop: '1px solid #ddd',
                                paddingTop: '16px',
                                paddingBottom: '20px',
                                textAlign: 'center',
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    if (point !== null)
                                        setPoint(null)
                                    else if (field !== null)
                                        setField(null)
                                    else
                                        setIsOpen(false)
                                }}
                                sx={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                }}
                            >
                                {field === null ? 'Закрыть' : 'Назад'}
                            </Button>
                        </Box>
                    </Box>
                </Drawer>


                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {field && field.points.map((point, index) => {
                    return (
                        <Marker
                            key={index}
                            icon={customIcon}
                            position={[point.latitude, point.longitude]}
                            eventHandlers={{
                                click: () => {
                                    setPoint(point)
                                    setIsOpen(true)
                                }
                            }}
                        />
                    );
                })}

                {field && Array.isArray(field.borders) && field.borders.length > 0 && (
                    (() => {
                        const positions = field.borders.map(border => [border.latitude, border.longitude]);
                        return (
                            <Polyline
                                key={field.id}
                                positions={[...positions, positions[0]]} // замкнутый контур
                            />
                        );
                    })()
                )}

                {field === null && fields.map(field => {
                    if (Array.isArray(field.borders) && field.borders.length > 0) {
                        const positions = field.borders.map(border => [border.latitude, border.longitude]);

                        return (
                            <Polygon
                                key={field.id}
                                positions={[...positions, positions[0]]}
                                eventHandlers={{
                                    click: (e) => {
                                        handlePolygonClick(field.id)
                                    }
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </Box>
    );
};

export default MapComponent;