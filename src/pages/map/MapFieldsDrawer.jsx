// MapFieldsDrawer

import {List, ListItem, ListItemText, Typography} from "@mui/material";
import React from "react";
import {useMap} from "react-leaflet";

export function getCoordinatesBorders(borders) {
    const totalLat = borders.reduce((sum, border) => sum + border.latitude, 0);
    const totalLon = borders.reduce((sum, border) => sum + border.longitude, 0);

    // Среднее значение широты и долготы
    const centerLat = totalLat / borders.length;
    const centerLon = totalLon / borders.length;

    return { centerLat, centerLon };
}

export function MapFieldsDrawer({fields, setField}) {
    const map = useMap()

    const handleFieldClick = (field) => {
        // Вычисление центра поля на основе координат
        if (field.borders && Array.isArray(field.borders)) {
            const coordinates = getCoordinatesBorders(field.borders)

            // Если карта существует, устанавливаем центр
            if (map && (!isNaN(coordinates.centerLat) && !isNaN(coordinates.centerLon))) {
                map.setView([coordinates.centerLat, coordinates.centerLon], 13, { animate: true });
            }
        }

        // Вызываем setField, чтобы обновить состояние поля
        setField(field);
    };

    return <List sx={{flexGrow: 1, overflowY: 'auto'}}>
        {fields.map((f) => (
            <ListItem
                button
                key={f.id}
                sx={{
                    borderRadius: '8px',
                    marginBottom: '8px',
                    transition: 'background-color 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#e3f2fd',
                    }
                }}
                onClick={() => {
                    handleFieldClick(f)
                }}
            >
                <ListItemText
                    primary={
                        <Typography
                            variant="subtitle1"
                            sx={{fontWeight: 600, color: '#37474f'}}
                        >
                            {f.name}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" sx={{color: '#607d8b'}}>
                            Дата: {f.date}
                        </Typography>
                    }
                />
            </ListItem>
        ))}
    </List>
}