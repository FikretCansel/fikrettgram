import React, { useEffect, useState } from "react";
import "../css/Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import { Button, Input } from "@material-ui/core";
import firebase from "firebase";

function Post({
  commentUsername,
  postId,
  username,
  caption,
  imageUrl,
  eventImage,
}) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const addComment = (e) => {
    e.preventDefault();
    if (commentInput) {
      db.collection("posts").doc(postId).collection("comments").add({
        text: commentInput,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: commentUsername,
      });
    }
    setCommentInput("");
  };

  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            comment: doc.data(),
          }))
        );
      });
  }, [postId]);

  return (
    <div className="post__general">
      <div className="post__header">
        <Avatar className="post__avatar" alt="Fikret" src="" />
        <h5>{username}</h5>
      </div>
      <div className="post__body">
        {eventImage ? (
          <img className="post__image" src={imageUrl} alt="" />
        ) : (
          <div className="post__video">
            <video width="350" height="240" src={imageUrl} controls>
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <h6 className="post__text">
          <strong>{username} </strong>
          {caption}
        </h6>
        </div>
        <div className="post__comments">
          {comments.map(({ comment }) => (
            <div className="post_comment">
              <p>
                <strong> {comment.username}</strong>
                {" "+comment.text}
              </p>
            </div>
          ))}
        </div>
      
      <form className="post__commentBox">
        <Input
          type="text"
          placeholder="Add to comment"
          className="post__input"
          value={commentInput}
          onChange={(e) => {
            setCommentInput(e.target.value);
          }}
        />
        <Button className="post__button" type="submit" onClick={addComment} >
          Post
        </Button>
      </form>
    </div>
  );
}

export default Post;
