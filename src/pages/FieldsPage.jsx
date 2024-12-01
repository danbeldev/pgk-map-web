import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@mui/material";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteFieldById, getAllFields} from "../network/PgkMapApi";
import {getCoordinatesBorders} from "./map/MapFieldsDrawer";

const FieldsPage = () => {
    const navigate = useNavigate()

    const [fields, setFields] = useState([])
    const [search, setSearch] = useState("")
    const [openDialog, setOpenDialog] = useState(false);
    const [field, setField] = useState(null)

    useEffect(() => {
        getAllFields(search).then(data => {
            setFields(data.content)
        }).catch(e => console.log(e))
    }, [search])

    const handleClickCard = (field) => {
        if (field.borders && Array.isArray(field.borders)) {
            const coordinates = getCoordinatesBorders(field.borders)
            if (isNaN(coordinates.centerLat) || isNaN(coordinates.centerLon))
                navigate(`/map/` + field.id)
            else
                navigate(`/map/` + field.id + '/' + coordinates.centerLat + '/' + coordinates.centerLon)
        } else {
            navigate(`/map/` + field.id)
        }
    }

    const handleOpenDialog = (f) => {
        setOpenDialog(true);
        setField(f)
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setField(null)
    };

    const handleConfirmDelete = () => {
        deleteFieldById(field.id).then(() => {
            setFields(fields.filter(f => f.id !== field.id))
            setOpenDialog(false);
            setField(null)
        })
    };

    return (
        <div className="container">

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <p>Вы уверены, что хотите удалить это поле?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" style={{cursor: 'pointer'}}>
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary" style={{cursor: 'pointer'}}>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            <header className="header">
                <div className="search-bar">
                    <IconButton color="primary" onClick={() => navigate('/map')}>
                        <img src="/map.png" style={{height: 30}}/>
                    </IconButton>
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        value={search}
                        fullWidth
                        size="small"
                        className="search-input"
                        onChange={(ex) => setSearch(ex.target.value)}
                    />
                </div>
                <div style={{width: '20px'}}/>
                <Button variant="contained" color="primary" className="add-button" onClick={() => {
                    navigate('/create')
                }}>
                    Добавить
                </Button>
            </header>
            <div className="grid-container">
                {fields.map((field) => (
                    <div key={field.id} className="card" onClick={() => handleClickCard(field)}
                         style={{cursor: 'pointer'}}>
                        <div className="card-header">
                            <h3 className="card-title">{field.name}</h3>
                            <span className="card-date">{field.date}</span>
                        </div>
                        <div className="card-actions">
                            <button
                                className="card-button edit-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/fields/' + field.id + '/edit?name=' + field.name + '&date=' + field.date)
                                }}>
                                Редактировать
                            </button>

                            <button
                                className="card-button delete-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Останавливаем всплытие события
                                    handleOpenDialog(field); // Открыть диалог удаления
                                }}>
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FieldsPage;