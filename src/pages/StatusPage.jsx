import React, { useEffect, useState } from "react";
import { Info, Clock } from "lucide-react";
import { Tooltip } from "./Tooltip";
import axios from "axios";
import { LATEST_STATUS_URL } from "../lib/config";
import Logo from "../assets/logo.png";
import PastIncidents from "../components/PastIncidents";

const StatusPage = () => {
  const [services, setServices] = useState([]);
  const [status, setstatus] = useState();

  // Auto refresh every 5 minutes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(LATEST_STATUS_URL);
        setServices(data.services);
        console.log(data);
        setstatus({
          systemStatus: data.systemStatus,
          statusColor: data.statusColor,
        });
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    const interval = setInterval(fetchData, 5 * 60 * 1000);
    fetchData();

    return () => clearInterval(interval);
  }, []);

  const getColor = (status) => {
    switch (status) {
      case "Up":
        return "bg-green-500";
      case "Degraded":
        return "bg-yellow-500";
      case "Down":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[300px] bg-[#2c2c2c]">
        <h1 className="text-[#b79045] font-extrabold text-4xl md:text-6xl flex items-center ">
          <img src={Logo} alt="Weem Logo" className="w-30" /> Weeam
        </h1>
      </section>

      {/* Status Container */}
      <section className="mt-12 md:mt-20 md:w-[50%] mx-auto sm:w-[80%] px-4 sm:px-0">
        {/* Status Header */}
        <div
          className="py-4 px-6 rounded-md shadow-md text-white"
          style={{ backgroundColor: status?.statusColor || "#3ba55c" }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {status?.systemStatus || "All Systems Operational"}
            </h1>
            <Tooltip content="Shows real-time and historical status updates.">
              <Info className="w-5 h-5 cursor-pointer" />
            </Tooltip>
          </div>
        </div>

        {/* Uptime Notice */}
        {/* <div className="flex justify-end mt-6 mb-1">
          <p className="text-gray-600 text-sm">
            Uptime over the past 90 days.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              View historical uptime.
            </a>
          </p>
        </div> */}

        {/* Services List */}
        <div className="mt-4 bg-white border border-gray-200 rounded-md ">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-5 ${
                index !== services.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {service.name}
                  </h3>
                  <Tooltip content={`${service.name}`}>
                    <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </Tooltip>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.status === "Up"
                      ? "bg-green-100 text-green-800"
                      : service.status === "Degraded"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {service.status}
                </span>
              </div>

              {/* Uptime Bars */}
              <div className="grid grid-cols-90 gap-[2px] w-full mb-3">
                {service.dailyReports.map((day, i) => (
                  <Tooltip
                    key={i}
                    content={
                      <div>
                        <div className="font-semibold">
                          {formatDate(day.date)}
                        </div>
                        <div>Status: {service.status}</div>
                        {day.downtimes.length > 0 ? (
                          <>
                            <div className="mt-2 font-medium">
                              Downtime periods:
                            </div>
                            {day.downtimes.map((downtime, idx) => (
                              <div key={idx} className="text-sm">
                                {downtime.period}
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="mt-2 text-sm">No downtime</div>
                        )}
                      </div>
                    }
                    position="top"
                  >
                    <div
                      className={`h-9 w-full ${getColor(
                        day.status
                      )} transition-all duration-200`}
                    />
                  </Tooltip>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                <span>90 days ago</span>
                <div className="flex-1 mx-2 h-px bg-gray-300" />
                <span>{service.uptime} uptime</span>
                <div className="flex-1 mx-2 h-px bg-gray-300" />
                <span>Today</span>
              </div>
            </div>
          ))}
        </div>

        <PastIncidents />
      </section>
    </div>
  );
};

export default StatusPage;
