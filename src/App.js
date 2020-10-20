import React, { useState, useEffect } from "react";
import "./css/App.css";
import Post from "./components/Post";
import Navbar from "./components/Navbar.js";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import Intro from "./components/Intro";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [uploadBox, setuploadBox] = useState(false);


  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        setUser(authUser);
      } else {
        //user has logged out..
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  const singIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <div className="row app__header">
        <Navbar />

        <Button onClick={() => setuploadBox(!uploadBox)}>Upload</Button>

        {user ? (
          <div>
            <Button
              onClick={() => {
                auth.signOut();
              }}
            >
              Logout
            </Button>
          </div>
        ) : null}
      </div>

      
          {uploadBox ? (
            <div>
              <ImageUpload username={user.displayName} />
            </div>
          ) : null}

          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.paper}>
              <div className="card">
                <div className="card-header">Sing up</div>
                <div className="card-body">
                  <form>
                    <Input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                      }}
                    />
                    <Input
                      type="text"
                      placeholder="e-mail"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                    <Input
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                    />
                    <Button type="submit" onClick={signUp}>
                      Sing Up
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            open={openSignIn}
            onClose={() => {
              setOpenSignIn(false);
            }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.paper}>
              <div className="card">
                <div className="card-header">Sing In</div>
                <div className="card-body">
                  <form>
                    <Input
                      type="text"
                      placeholder="e-mail"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                    <Input
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                    />
                    <Button type="submit" onClick={singIn}>
                      Sing In
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Modal>
           
          {user ? (
            <div>
              {posts.map(({ id, post }) => (
                <div className="app__posts">
                  <Post
                    key={id}
                    postId={id}
                    username={post.username}
                    commentUsername={user.displayName}
                    imageUrl={post.imageUrl}
                    caption={post.caption}
                    eventImage={post.eventImage}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="loginscreen">
              <Intro />
              <div className="Buttons__Container">
                <button className="Buttons" onClick={() => setOpenSignIn(true)}>
                  Sign In
                </button>
                <button
                  className="Buttons"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Sing Up
                </button>
              </div>
            </div>
          )}
    </div>
  );
}

export default App;

/*
import ImageUpload from "./ImageUpload";
import { Input } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch,Link } from "react-router-dom";

 const [username, setUsername] = useState("");

<Route exact path="/upload">
          <Input
          type="text"
          placeholder="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <ImageUpload username={username} />
          </Route>
*/
