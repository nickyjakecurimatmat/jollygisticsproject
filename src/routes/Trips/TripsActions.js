import { useState, useEffect, useMemo } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import moment from 'moment';
import { Box, CircularProgress, Fab, Typography, gridClasses, Grid, TextField, MenuItem} from '@mui/material';
import { Check, Save, Edit, Delete, ContentPaste, AddBox, Cancel } from '@mui/icons-material';
import Swal from 'sweetalert2'
import { DataGrid } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

//Import for datepicker
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 812,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const vehicle = [
    {
        value: 'J1',
        label: 'J1',
    },
    {
        value: 'J2',
        label: 'J2',
    },
];

const bound = [
    {
        value: 'North',
        label: 'North',
    },
    {
        value: 'South',
        label: 'South',
    },
    {
        value: 'West',
        label: 'West',
    },
    {
        value: 'East',
        label: 'East',
    },
];

const operations = [
    {
        value: 1,
        label: 1,
    },
    {
        value: 2,
        label: 2,
    },
    {
        value: 3,
        label: 3,
    },
    {
        value: 4,
        label: 4,
    },
    {
        value: 5,
        label: 5,
    },
    {
        value: 6,
        label: 6,
    },
    {
        value: 7,
        label: 7,
    },
    {
        value: 8,
        label: 8,
    },
    {
        value: 9,
        label: 9,
    },

];


