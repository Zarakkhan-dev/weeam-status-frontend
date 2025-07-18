import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Tooltip } from "./Tooltip"; 
import axios from "axios";
import {LATEST_STATUS_URL,STATUS_HISTORY_URL } from "../lib/config";

const StatusPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(LATEST_STATUS_URL);

        const enriched = await Promise.all(
          data.services.map(async (svc) => {
            console.log("serveices name" , svc)
            const historyRes = await axios.get(`${STATUS_HISTORY_URL}${svc.serviceName}`);
            const dailyReports = historyRes.data.reverse().map((entry, idx) => ({
              day: idx + 1,
              status: entry.status,
            }));

            return {
              name: svc.serviceName,
              status: svc.status,
              uptime: svc.uptime || "N/A",
              details: svc.details || "",
              dailyReports,
            };
          })
        );

        setServices(enriched);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
  <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  <p className="text-gray-700 text-lg font-medium">Loading service status...</p>
</div>

    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[300px] bg-[#b79045]">
        <h1 className="text-white font-extrabold text-4xl md:text-6xl">
          Weeam
        </h1>
      </section>

      {/* Status Container */}
      <section className="mt-12 md:mt-20 md:w-[50%] mx-auto sm:w-[80%] px-4 sm:px-0">
        {/* Status Header */}
        <div className="py-4 px-6 bg-[#3ba55c] rounded-md shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl text-white font-semibold">
              All Systems Operational
            </h1>
            <Tooltip content="Shows real-time and historical status updates.">
              <Info className="text-white w-5 h-5 cursor-pointer" />
            </Tooltip>
          </div>
        </div>

        {/* Uptime Notice */}
        <div className="flex justify-end mt-6 mb-1">
          <p className="text-gray-600 text-sm">
            Uptime over the past 90 days.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              View historical uptime.
            </a>
          </p>
        </div>

        {/* Services List */}
        <div className="mt-4 bg-white border border-gray-200 rounded-md overflow-hidden">
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {service.status}
                </span>
              </div>

              {/* Uptime Bars */}
              <div className="grid grid-cols-90 gap-[2px] w-full mb-3">
                {service.dailyReports.map((day, i) => (
                  <Tooltip
                    key={i}
                    content={`Day ${day.day}: ${day.status}`}
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
      </section>
    </div>
  );
};

export default StatusPage;
