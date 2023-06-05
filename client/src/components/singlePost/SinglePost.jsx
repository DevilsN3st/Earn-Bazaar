import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { Context } from "../../context/Context";

import axiosBaseURL from "../../pages/httpCommon";

import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import "./singlePost.css";
import DefaultMap from "../location/DefaultMap";

import { v4 as uuidV4 } from "uuid";
import CreatableSelect from "react-select/creatable";

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const PFimage =
    `${process.env.REACT_APP_AXIOS_BASEURL}/public/images/` ||
    "http://localhost:5000/public/images";
  const PFpdf =
    `${process.env.REACT_APP_AXIOS_BASEURL}/public/pdfs/` ||
    "http://localhost:5000/public/pdfs";
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // console.log(user);
  console.log(post);
  useEffect(() => {
    const getPost = async () => {
      const res = await axiosBaseURL.get("/posts/" + path);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setSelectedTags(res.data.tags);
    };
    const fetchTags = async () => {
      const res = await axiosBaseURL.get("/tags");
      const allTags = res.data;
      // console.log("alltags", allTags);
      const validTags = [];
      allTags.forEach((item) =>
        validTags.push({ id: item.tagId, label: item.name })
      );
      setAvailableTags(validTags);
    };
    getPost();
    fetchTags();
  }, [path]);

  const handleDelete = async () => {
    try {
      axiosBaseURL.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosBaseURL.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
        tags: selectedTags,
      });
      setUpdateMode(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  console.log(selectedTags)
  const onAddTag = (tag) => {
    setAvailableTags((prev) => [...prev, tag]);
    setSelectedTags((prev) => [...prev, tag]);
  };

  return (
    <div className="singlePost">
      <Container className="singlePostWrapper">
        {post.photo && (
          <img src={PFimage + post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post?.author?.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                >
                  edit
                </i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                >
                  delete
                </i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            {user?.username === post?.author?.username ? (
              <Link to="/settings">My Profile</Link>
            ) : (
              <Link to={`/profile/${post?.author?.username}`} className="link">
                <b> {post?.author?.username}</b>
              </Link>
            )}
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        <div className="singlePostInfo">
              <p>Tags</p>
        {
          updateMode
          ? post?.tags &&
            post?.tags.length > 0 && (
              <CreatableSelect
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                }}
                value={selectedTags?.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags?.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags?.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            )
          : selectedTags &&
            selectedTags.length > 0 &&
            selectedTags.map((tag) => (
              <span key={tag.id} className="singlePostTag">{tag.label}</span>
            ))}
          </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <Button
            className="singlePostButton btn-secondary btm-sm"
            onClick={handleUpdate}
          >
            Update
          </Button>
        )}
        {post.coords && <DefaultMap coordinates={post.coords} />}
        {post.brochure && (
          <a
            href={PFpdf + post.brochure}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Button>Download Brochure</Button>
          </a>
        )}
      </Container>
    </div>
  );
}
