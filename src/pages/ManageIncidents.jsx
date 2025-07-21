import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { BASE_URL } from "../lib/config";

const ManageIncidents = () => {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [updates, setUpdates] = useState([
    { status: 'No Incident', message: 'No incidents reported' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        await axios.get(`${BASE_URL}auth/check`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        fetchIncident();
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
        toast.error('Session expired, please login again');
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchIncident = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = format(date, 'yyyy-MM-dd');
      const { data } = await axios.get(`${BASE_URL}incidents/${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.title) {
        setTitle(data.title);
        setUpdates(data.updates);
      } else {
        setTitle('');
        setUpdates([{ status: 'No Incident', message: 'No incidents reported' }]);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch incident:', err);
      toast.error('Failed to fetch incident data');
      setIsLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchIncident();
  };

  const handleUpdateChange = (index, field, value) => {
    const newUpdates = [...updates];
    newUpdates[index] = { ...newUpdates[index], [field]: value };
    setUpdates(newUpdates);
  };

  const addUpdate = () => {
    setUpdates([...updates, { status: 'Investigating', message: '' }]);
  };

  const removeUpdate = (index) => {
    if (updates.length <= 1) return;
    const newUpdates = [...updates];
    newUpdates.splice(index, 1);
    setUpdates(newUpdates);
  };

  const saveIncident = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}incidents`, {
        date: format(date, 'yyyy-MM-dd'),
        title,
        updates: updates.filter(u => u.message.trim() !== '')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Incident saved successfully');
    } catch (err) {
      console.error('Failed to save incident:', err);
      toast.error('Failed to save incident');
    }
  };

  const deleteIncident = async () => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}incidents/${format(date, 'yyyy-MM-dd')}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle('');
        setUpdates([{ status: 'No Incident', message: 'No incidents reported' }]);
        toast.success('Incident deleted successfully');
      } catch (err) {
        console.error('Failed to delete incident:', err);
        toast.error('Failed to delete incident');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Incident Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange(parseISO(e.target.value))}
              className="w-full pl-10 p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Brief description of the incident"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Updates</label>
          {updates.map((update, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <div className="flex justify-between mb-2">
                <select
                  value={update.status}
                  onChange={(e) => handleUpdateChange(index, 'status', e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="No Incident">No Incident</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Identified">Identified</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Resolved">Resolved</option>
                </select>
                
                {updates.length > 1 && (
                  <button
                    onClick={() => removeUpdate(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <textarea
                value={update.message}
                onChange={(e) => handleUpdateChange(index, 'message', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Update details..."
                rows="3"
              />
            </div>
          ))}
          
          <button
            onClick={addUpdate}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <Plus size={16} className="mr-1" /> Add Update
          </button>
        </div>

        <div className="flex justify-between">
          <button
            onClick={deleteIncident}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Incident
          </button>
          
          <button
            onClick={saveIncident}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Save size={16} className="mr-1" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageIncidents;