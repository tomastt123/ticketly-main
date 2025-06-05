import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const BugDetails = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);

  useEffect(() => {
    axios
      .get (`${process.env.REACT_APP_BACKEND_URL}/api/bugs/${id}`)
      .then((response) => setBug(response.data))
      .catch((error) => console.error("Error fetching bug details:", error));
  }, [id]);

  if (!bug) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Bug Details</h1>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">{bug.title}</h2>
          <p className="mb-2">{bug.description}</p>
          <p className="mb-2">
            <strong>Priority:</strong> {bug.priority}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {bug.status}
          </p>
          <p className="mb-2">
            <strong>Assigned To:</strong> {bug.assignedTo.name || "Unassigned"}
          </p>
          <p className="mb-2">
            <strong>Created By:</strong> {bug.createdBy.name}
          </p>
          <p className="mb-2">
            <strong>Created At:</strong> {new Date(bug.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BugDetails;
