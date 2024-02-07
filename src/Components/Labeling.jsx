import React, { useState, useRef, useEffect } from "react";
import "./Labeling.css";
import { Grid } from "@mui/material";

const ImageForm = () => {
  const [image, setImage] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [automaticMode, setAutomaticMode] = useState(false);

  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAutomaticMode = () => {
    setAutomaticMode(!automaticMode);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(sensorData);
  };

  const handleInputChange = (index, key, value) => {
    const updatedSensorData = [...sensorData];
    updatedSensorData[index][key] = value;
    setSensorData(updatedSensorData);
  };

  useEffect(() => {
    const handleAddLabel = (x, y) => {
      setSensorData([...sensorData, { x: x, y: y, label: "" }]);
    };

    const handleImageClick = (event) => {
      if (automaticMode && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        handleAddLabel(x, y);
      }
    };

    let currentImageRef = imageRef.current;

    if (automaticMode && currentImageRef) {
      currentImageRef.addEventListener("click", handleImageClick);
    }

    return () => {
      if (currentImageRef) {
        currentImageRef.removeEventListener("click", handleImageClick);
      }
    };
  }, [automaticMode, imageRef, sensorData]);

  return (
    <div className="image-form-container">
      <Grid container>
        <Grid md={8} sm={12} lg={8} xs={12}>
          <div className="wrapper">
            <form onSubmit={handleSubmit} className="labelForm">
              <div className="imageInput">
                <label htmlFor="image">Choose an Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  onChange={handleImageUpload}
                />
              </div>
              {sensorData.map((sensor, index) => (
                <div key={index} className="inputWrapper">
                  <label htmlFor={`x-${index}`}>X:</label>
                  <input
                    type="text"
                    id={`x-${index}`}
                    value={sensor.x}
                    onChange={(e) =>
                      handleInputChange(index, "x", e.target.value)
                    }
                  />
                  <label htmlFor={`y-${index}`}>Y:</label>
                  <input
                    type="text"
                    id={`y-${index}`}
                    value={sensor.y}
                    onChange={(e) =>
                      handleInputChange(index, "y", e.target.value)
                    }
                  />
                  <label htmlFor={`label-${index}`}>Label:</label>
                  <input
                    type="text"
                    id={`label-${index}`}
                    value={sensor.label}
                    onChange={(e) =>
                      handleInputChange(index, "label", e.target.value)
                    }
                  />
                  <div></div>
                </div>
              ))}
              <div className="buttonWrapper">
              <button onClick={handleAutomaticMode}>
                {automaticMode ? "Disable Labeling" : "Enable Labeling"}
              </button>
              <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </Grid>
        <Grid md={4} sm={12} xs={12} lg={4}>
          {image && (
            <div className="image-preview" style={{ position: "relative" }}>
              <img
                ref={imageRef}
                src={image}
                alt="Uploaded"
                style={{ width: "100%", height: "auto" }}
              />
              {sensorData.map((sensor, index) => (
                <div
                  key={index}
                  className="dot"
                  style={{
                    position: "absolute",
                    left: sensor.x + "%",
                    top: sensor.y + "%",
                  }}
                >
                  <div className="label">{sensor.label}</div>
                </div>
              ))}
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ImageForm;
