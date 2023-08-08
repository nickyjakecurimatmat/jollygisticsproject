import { useState, useEffect, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box, Typography } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import { LocalShipping, LocalShippingOutlined, LocalShippingRounded, LocationCity, LocationOn, LocationOnOutlined, Margin, TripOriginOutlined, TripOriginTwoTone } from '@mui/icons-material';

import { yellow, orange, green, red } from '@mui/material/colors';
import { TimeClock, TimeIcon } from '@mui/x-date-pickers';


import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { addDoc, collection, deleteDoc, doc, getDocs, getDoc, setDoc, Timestamp, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';

const HomeActions = () => {
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const vehicleCollectionRef = collection(db, "vehicles");
  const tripCollectionRef = collection(db, "trips");
  

  const getVehicles = async () => {
    const data = await getDocs(vehicleCollectionRef);
    setVehicles(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }
  
  const getTrips = async () => {
    const q = await query(tripCollectionRef, where("date_time", "==", "04/18/2022 05:50 PM"));

    const data = await getDocs(q);
    setTrips(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }

  useEffect(() => {
    getVehicles();
  }, []);

  useEffect(() => {
    getTrips();
  }, []);
  
//   const vehicles = [{
//       value: 'J1',
//       label: 'J1',
//   },
//   {
//       value: 'J2',
//       label: 'J2',
//   },
// ];

// const trips = [
//   {
//       vehicle : "J1",
//       date_time : "08:00 AM",
//       pickup: "1 Lirio Sta. Lucia, Pasig City",
//       dropoff: "123 Camarez, Tondo",
//       pickup_bound: "North",
//       dropoff_bound: "South",
//       operation_span: 4 
//   },
//   {
//       vehicle : "J1",
//       date_time : "12:00 AM",
//       pickup: "1 Lirio Sta. Lucia, Pasig City",
//       dropoff: "123 Camarez, Tondo",
//       pickup_bound: "North",
//       dropoff_bound: "South",
//       operation_span: 4 
//   },
//   {
//       vehicle : "J2",
//       date_time : "08:00 AM",
//       pickup: "1 Lirio Sta. Lucia, Pasig City",
//       dropoff: "123 Camarez, Tondo",
//       pickup_bound: "North",
//       dropoff_bound: "South",
//       operation_span: 4 
//   },
//   {
//       vehicle : "J2",
//       date_time : "12:00 AM",
//       pickup: "1 Lirio Sta. Lucia, Pasig City",
//       dropoff: "123 Camarez, Tondo",
//       pickup_bound: "North",
//       dropoff_bound: "South",
//       operation_span: 4 
//   },
// ]

console.log(vehicles);
console.log(trips);

vehicles.map(vehicle => {
  const filteredCollection = trips.filter(trip => trip.vehicle === vehicle.vehicle_id);
  vehicle.trips = filteredCollection;
})


    return(
      <Box sx={{
        width: 800,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DemoItem label="Select Date">
              <DatePicker defaultValue={dayjs('2022-04-17')} />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
        {vehicles.map(vehicle => {
          return(
            <Card>
              <CardContent>
              <Avatar 
                sx={{ 
                  bgcolor: green[500], 
                  width: 24, 
                  height: 24,
                }}
                variant="rounded">
                  <LocalShippingOutlined />
                </Avatar>
                <Typography>Vehicle: {vehicle.nickname}</Typography>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 700,
                    bgcolor: 'background.paper',
                  }}
                >
                {vehicle.trips.map(trip => {
                    return(
                      <>
                       <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemText primary={trip.date_time} secondary={trip.operation_span+' hours'}/>
                        <ListItemAvatar>
                          <Avatar 
                          sx={{ 
                            bgcolor: green[500], 
                            width: 24, 
                            height: 24,
                          }}>
                            <TripOriginOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={trip.pickup} secondary={trip.pickup_bound} />
                        <ListItemAvatar>
                          <Avatar 
                          sx={{ 
                            bgcolor: red[500], 
                            width: 24, 
                            height: 24,
                          }}>
                            <LocationOnOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={trip.dropoff} secondary={trip.dropoff_bound} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      </>
                    )
                  })}
                </List>
              </CardContent>
            </Card>
          )
        })

        }
      </Box>
    )
}

export default HomeActions