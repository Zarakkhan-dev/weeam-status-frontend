import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { BASE_URL } from "../lib/config";

const PastIncidents = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Format the data for display
        const formattedIncidents = response.data.map((incident) => ({
          ...incident,
          date: format(parseISO(incident.date), "MMM d, yyyy"),
          updates: incident.updates.map((update) => ({
            ...update,
            time: format(parseISO(update.timestamp), "MMM d, HH:mm"),
          })),
        }));

        setIncidents(formattedIncidents);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Failed to fetch past incidents");
      }
    };

    fetchIncidents();
  }, []);

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Past Incidents</h2>

        {incidents.map((incident, index) => (
          <div
            key={index}
            className={index !== incidents.length - 1 ? "mb-8" : ""}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {incident.date}
            </h3>

            {incident.title ? (
              <div className="pl-4 border-l-2 border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-3">
                  {incident.title}
                </h4>

                {incident.updates.map((update, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex items-start">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                          update.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : update.status === "Monitoring"
                            ? "bg-blue-100 text-blue-800"
                            : update.status === "Identified"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {update.status}
                      </span>
                      <div>
                        <p className="text-sm text-gray-700">
                          {update.message}
                        </p>
                        <p className="text-xs text-gray-500">{update.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No incidents reported.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastIncidents;
