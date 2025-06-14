import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";
import Login from "./components/Login";
import Message from "./components/Message";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import userService from "./services/users";
import loginService from "./services/login";
import { useContext } from "react";
import MessageContext from "./components/MessageContext";
import UserContext from "./components/UserContext";
import Users from "./components/Users";
import User from "./components/User";
import Blogs from "./components/Blogs";
import { Container, AppBar, Toolbar, IconButton, Button } from '@mui/material'
import blogImage from './assets/blogs.png'


const App = () => {
  const queryClient = useQueryClient();

  const [message, error, messageDispatch] = useContext(MessageContext);
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const resultBlogs = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  const resultUsers = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  const newBlogMutator = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      blogFormRef.current.toggleVisibility();
    },
    onError: () => {
      messageDispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "adding blog unsuccessful",
          error: true,
        },
      });
      setTimeout(() => {
        messageDispatch({ type: "REMOVE_MESSAGE" });
      }, 3000);
    },
  });

  const updateBlogMutator = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: () => {
      messageDispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "like unsuccessful",
          error: true,
        },
      });
      setTimeout(() => {
        messageDispatch({ type: "REMOVE_MESSAGE" });
      }, 3000);
    },
  });

  const deleteBlogMutator = useMutation({
    mutationFn: blogService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: () => {
      messageDispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "deleting blog unsuccessful",
          error: true,
        },
      });
      setTimeout(() => {
        messageDispatch({ type: "REMOVE_MESSAGE" });
      }, 3000);
    },
  });

  const commentMutator = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: () => {
      messageDispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "commenting on blog unsuccessful",
          error: true,
        },
      });
      setTimeout(() => {
        messageDispatch({ type: "REMOVE_MESSAGE" });
      }, 3000);
    }
  })

  const matchUser = useMatch("/users/:id");
  const matchBlog = useMatch("/blogs/:id");

  if (resultBlogs.isLoading || resultUsers.isLoading) {
    return <div>loading data...</div>;
  } else if (resultBlogs.isError) {
    return <div>blog service not available due to problems in server</div>;
  } else if (resultUsers.isError) {
    return <div>user service not available due to problems in server</div>;
  }

  const blogs = resultBlogs.data.sort((a, b) => b.likes - a.likes);
  const users = resultUsers.data;
  const userNav = matchUser
    ? users.find((u) => u.id === matchUser.params.id)
    : null;
  const blogNav = matchBlog
    ? blogs.find((b) => b.id === matchBlog.params.id)
    : null;

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      userDispatch({ type: "SET_USER", payload: user });
      setUsername("");
      setPassword("");
      blogService.setToken(user.token);
      navigate("/");
      messageDispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "successfully logged in",
          error: false,
        },
      });
      setTimeout(() => {
        messageDispatch({ type: "REMOVE_MESSAGE" });
      }, 3000);
    } catch (exception) {
      setUsername("");
      setPassword("");
      messageDispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "wrong username or password",
          error: true,
        },
      });
      setTimeout(() => {
        messageDispatch({ type: "REMOVE_MESSAGE" });
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    navigate("/login");
    userDispatch({ type: "REMOVE_USER" });
    messageDispatch({
      type: "SET_MESSAGE",
      payload: {
        message: "successfully logged out",
        error: false,
      },
    });
    setTimeout(() => {
      messageDispatch({ type: "REMOVE_MESSAGE" });
    }, 3000);
  };

  const createBlog = async (blogObject) => {
    newBlogMutator.mutate(blogObject);
    messageDispatch({
      type: "SET_MESSAGE",
      payload: {
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        error: false,
      },
    });
    setTimeout(() => {
      messageDispatch({ type: "REMOVE_MESSAGE" });
    }, 3000);
  };

  const updateBlog = async (blogObject) => {
    updateBlogMutator.mutate(blogObject);
    messageDispatch({
      type: "SET_MESSAGE",
      payload: {
        message: `liked ${blogObject.title} by ${blogObject.author}`,
        error: false,
      },
    });
    setTimeout(() => {
      messageDispatch({ type: "REMOVE_MESSAGE" });
    }, 3000);
  };

  const deleteBlog = async (id) => {
    deleteBlogMutator.mutate(id);
    navigate("/");
    messageDispatch({
      type: "SET_MESSAGE",
      payload: {
        message: "deleted blog successfully",
        error: false,
      },
    });
    setTimeout(() => {
      messageDispatch({ type: "REMOVE_MESSAGE" });
    }, 3000);
  };

  const addComment = async (id, comment) => {
    commentMutator.mutate({id, comment})
    messageDispatch({
      type: "SET_MESSAGE",
      payload: {
        message: `commented on ${blogNav.title}`,
        error: false,
      },
    });
    setTimeout(() => {
      messageDispatch({ type: "REMOVE_MESSAGE" });
    }, 3000);
  }

  if (!user) {
    return (
      <div>
        <Message />
        <Login
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <Container>
      <AppBar position="static" >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" >
            <img src={blogImage} style={ { width: 30 } } />
          </IconButton>
          <Button color="inherit" component={Link} to="/" >
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users" >
            users
          </Button>
          <em style={{ paddingLeft: 10, paddingRight: 10 }}>{user.name} logged in</em>
          <Button color="inherit "onClick={handleLogout}>logout</Button>
        </Toolbar>
      </AppBar>

      <h2>Blog App</h2>
      <Message message={message} error={error} />
      <Routes>
        <Route
          path="/"
          element={
            <Blogs
              blogs={blogs}
              createBlog={createBlog}
              blogFormRef={blogFormRef}
            />
          }
        />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User user={userNav} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blogNav}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              addComment={addComment}
              user={user}
            />
          }
        />
        <Route path="/login" element={<div></div>} />
      </Routes>
    </Container>
  );
};

export default App;
