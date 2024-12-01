import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Avatar, Grid } from '@mui/material';

export function MapPointDrawer({ point }) {
    return (
        <Card sx={{ width: '100%', maxWidth: 400, margin: '16px auto' }}>
            <CardContent>
                {/* Заголовок */}
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {point.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {new Date(point.dateTime).toLocaleString()}
                </Typography>

                {/* Изображение */}
                <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                        alt="Point Image"
                        src={point.image}
                        sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => window.open(point.image, '_blank')}
                    />
                </Box>

                {/* Разделитель */}
                <Divider sx={{ my: 2 }} />

                {/* Информация о точке */}
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Latitude:</strong> {point.latitude}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Longitude:</strong> {point.longitude}
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Altitude:</strong> {point.altitude} m
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Speed GPS:</strong> {point.speedGPS} km/h
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Rotate GPS:</strong> {point.rotateGPS}°
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Roll:</strong> {point.roll}°
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Pitch:</strong> {point.pitch}°
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>vRef:</strong> {point.vRef} m/s
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Time of Flight:</strong> {point.timeFly} sec
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Altitude PVD:</strong> {point.altitudePVD} m
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Speed PVD:</strong> {point.speedPVD} km/h
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.primary">
                            <strong>Num Foto 1:</strong> {point.numFoto1}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}