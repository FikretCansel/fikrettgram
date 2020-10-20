import React, { useState } from "react";
import { Button, Checkbox } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./css/ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [eventImage, seteventImage] = useState(true);

  const clickedImage = () => {
    seteventImage(true);
  };
  const clickedVideo = () => {
    seteventImage(false);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTash = storage.ref(`images/${image.name}`).put(image);
    uploadTash.on(
      "state_changed",
      (snaphot) => {
        //progress function...
        const progress = Math.round(
          (snaphot.bytesTransferred / snaphot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function ...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
              eventImage: eventImage,
            });
          });
        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    
      <div className="imageupload">
        <progress
          className="imageupload__progress"
          value={progress}
          max="100"
        />
        <div className="checkboxs">
      <Checkbox value={eventImage} onClick={clickedImage} checked={eventImage}>
        Image
      </Checkbox>
      <label>Image</label>
      <Checkbox onClick={clickedVideo} checked={!eventImage}>
        Video
      </Checkbox>
      <label>Video</label>
      </div>
        <input
          type="text"
          placeholder="Enter caption..."
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>Upload</Button>
      </div>
      
   
  );
}

export default ImageUpload;
