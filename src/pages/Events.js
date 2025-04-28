import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { events } from '../services/api';

const Events = () => {
  const [eventList, setEventList] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEvents();
  }, [user, navigate]);

  const loadEvents = async () => {
    try {
      const response = await events.getAll();
      setEventList(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await events.create(newEvent);
      setOpen(false);
      setNewEvent({ title: '', description: '', date: '' });
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await events.register(eventId);
      loadEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      await events.cancelRegistration(eventId, user._id);
      loadEvents();
    } catch (error) {
      console.error('Error canceling registration:', error);
    }
  };

  const isRegistered = (event) => {
    return event.registrations.some((reg) => reg.user._id === user._id);
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {eventList.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" component="p">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created by: {event.creator.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Registrations: {event.registrations.length}
                </Typography>
              </CardContent>
              <CardActions>
                {isRegistered(event) ? (
                  <Button
                    color="secondary"
                    onClick={() => handleCancelRegistration(event._id)}
                  >
                    Cancel Registration
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="datetime-local"
            fullWidth
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events; 