import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import {AuthAPI} from "../network/PgkMapApi";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            AuthAPI.signIn(credentials)
                .then(() => {
                    window.location.reload();
                })
                .catch(() => {
                    alert('Неверный email или пароль');
                });
        } catch (err) {
            setError(err.message || 'Ошибка авторизации');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
            />
            <TextField
                label="Пароль"
                type="password"
                fullWidth
                margin="normal"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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
                Войти
            </Button>
        </Box>
    );
};

export default LoginForm;