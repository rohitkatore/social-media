import React, { useState } from 'react';
import axios from 'axios';

const SubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    socialMediaHandle: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('socialMediaHandle', formData.socialMediaHandle);
      formData.images.forEach(image => {
        data.append('images', image);
      });

      await axios.post('http://localhost:5000/api/users', data);
      setMessage('Submission successful!');
      setFormData({ name: '', socialMediaHandle: '', images: [] });
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submission-form">
      <h2>Submit Your Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="socialMediaHandle">Social Media Handle:</label>
          <input
            type="text"
            id="socialMediaHandle"
            name="socialMediaHandle"
            value={formData.socialMediaHandle}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images:</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {message && <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>}
      </form>
    </div>
  );
};

export default SubmissionForm;
