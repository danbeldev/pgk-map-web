import {
    AppBar,
    Box,
    Card, CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, ListItemIcon, ListItemText, Menu, MenuItem,
    TextField, Toolbar, Typography
} from "@mui/material";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteFieldById, getAllFields} from "../network/PgkMapApi";
import {getCoordinatesBorders} from "./map/MapFieldsDrawer";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';

const FieldsPage = () => {
    const navigate = useNavigate()

    const [fields, setFields] = useState([])
    const [search, setSearch] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedField, setSelectedField] = useState(null)

    useEffect(() => {
        getAllFields(search).then(data => {
            setFields(data.content)
        }).catch(e => console.log(e))
    }, [search])

    const handleClickCard = (field) => {
        if (field.borders && Array.isArray(field.borders)) {
            const coordinates = getCoordinatesBorders(field.borders)
            if (isNaN(coordinates.centerLat) || isNaN(coordinates.centerLon))
                navigate(`/map?fieldId=` + field.id)
            else
                navigate(`/map?fieldId=` + field.id + '&lat=' + coordinates.centerLat + '&lon=' + coordinates.centerLon)
        } else {
            navigate(`/map?fieldId=` + field.id)
        }
    }

    const handleMenuOpen = (event, field) => {
        setAnchorEl(event.currentTarget);
        setSelectedField(field);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedField(null);
    };

    const handleEdit = () => {
        if (selectedField) {
            navigate(`/fields/${selectedField.id}/edit?name=${selectedField.name}&date=${selectedField.date}`);
            handleMenuClose();
        }
    };

    const handleDelete = () => {
        if (selectedField) {
            handleOpenDialog(selectedField);
            setAnchorEl(null);
        }
    };

    const handleOpenDialog = (f) => {
        setOpenDialog(true);
        setSelectedField(f)
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedField(null)
    };

    const handleConfirmDelete = () => {
        deleteFieldById(selectedField.id).then(() => {
            setFields(fields.filter(f => f.id !== selectedField.id))
            setOpenDialog(false);
            setSelectedField(null)
        })
    };

    return (
        <div className="container">
            {/* Диалоговое окно подтверждения удаления */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">Вы уверены, что хотите удалить это поле?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="default" className='edit-button'>Отмена</Button>
                    <Button onClick={handleConfirmDelete} color="error" className='delete-button'>Удалить</Button>
                </DialogActions>
            </Dialog>

            {/* AppBar с кнопками */}
            <AppBar position="static" color="transparent" elevation={2} sx={{padding: 1}}>
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                    {/* Логотип */}
                    <img src="/pgk.png" alt="Logo" style={{height: 40, marginRight: 16}}/>

                    {/* Центрируемая группа элементов (Карта, Поиск и Кнопка) */}
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                        <IconButton color="primary" onClick={() => navigate('/map')} sx={{marginRight: 2}}>
                            <MapIcon fontSize="large"/>
                        </IconButton>

                        <TextField
                            label="Поиск"
                            variant="outlined"
                            value={search}
                            size="small"
                            sx={{
                                flexGrow: 1,
                                maxWidth: 400,
                                marginRight: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon/>}
                            className='add-button'
                            onClick={() => navigate('/create')}
                            sx={{whiteSpace: 'nowrap', paddingX: 2}}
                        >
                            Добавить
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Карточки */}
            <Grid container spacing={3} sx={{padding: 2}}>
                {fields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.id}>
                        <Card
                            sx={{
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                },
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                            onClick={() => handleClickCard(field)}
                        >
                            {/* Меню кнопка в верхнем правом углу */}
                            <Box sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 1,
                            }} onClick={(e) => e.stopPropagation()}>
                                <IconButton onClick={(e) => handleMenuOpen(e, field)}>
                                    <MoreVertIcon/>
                                </IconButton>
                            </Box>

                            {/* Содержимое карточки */}
                            <CardContent>
                                <Typography variant="h6" sx={{fontWeight: 'bold', marginBottom: 1}}>
                                    {field.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {field.date}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Меню действий */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Редактировать"/>
                    </MenuItem>
                    <MenuItem
                        onClick={handleDelete}
                        sx={{
                            color: 'error.main',
                            '& .MuiListItemIcon-root': {
                                color: 'error.main',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Удалить"/>
                    </MenuItem>
                </Menu>
            </Grid>
        </div>
    );
}

export default FieldsPage;