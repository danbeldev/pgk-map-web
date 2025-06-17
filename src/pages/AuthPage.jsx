import { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <Paper elevation={3} sx={{ width: 400, p: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                    sx={{ mb: 3 }}
                >
                    <Tab label="Вход" />
                    <Tab label="Регистрация" />
                </Tabs>

                {activeTab === 0 ? <LoginForm /> : <RegisterForm />}
            </Paper>
        </Box>
    );
};

export default AuthPage;