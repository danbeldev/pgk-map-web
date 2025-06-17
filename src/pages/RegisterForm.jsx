import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import {AuthAPI, register} from "../network/PgkMapApi";

const RegisterForm = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        AuthAPI.signUp(userData)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Ошибка при регистрации:', error);
                alert('Ошибка при регистрации. Проверьте введенные данные.');
            });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                required
            />
            <TextField
                label="Пароль"
                type="password"
                fullWidth
                margin="normal"
                value={userData.password}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                required
            />
            <TextField
                label="Подтвердите пароль"
                type="password"
                fullWidth
                margin="normal"
                value={userData.confirmPassword}
                onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                required
            />
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
            >
                Зарегистрироваться
            </Button>
        </Box>
    );
};

export default RegisterForm;