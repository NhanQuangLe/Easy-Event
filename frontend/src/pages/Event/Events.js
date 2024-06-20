import React, { useContext, useEffect, useState } from "react";
import "./Event.css";
import Model from "../../components/Model/Model";
import Backdrop from "../../components/Backdrop/Backdrop";
import AuthContext from "../../context/auth-context";
import Event from "../../components/Event/Event";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
export default function EventsPage() {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsInput, setEventsInput] = useState({
    title: "",
    price: "",
    date: "",
    description: "",
  });
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const createEvent = () => {
    if (validateForm()) {
      console.log("validate");

      const requestBody = {
        query: `
            mutation{
                createEvent(eventInput: {title: "${eventsInput.title}", price: ${eventsInput.price}, date: "${eventsInput.date}", description: "${eventsInput.description}"}) {
                    _id
                    title
                    description
                    date
                    price
                    creator{
                    _id
                    email
                    }
                }
            }
          `,
      };

      const token = context.token;
      console.log(requestBody);

      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            console.log(res);
            throw new Error("Failed");
          }
          return res.json();
        })
        .then((resData) => {
          const event = resData.data.createEvent;
          setEvents([...events, event]);
          setCreating(false);
          setEventsInput({
            title: "",
            price: "",
            date: "",
            description: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onInputChange = (value) => {
    setEventsInput({
      ...eventsInput,
      [value.target.id]: value.target.value,
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    const requestBody = {
      query: `
            query{
                events{
                    _id
                    title
                    description
                    date
                    price
                    creator{
                        _id
                        email
                    }
                }
            }
        `,
    };
    setLoading(true);
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res);
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        console.log(events);
        setEvents(events);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const validateForm = () => {
    const keys = Object.keys(eventsInput);
    for (let i = 0; i < keys.length; i++) {
      if (eventsInput[keys[i]].trim().length === 0) {
        alert(`You must fill ${keys[i]} field`);
        return false;
      }
    }
    return true;
  };

  const bookEventHandler = () => {
    const token = context.token;
    if (!token) {
      setSelectedEvent(null);
      navigate("/auth");
    }
    console.log(selectedEvent);
    const requestBody = {
      query: `
            mutation{
                bookEvent(eventId: "${selectedEvent._id}"){
                    _id
                    createdAt
                    updatedAt
                }
            }
        `,
    };
    console.log(requestBody);
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res);
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        // const events = resData.data.events;
        console.log(resData);
        setSelectedEvent(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      {creating && <Backdrop />}
      {creating && (
        <Model
          canCancel
          canConfirm
          title="Add Event"
          onCancel={() => setCreating(false)}
          onConfirm={createEvent}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={eventsInput.title}
                onChange={onInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                value={eventsInput.price}
                onChange={onInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                value={eventsInput.date}
                onChange={onInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                rows={4}
                id="description"
                value={eventsInput.description}
                onChange={onInputChange}
              />
            </div>
          </form>
        </Model>
      )}

      {selectedEvent && <Backdrop />}
      {selectedEvent && (
        <Model
          canCancel
          canConfirm
          title={selectedEvent.title}
          onCancel={() => setSelectedEvent(null)}
          onConfirm={() => bookEventHandler(selectedEvent)}
        >
          <form>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                readOnly
                type="text"
                id="price"
                value={selectedEvent.price}
                onChange={onInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                readOnly
                type="text"
                id="date"
                value={new Date(selectedEvent.date).toLocaleString()}
                onChange={onInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                readOnly
                rows={4}
                id="description"
                value={selectedEvent.description}
                onChange={onInputChange}
              />
            </div>
          </form>
        </Model>
      )}

      {context.token && (
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      <section className="events-list">
        {loading && <Spinner />}
        {events.map((item) => (
          <Event
            title={item["title"]}
            price={item["price"]}
            date={new Date(item["date"]).toLocaleDateString()}
            description={item["description"]}
            creator={item["creator"]["_id"]}
            onViewDetail={() => setSelectedEvent(item)}
          />
        ))}
      </section>
    </React.Fragment>
  );
}