const TripsActions = () => {
    const [trips, setTrips] = useState([]);
    const tripsCollectionRef = collection(db, "trips");
    const [pageSize, setPageSize] = useState(5);
    const [rowId, setRowId] = useState(null);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setEditFlag(false);
        setModalTitle("Add Trip");
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const [modalTitle, setModalTitle] = useState("Add Trip");
    const [editFlag, setEditFlag] = useState(false);
    const [docId, setDocId] = useState("");

    const [value, setValue] = useState(dayjs('2022-04-17T15:30'));

    const [selectValue, setSelectValue] = useState('');

    const [formData, setFormData] = useState({});

    const updateData = (params) => {
        setFormData({
            ...formData,
            [params.target.name]: params.target.value
        })
    }

    const getTrips = async () => {
        const data = await getDocs(tripsCollectionRef);
        setTrips(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    useEffect(() => {
        getTrips();
    }, []);

    const columns = useMemo(() => [
        {
            field: 'vehicle', 
            headerName: 'Vehicle', 
            width: 70, 
            type: 'singleSelect', 
            valueOptions: ['J1', 'J2'], 
            editable: true,
        },
        {
            field: 'date_time', 
            headerName: 'Date/Time', 
            width: 200,
            valueGetter: (params) => {
            return `${moment(new Date((params.row.date_time.seconds+params.row.date_time.nanoseconds/1000000000)*1000)).format('MMMM DD, yyyy - hh:mm A')}`;
            },
        },
        // {
        //     field: 'date_time', 
        //     headerName: 'Date/Time', 
        //     width: 200,
        // },
        {field: 'pickup', headerName: 'Pickup', width: 120, editable: true,},
        {field: 'dropoff', headerName: 'Dropoff', width: 120, editable: true,},
        {
            field: 'customer_name', 
            headerName: 'Customer Name', 
            width: 120, 
            editable: true,
        },
        {field: 'contact_number', headerName: 'Contact Number', width: 120, editable: true,},
        {field: 'price', headerName: 'Price', width: 120, editable: true,},
        {
            field: 'pickup_bound', 
            headerName: 'Pickup Bound', 
            width: 120, 
            type: 'singleSelect', 
            valueOptions: ['North', 'South', 'East', 'West'], 
            editable: true, 
        },
        {
            field: 'dropoff_bound', 
            headerName: 'Dropoff Bound', 
            width: 120, 
            type: 'singleSelect', 
            valueOptions: ['North', 'South', 'East', 'West'], 
            editable: true, 
        },
        {
            field: 'operation_span', 
            headerName: 'Operation', 
            width: 100 , 
            type: 'singleSelect', 
            valueOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9], 
            editable: true,
        },
        // {field: 'group_id', headerName: 'Group ID', width: 70},
        // {field: 'id', headerName: 'ID', width: 70},
        {field: 'notes', headerName: 'Notes', width: 120, editable: true,},
        {
            field: 'actions', 
            headerName: 'Actions', 
            width: 180, 
            type: 'actions', 
            renderCell:params=> {
                return (<Box sx={{m:1, position:'relative'}}>
                <Fab 
                    sx={{m:1}}
                    color='primary'
                    size="small"
                        onClick={() => { handleEdit(params.row.id)}}
                        >
                        <Edit/>
                    </Fab>
                    <Fab
                    sx={{m:1}} 
                    color='tertiary'
                    size="small"
                    onClick={() => { handleDelete(params.row.id)}}
                    >
                        <Delete/>
                    </Fab>
                    <Fab
                    sx={{m:1}} 
                    color='tertiary'
                    size="small"
                    onClick={() => { handleCopy(params.row)}}
                    >
                        <ContentPaste/>
                    </Fab>
            </Box>)
            }
        },
    ], [rowId])

    const handleEdit = async (id) => {
        const tripsDocs = doc(db, "trips", id);
        const docSnap = await getDoc(tripsDocs);
        const data = docSnap.data();
        data['date_time'] = moment(new Date((docSnap.data().date_time.seconds+docSnap.data().date_time.nanoseconds/1000000000)*1000)).format('MM/DD/YYYY hh:mm A');
        console.log(data);
        setFormData(
            data
        );
        setDocId(id);
        setModalTitle("Edit Trip");
        setEditFlag(true);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        deleteTrips(id);
    };

    const handleCopy = async (params) => {
        navigator.clipboard.writeText(`Vehicle: ${params.vehicle}\n`+
        // 'Date/Time: '+`${moment(new Date((params.date_time.seconds+params.date_time.nanoseconds/1000000000)*1000)).format('MMMM DD, yyyy - hh:mm A')}`+'\n'+
        `Date/Time: ${params.date_time}\n`+
        `Pickup: ${params.pickup}\n`+
        `Dropoff: ${params.dropoff}\n`+
        `Customer: ${params.customer_name}\n`+
        `Contact Number: ${params.contact_number}\n`+
        `Price: ${params.price}\n`+
        `Notes: ${params.notes}`);
    };

    const deleteTrips = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "primary",
            cancelButtonColor: "tertiary", 
            confirmButtonText: "Yes, delete it!"
        }).then(result => {
            if(result.value) {
            deleteApi(id);
            }
        })
    }
      
    const deleteApi = async (id) => {
        const tripsDocs = doc(db, "trips", id);
        await deleteDoc(tripsDocs);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getTrips();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        console.log(new Date(event.target[0].value));
        formData.date_time = new Date(event.target[0].value);

        if(editFlag) {
            await updateDoc(doc(db, "trips", docId), formData);
            setOpen(false);
            Swal.fire("Updated!", "Your trip has been updated.", "success");
        } else {
            await addDoc(collection(db, "trips"), formData);
            setOpen(false);
            Swal.fire("Created!", "Your trip has been created.", "success");
        }
        getTrips();
    }

    const handleSelect = (event) => {
        alert(event.target.value);
        setSelectValue(event.target.value);
    }

    return (
        <Box 
        sx={{
            height:400,
            width:'100%'
        }}>
            <Typography 
            variant='h3'
            component='h3'
            sx={{textAlign: 'center', mt:3, mb:3}}>
            Trips
            </Typography>
            <Grid container justifyContent="flex-end">
                <Fab 
                    sx={{m:1}}
                    color='secondary'
                    size="small"
                        onClick= {handleOpen}
                        >
                        <AddBox></AddBox>
                </Fab>
                
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {modalTitle}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                        >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']}>
                            <DemoItem label="Date/Time">
                                <DateTimePicker defaultValue={dayjs(formData.date_time)}/>
                            </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        <TextField
                            id="outlined-select-vehicle"
                            select
                            label="Vehicle"
                            defaultValue={formData.vehicle}
                            helperText="Please select vehicle"
                            name="vehicle" onChange={updateData}
                        >
                            {vehicle.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </TextField>
                        <TextField id="add-pickup" label="Pickup" variant="outlined" name="pickup" onChange={updateData} defaultValue={formData.pickup}/>
                        <TextField id="add-dropoff" label="Dropoff" variant="outlined" name="dropoff" onChange={updateData} defaultValue={formData.dropoff}/>
                        <TextField id="add-customer" label="Customer" variant="outlined" name="customer_name" onChange={updateData} defaultValue={formData.customer_name}/>
                        <TextField id="add-contact" label="Contact" variant="outlined" type="number" name="contact_number" onChange={updateData} defaultValue={formData.contact_number}/>
                        <TextField id="add-price" label="Price" variant="outlined" type="number" name="price" onChange={updateData} defaultValue={formData.price}/>
                        <TextField
                            id="add-pickup-bound"
                            select
                            label="Pickup Bound"
                            defaultValue={formData.pickup_bound}
                            helperText="Please select bound"
                            name="pickup_bound"
                            onChange={updateData}
                        >
                            {bound.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="add-dropoff-bound"
                            select
                            label="Dropoff Bound"
                            defaultValue={formData.dropoff_bound}
                            helperText="Please select bound"
                            name="dropoff_bound"
                            onChange={updateData}
                        >
                            {bound.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="add-operation"
                            select
                            label="Operation Span"
                            defaultValue={formData.operation_span}
                            helperText="Please select hours"
                            name="operation_span"
                            onChange={updateData}
                        >
                            {operations.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="add-notes"
                            label="Notes"
                            multiline
                            maxRows={4}
                            defaultValue={formData.notes}
                            name="notes"
                            onChange={updateData}
                        />
                        <Button variant="contained" startIcon={<Save />} color="primary" size="large" type="submit">
                            Save
                        </Button>
                        <Button variant="contained" startIcon={<Cancel />} color="error" size="large">
                            Cancel
                        </Button>
                    </Box>
                    </Typography>
                    </Box>
                </Modal>
            </Grid>
            <DataGrid
            columns={columns}
            rows={trips}
            getRowId={row => row.id}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            getRowSpacing={params => ({
            top:params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5
            })}
            sx={{
            [`& .${gridClasses.row}`] : {
                bgcolor:theme=>theme.palette.mode == 'light' ? grey[200] : grey[900]
            }
            }}
            />
        </Box>
    )
}

export default TripsActions