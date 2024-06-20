import React, { useContext, useEffect } from "react";
import "./Event.css";
import AuthContext from "../../context/auth-context";
export default function Event(props) {
  const context = useContext(AuthContext);
  return (
    <div className="event-item">
      <div className="event-item__head-info">
        <div className="event-item__head-title">{props.title}</div>
        <div className="event-item__head-sub-info">
          ${props.price} - {props.date}
        </div>
      </div>
      {context.userId === props.creator ? (
        <div className="event-item__head-sub-info">
          You are ower of this event
        </div>
      ) : (
        <button className="btn" onClick={props.onViewDetail}>
          View detail
        </button>
      )}
    </div>
  );
}
