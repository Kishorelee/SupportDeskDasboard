import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../notifications.css';

export default function Notification() {
  const [replies, setReplies] = useState([]);
  const { ticketId } = useParams();
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getRepliesForTicket = async () => {
      try {
        const response = await fetch(`https://supportdeskdashboard.onrender.com/api/getAllreply`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching replies: ${response.statusText}`);
        }

        const data = await response.json();
        setReplies(data);
        console.log("Replies:", data);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    getRepliesForTicket();
  }, [token, ticketId]); // Assuming token and ticketId are dependencies

  const filterRepliesByStatus = (status) => {
    return replies.filter((reply) => reply.status === status);
  };

  return (
    <div>
      <h2>Notifications</h2>


      <div className="notification-section">
        <h3>In Progress Notifications</h3>
        {filterRepliesByStatus('In Progress').length > 0 ? (
          <table className="notification-table">
            <thead>
              <tr>
                <th className="ticket-id">TicketId</th>
                <th className="employee-id">EmployeeId</th>
                <th className="message">Message</th>
                <th className="status">Status</th>
                <th className="user-id">Name of Respondent</th>
                <th className="user-id">Date</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {filterRepliesByStatus('In Progress').map((reply) => (
                <tr key={reply._id}>
                  <td className="ticket-id">{reply.ticketId}</td>
                  <td className="user-id">{reply.employeeId}</td>
                  <td className={`message in-progress-notification`}>{reply.message}</td>
                  <td className={`status in-progress-status`}>{reply.status}</td>
                  <td className="user-id">{userName} from the SupportTeam</td>
                  <td className="user-id">{reply.createdAt}</td>
                  
                  {/* Add more table cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No in-progress notifications available.</p>
        )}
      </div>

      <div className="notification-section">
        <h3>Closed Notifications</h3>
        {filterRepliesByStatus('Closed').length > 0 ? (
          <table className="notification-table">
            <thead>
              <tr>
                <th className="ticket-id">TicketId</th>
                <th className="employee-id">EmployeeId</th>
                <th className="message">Message</th>
                <th className="status">Status</th>
                <th className="user-id">Name of Respondent</th>
                <th className="user-id">Date</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {filterRepliesByStatus('Closed').map((reply) => (
                <tr key={reply._id}>
                  <td className="ticket-id">{reply.ticketId}</td>
                  <td className="user-id">{reply.employeeId}</td>
                  <td className={`message closed-notification`}>{reply.message}</td>
                  <td className={`status closed-status`}>{reply.status}</td>
                  <td className="user-id">{userName} from the SupportTeam</td>
                  <td className="user-id">{reply.createdAt}</td>
                  {/* Add more table cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No closed notifications available.</p>
        )}
      </div>
    </div>
  );
}
