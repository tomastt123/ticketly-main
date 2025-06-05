import React from "react";
import { Link } from "react-router-dom";
import "./../css/Breadcrumbs.css";

const Breadcrumbs = ({ paths }) => {
  return (
    <div className="breadcrumbs">
      {paths.map((path, index) => (
        <span key={index}>
          {path.to ? (
            <Link to={path.to}>{path.label}</Link>
          ) : (
            <span>{path.label}</span>
          )}
          {index < paths.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
