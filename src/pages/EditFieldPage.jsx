import {useNavigate, useParams} from "react-router-dom";
import {Box, Button, Paper, TextField, Typography, Alert, CircularProgress} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import React, {useState} from "react";
import {updateFieldById} from "../network/PgkMapApi";

const EditFieldPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const navigate = useNavigate();

    const {id} = useParams();
    const [selectedDate, setSelectedDate] = useState(() => {
        const date = queryParams.get("date");
        return date ? new Date(date) : null;
    });
    const [name, setName] = useState(queryParams.get("name") || "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");  // Для общей ошибки формы

    const fieldSave = () => {
        if (!name || !selectedDate) {
            setFormError("Пожалуйста, заполните все поля.");
            return;
        }

        setLoading(true);
        setError("");  // Очистить ошибку перед новым запросом
        setFormError("");  // Очистить ошибку формы

        updateFieldById(id, name, selectedDate.toISOString().split('T')[0])  // Передайте нужные данные в функцию
            .then(() => {
                setLoading(false);
                navigate('/');
            })
            .catch((err) => {
                setLoading(false);
                setError("Ошибка при сохранении данных. Пожалуйста, попробуйте снова.");
                console.error(err);  // Можно добавить логирование ошибки
            });
    }

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
                        required  // Сделать поле обязательным
                        error={!name}  // Показывать ошибку, если поле пустое
                        helperText={!name ? "Это поле обязательно для заполнения" : ""}
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
                                        required  // Сделать поле обязательным
                                        error={!selectedDate}  // Показывать ошибку, если дата не выбрана
                                        helperText={!selectedDate ? "Это поле обязательно для заполнения" : ""}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={fieldSave}
                            disabled={loading}  // Отключаем кнопку, если идет загрузка
                        >
                            {loading ? <CircularProgress size={24} /> : "Сохранить"}
                        </Button>
                    </Box>

                    {/* Показать ошибку формы, если она есть */}
                    {formError && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {formError}
                        </Alert>
                    )}

                    {/* Показать ошибку, если она есть */}
                    {error && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default EditFieldPage;