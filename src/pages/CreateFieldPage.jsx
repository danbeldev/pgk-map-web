import {
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    Button,
    Box, LinearProgress, Snackbar, Alert,
} from "@mui/material";
import React, {useState} from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {customIcon, LocationFinderDummy} from "./map/Map";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {uploadZipFile} from "../network/PgkMapApi";
import * as PropTypes from "prop-types";
import ErrorIcon from '@mui/icons-material/Error';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";

function CheckCircleIcon(props) {
    return null;
}

CheckCircleIcon.propTypes = {
    color: PropTypes.string,
    sx: PropTypes.shape({mb: PropTypes.number, fontSize: PropTypes.number})
};
const CreateFieldPage = () => {
    const navigate = useNavigate()

    const [file, setFile] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [markers, setMarkers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [name, setName] = useState("")

    const [status, setStatus] = useState("") // Loading, Success, Failed
    const [progress, setProgress] = useState(0)

    // Шаги
    const steps = ["Основная информация", "Добавление местоположений"];

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

// Функция для перехода к следующему шагу
    const handleNext = () => {
        if (activeStep === 0) {
            // Проверка первого шага: обязательные поля
            if (!name || !selectedDate || !file) {
                setAlertMessage('Пожалуйста, заполните все поля');
                setAlertOpen(true);
                return;
            }
        }

        if (activeStep === 1) {
            // Проверка второго шага: минимум 3 маркера
            if (markers.length < 3) {
                setAlertMessage('Пожалуйста, добавьте минимум 3 маркера');
                setAlertOpen(true);
                return;
            }
        }

        setActiveStep((prev) => prev + 1);

        if (activeStep === steps.length - 1) {
            setStatus("Loading");
            setProgress(0);
            uploadZipFile(
                name,
                selectedDate.toISOString().split("T")[0],
                markers.flatMap((marker) => marker),
                file,
                setProgress
            )
                .then((r) => {
                    setStatus("Success");
                })
                .catch((e) => setStatus("Failed"));
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    // Функция для перехода к предыдущему шагу
    const handleBack = () => setActiveStep((prev) => prev - 1);

    // Функция для завершения процесса
    const handleReset = () => setActiveStep(0);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        } else {
            alert("Пожалуйста, выберите файл типа .zip");
        }
    };

    const handleMarkerClick = (index) =>
        setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index));

    const renderStatus = () => {
        switch (status) {
            case "Loading":
                return (
                    <>
                        <Typography variant="h6" gutterBottom>Загрузка...</Typography>
                    </>
                );
            case "Success":
                return (
                    <>
                        <CheckCircleIcon color="success" sx={{fontSize: 50, mb: 2}}/>
                        <Typography variant="h6" gutterBottom>Процесс завершен успешно!</Typography>
                    </>
                );
            case "Failed":
                return (
                    <>
                        <ErrorIcon color="error" sx={{fontSize: 50, mb: 2}}/>
                        <Typography variant="h6" gutterBottom>Процесс завершен с ошибкой!</Typography>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundImage: "linear-gradient(to bottom, #ffffff, #d9e9fc)"
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 700,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                }}
            >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{mt: 4}}>
                    {activeStep === steps.length ? (
                        <Box textAlign="center" sx={{p: 3, width: "100%", maxWidth: 600, margin: "0 auto"}}>
                            {/* Статус загрузки */}
                            {renderStatus()}

                            {/* Если процесс завершен успешно или с ошибкой */}
                            {status !== "Loading" && (

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between', // Располагает кнопки по горизонтали с равным расстоянием между ними
                                        width: '100%',  // Занимает всю доступную ширину
                                        gap: 2,  // Отступы между кнопками
                                        mt: 3,
                                    }}
                                >

                                    {/* Кнопка "Вернуться" с иконкой */}
                                    <Button
                                        onClick={() => navigate('/')}
                                        variant="outlined"
                                        color="secondary"
                                        sx={{
                                            minWidth: 200,
                                            padding: '12px 24px',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            borderRadius: '50px',
                                            boxShadow: 3,
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                boxShadow: 6,
                                                borderColor: 'secondary.main',
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        <ArrowBackIcon sx={{mr: 1}}/>
                                        Вернуться
                                    </Button>

                                    {/* Кнопка "Начать заново" с иконкой */}
                                    <Button
                                        onClick={handleReset}
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            minWidth: 200,
                                            padding: '12px 24px',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            borderRadius: '50px',
                                            boxShadow: 3,
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                boxShadow: 6,
                                                backgroundColor: 'primary.main',
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        <RestartAltIcon sx={{mr: 1}}/>
                                        Начать заново
                                    </Button>


                                </Box>
                            )}

                            {/* Прогресс для статуса "Loading" */}
                            {status === "Loading" && (
                                <LinearProgress variant="determinate" value={progress} sx={{mt: 2}}/>
                            )}
                        </Box>
                    ) : (
                        <Box>
                            {activeStep === 0 && (
                                <Box
                                    sx={{
                                        p: 3,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        backgroundColor: "#f9f9f9",
                                        mb: 3,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom sx={{mb: 2, fontWeight: "bold"}}>
                                        Заполните данные
                                    </Typography>

                                    {/* Поле для названия */}
                                    <TextField
                                        label="Название"
                                        value={name}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{mb: 3}}
                                        onChange={(e) => setName(e.target.value)}
                                    />

                                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}
                                            adapterLocale={ruLocale}
                                            dateFormats={{keyboardDate: "dd.MM.yyyy"}}
                                        >
                                            <DatePicker
                                                label="Выберите дату"
                                                value={selectedDate}
                                                onChange={setSelectedDate}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        size="small"
                                                        sx={{mb: 3}}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>

                                        <Box sx={{display: "flex", alignItems: "center"}}>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                sx={{mr: 2, borderRadius: 2, textTransform: "none"}}
                                            >
                                                Загрузить ZIP файл
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept=".zip"
                                                    onChange={handleFileChange}
                                                />
                                            </Button>
                                            {file && (
                                                <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                    {file.name}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            {activeStep === 1 && (
                                <Box>
                                    <MapContainer
                                        zoom={10}
                                        center={[53.2001, 50.15]}
                                        style={{height: "60vh", width: "100%", borderRadius: 8}}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                        <LocationFinderDummy setMarkers={setMarkers}/>
                                        {markers.map((marker, index) => (
                                            <Marker
                                                key={index}
                                                position={marker}
                                                icon={customIcon}
                                                eventHandlers={{
                                                    click: () => handleMarkerClick(index),
                                                }}
                                            >
                                                <Popup>Точка {index + 1}</Popup>
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                </Box>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 3,
                                }}
                            >
                                <Button
                                    onClick={handleBack}
                                    variant="outlined"
                                    color="secondary"
                                    disabled={activeStep === 0}
                                >
                                    Назад
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    color="primary"
                                    disabled={status === 'Loading'}
                                >
                                    {activeStep === steps.length - 1 ? "Завершить" : "Далее"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                    <Alert onClose={handleAlertClose} severity="warning" sx={{width: "100%"}}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default CreateFieldPage;