import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useAuth } from "./../context/AuthProvider";
import "../css/Piecharts.css";

const DashboardChartsSection = () => {
  const { isAuthenticated } = useAuth();
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [projectPriorityData, setProjectPriorityData] = useState([]);
  const [projectTeamData, setProjectTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatusSummary = async () => {
      if (!isAuthenticated) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }


        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/status-summary`, {
        
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching status summary");
        }

        const data = await response.json();
        setProjectStatusData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrioritySummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/priority-summary`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Error fetching priority summary");
        }
    
        const data = await response.json();
        setProjectPriorityData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTeamSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/project-count-by-team`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Error fetching priority summary");
        }
    
        const data = await response.json();
        setProjectTeamData(data);
      } catch (err) {
        setError(err.message);
      }
    };


    fetchStatusSummary();
    fetchPrioritySummary();
    fetchTeamSummary();
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projectStatusData.length) {
    return <div>No project data available for chart</div>;
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="piechart-div">
      <div className="status-chart">
      <h3>Project Status Summary</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={projectStatusData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          fill="#8884d8"
        >
          {projectStatusData.map((entry, index) => (
            <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </div>
  
    <div className="priority-chart">
      <h3>Project Priority Summary</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={projectPriorityData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          fill="#8884d8"
        >
          {projectPriorityData.map((entry, index) => (
            <Cell key={`priority-cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>

    <div className="team-chart">
      <h3>Project Team Summary</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={projectTeamData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          fill="#8884d8"
        >
          {projectTeamData.map((entry, index) => (
            <Cell key={`team-cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </div>
    </div>
  );
}

export default DashboardChartsSection;
