import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth-context";
import Spinner from "../../components/Spinner/Spinner";
import "./Booking.css";

export default function BookingsPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const context = useContext(AuthContext);
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const token = context.token;
    const requestBody = {
      query: `
            query{
                bookings{
                    _id
                    event {
                        title
                        date
                    }
                    user {
                        email
                    }
                    createdAt
                    updatedAt
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
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const cancelBooking = (booking) => {
    const token = context.token;
    const requestBody = {
      query: `
            mutation CancelBooking($id: ID!){
                cancelBooking(bookingId: $id){
                    _id
                    title
                    description
                    price
                    date
                }
            }
        `,
      variables: {
        id: booking._id,
      },
    };
    setLoading(true);
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
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        setBookings(bookings.filter((item) => item._id !== booking._id));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <ul className="container">
          {bookings.map((booking) => (
            <li className="outer-booking__item">
              <div>
                {booking.event.title} -{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </div>
              <div>
                <button className="btn" onClick={() => cancelBooking(booking)}>
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
