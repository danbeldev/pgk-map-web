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
    TextField, Toolbar, Typography,
    FormControl, InputLabel, Select, MenuItem as SelectMenuItem,
    Chip, Divider, Collapse, ButtonGroup
} from "@mui/material";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AuthAPI, deleteFieldById, getAllFields} from "../network/PgkMapApi";
import {getCoordinatesBorders} from "./map/MapFieldsDrawer";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FieldsPage = () => {
    const navigate = useNavigate()

    const [fields, setFields] = useState([])
    const [filteredFields, setFilteredFields] = useState([])
    const [search, setSearch] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedField, setSelectedField] = useState(null)

    // Filtering and sorting states
    const [yearFilter, setYearFilter] = useState('all')
    const [sortOption, setSortOption] = useState('name-asc')
    const [groupOption, setGroupOption] = useState('none')
    const [showFilters, setShowFilters] = useState(false)

    // Available years for filtering
    const availableYears = [...new Set(fields.map(field => field.date.split('-')[0]))].sort()

    useEffect(() => {
        getAllFields().then(data => {
            setFields(data.content)
            setFilteredFields(data.content)
        }).catch(e => console.log(e))
    }, [])

    useEffect(() => {
        applyFiltersAndSorting()
    }, [fields, search, yearFilter, sortOption, groupOption])

    const applyFiltersAndSorting = () => {
        let result = [...fields]

        // Apply search filter
        if (search) {
            result = result.filter(field =>
                field.name.toLowerCase().includes(search.toLowerCase()) ||
                field.date.includes(search))
        }

        // Apply year filter
        if (yearFilter !== 'all') {
            result = result.filter(field => field.date.startsWith(yearFilter))
        }

        // Apply sorting
        switch(sortOption) {
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'date-asc':
                result.sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'date-desc':
                result.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            default:
                break
        }

        setFilteredFields(result)
    }

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

    const groupedFields = () => {
        if (groupOption === 'year') {
            const groups = {}
            filteredFields.forEach(field => {
                const year = field.date.split('-')[0]
                if (!groups[year]) {
                    groups[year] = []
                }
                groups[year].push(field)
            })
            return groups
        }
        if (groupOption === 'month') {
            const groups = {}
            filteredFields.forEach(field => {
                const [year, month] = field.date.split('-')
                const key = `${year}-${month}`
                if (!groups[key]) {
                    groups[key] = []
                }
                groups[key].push(field)
            })
            return groups
        }
        return {'All Fields': filteredFields}
    }

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

                        { localStorage.getItem("isAdmin") === "true" &&
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
                        }
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        className='add-button'
                        onClick={() => {
                            AuthAPI.signOut()
                            window.location.reload()
                        }}
                        sx={{whiteSpace: 'nowrap', paddingX: 2}}
                    >
                        Выйти
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Фильтры и сортировка */}
            <Box sx={{p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Фильтры и сортировка
                </Button>

                <Box>
                    <Chip
                        label={`Найдено: ${filteredFields.length}`}
                        color="primary"
                        variant="outlined"
                        sx={{mr: 1}}
                    />
                    {yearFilter !== 'all' && (
                        <Chip
                            label={`Год: ${yearFilter}`}
                            onDelete={() => setYearFilter('all')}
                            sx={{mr: 1}}
                        />
                    )}
                </Box>
            </Box>

            <Collapse in={showFilters}>
                <Box sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Год</InputLabel>
                                <Select
                                    value={yearFilter}
                                    label="Год"
                                    onChange={(e) => setYearFilter(e.target.value)}
                                >
                                    <SelectMenuItem value="all">Все годы</SelectMenuItem>
                                    {availableYears.map(year => (
                                        <SelectMenuItem key={year} value={year}>{year}</SelectMenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Сортировка</InputLabel>
                                <Select
                                    value={sortOption}
                                    label="Сортировка"
                                    onChange={(e) => setSortOption(e.target.value)}
                                    startAdornment={<SortIcon sx={{mr: 1}} />}
                                >
                                    <SelectMenuItem value="name-asc">По имени (А-Я)</SelectMenuItem>
                                    <SelectMenuItem value="name-desc">По имени (Я-А)</SelectMenuItem>
                                    <SelectMenuItem value="date-asc">По дате (старые)</SelectMenuItem>
                                    <SelectMenuItem value="date-desc">По дате (новые)</SelectMenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Группировка</InputLabel>
                                <Select
                                    value={groupOption}
                                    label="Группировка"
                                    onChange={(e) => setGroupOption(e.target.value)}
                                    startAdornment={<GroupWorkIcon sx={{mr: 1}} />}
                                >
                                    <SelectMenuItem value="none">Без группировки</SelectMenuItem>
                                    <SelectMenuItem value="year">По году</SelectMenuItem>
                                    <SelectMenuItem value="month">По месяцу</SelectMenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <ButtonGroup fullWidth>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setYearFilter('all')
                                        setSortOption('name-asc')
                                        setGroupOption('none')
                                    }}
                                >
                                    Сбросить
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Box>
            </Collapse>

            {/* Карточки с группировкой */}
            <Box sx={{padding: 2}}>
                {Object.entries(groupedFields()).map(([groupName, groupFields]) => (
                    <Box key={groupName} sx={{mb: 4}}>
                        {groupOption !== 'none' && (
                            <>
                                <Typography variant="h6" sx={{mb: 2, fontWeight: 'bold'}}>
                                    {groupName}
                                </Typography>
                                <Divider sx={{mb: 2}} />
                            </>
                        )}

                        <Grid container spacing={3}>
                            {groupFields.map((field) => (
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
                                        { localStorage.getItem("isAdmin") === "true" &&
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
                                        }

                                        {/* Содержимое карточки */}
                                        <CardContent>
                                            <Typography variant="h6" sx={{fontWeight: 'bold', marginBottom: 1}}>
                                                {field.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {field.date}
                                            </Typography>
                                            {field.borders?.length > 0 && (
                                                <Chip
                                                    label={`${field.borders.length} точек`}
                                                    size="small"
                                                    sx={{mt: 1}}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}

                {filteredFields.length === 0 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h6" color="textSecondary">
                            Ничего не найдено
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{mt: 2}}
                            onClick={() => {
                                setSearch('')
                                setYearFilter('all')
                            }}
                        >
                            Сбросить фильтры
                        </Button>
                    </Box>
                )}
            </Box>

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
        </div>
    );
}

export default FieldsPage;