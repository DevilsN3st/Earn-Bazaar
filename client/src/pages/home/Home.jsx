import { useEffect, useState, useContext } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import "./home.css";
import { useLocation } from "react-router";
import axiosBaseURL from "../httpCommon";
import { Context } from "../../context/Context";
import Advertisment from "../../components/advertisments/Advertisment";
import { Link } from "react-router-dom";

import Select from "react-select";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const { user } = useContext(Context);
  // console.log(search);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosBaseURL.get("/posts" + search);
      const allPosts = res.data;
      const validPost = [];
      if (user) {
        allPosts.forEach(addRelevant);
        function addRelevant(item) {
          if (item.userCategory !== user.userCategory) {
            validPost.push(item);
          }
          if (user?.username === item.username) {
            validPost.push(item);
          }
        }
        setPosts(
          validPost.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } else {
        setPosts(
          allPosts.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      }
      // console.log(posts);
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
    fetchPosts();
    fetchTags();
  }, [user, search]);

  // console.log("avail",availableTags);
  // console.log("sel",selectedTags);

  useEffect(() => {
    const validPost = posts;
    if (selectedTags.length > 0) {
      const filteredPosts = [];
      function addRelevant(item) {
        if (item.tags && item.tags.length > 0) {
          item.tags.forEach(addTag);
        }
        function addTag(tag) {
          selectedTags.filter((seltag) => {
            if (seltag.label === tag.label) {
              filteredPosts.push(item);
            }
          });
        }
      }
      validPost.forEach(addRelevant);
      setPosts(
        filteredPosts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    }
  }, [selectedTags]);

  return (
    <>
      <Header />
      <Container direction="horizontal" >
        <Row>
          <Col xs md={3} className="border-right border-dark mt-4" >
            <Select
              defaultValue={[]}
              isMulti
              name="colors"
              options={availableTags.map((tag) => {
                return { label: tag.label, value: tag.id };
              })}
              value={selectedTags.map((tag) => {
                return { label: tag.label, value: tag.id };
              })}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(tags) => {
                setSelectedTags(
                  tags.map((tag) => {
                    return { label: tag.label, id: tag.value };
                  })
                );
              }}
            />
            {/* if( search.params.id ) */}
            <br />
            <Link to="/donate">
              <Button variant="success">Donate Us</Button>
            </Link>
          </Col>
          <Col>
          <div className="home">
            <Posts posts={posts} />
          </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
