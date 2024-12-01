import {List, ListItem, ListItemText, Typography} from "@mui/material";
import React from "react";
import {useMap} from "react-leaflet";

export function MapPointsDrawer({points, setPoint}) {
    const map = useMap()

    return <List sx={{flexGrow: 1, overflowY: 'auto'}}>
        {points.map((point) => (
            <ListItem
                button
                key={point.id}
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
                    setPoint(point)
                    map.setView([point.latitude, point.longitude], 23, { animate: true });
                }}
            >
                <ListItemText
                    primary={
                        <Typography
                            variant="subtitle1"
                            sx={{fontWeight: 600, color: '#37474f'}}
                        >
                            {point.name}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" sx={{color: '#607d8b'}}>
                            Дата: {point.dateTime}
                        </Typography>
                    }
                />
            </ListItem>
        ))}
    </List>
}