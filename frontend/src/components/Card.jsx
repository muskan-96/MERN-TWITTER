import React, { useState } from "react";
import { BASE_URL } from "../config";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'
const CONFIG_OBJ = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};
const showSuccessToast = (msg) => {
  toast.success(msg || `Added Successfully!`, {
    position: "top-center",
    autoClose: 700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    
  });
};

const showSuccessToastDislike = (msg) =>{
  toast.success(msg || `Added Successfully!`, {
    position: "top-center",
    autoClose: 700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    
  });
}

function Card(props) {
  
  const user = (JSON.parse(localStorage.getItem("user")))

  const is_user_present = localStorage.getItem("user")
  
  
   const user_info = (JSON.parse(is_user_present));
  const [postDetail, setPostDetail] = useState({});
  const [myallposts, setMyallposts] = useState([]);
  const [like, setLike] = useState(props.t.likes.length);
  const [show, setShow] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [comment, setComment] = useState("Hey!💜 ");
  const [commentLength, setCommentLength] = useState(props.t.comments.length);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate()
  function addcommentForTweet() {
    axios
      .put(`${BASE_URL}/comment`, { tweetId: props.t._id, comment }, CONFIG_OBJ)
      .then((response) => {
        setCommentLength(response.data.totalcomment);
        showSuccessToast("commented")
          // setHasLiked(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function likeTweet() {
    if (hasLiked) {
      // implement dislike features

      axios
        .put(`${BASE_URL}/dislike`, { tweetId: props.t._id }, CONFIG_OBJ)
        .then((response) => {
          setLike(response.data.likesCount);
          showSuccessToastDislike("DisLiked")
          setHasLiked(false);
        })
        .catch((err) => {
          setHasLiked(false);
          console.log(err);
        });
    } else {
      axios
        .put(`${BASE_URL}/like`, { tweetId: props.t._id }, CONFIG_OBJ)
        .then((response) => {
          setLike(response.data.likesCount);
          showSuccessToast("Liked")
          setHasLiked(true);
        })
        .catch((err) => {
          console.log(err);
          setHasLiked(false);
        });
    }
  }

  
  const sendRequestToBackendToReTweeet=async(id)=>{
    const {data} = await axios.post(`/tweet/createReTweet/${id}`)
    console.log(data)
    if(data?.error){
        toast.error(data?.error)
    }
    else{
        toast.success('retweeted Successfully')
        
        navigate('/')
    }
    
    // ! this get all tweets is here to assure me that I update the state after retweeting.
    // ! but there are other better ways of doing it
    // getAllTweets()

}
  
  const getMyPosts = async () => {

   
    debugger
    const response = await axios.get(`${BASE_URL}/myallposts`, CONFIG_OBJ);

    if (response.status === 200) {
      setMyallposts(response.data.posts);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Some error occurred while getting all your posts'
      })
    }
  }


  const showDetail = (post) => {
    setPostDetail(post);
  }
  const deletePost = async (postId) => {
    debugger;
    const response = await axios.delete(`${BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
    console.log("successfull")

    if (response.status === 200) {
      getMyPosts();
      setShow(false);
    }
  }

  // const user = (JSON.parse(localStorage.getItem("user")))

  return (
    <div>
    <ToastContainer
        position="top-right"
        autoClose={800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="border   mt-4 p-2">
        <div className="row">
          <div className="col-2 col-md-1 ">
            <img style={{ width: 40, height: 40 , borderRadius : 50}} src={props.t.tweetedBy?.profileImg} />
          </div>
         

            <div  className="  col-10 ms-2 d-flex flex-column">
              <div className="d-flex flex-row ">
                <Link to = {`/profile/${props.t.tweetedBy?._id}`} style={{ color : "black" , fontSize: 18, fontWeight: 700 , textDecoration : "underline"}} className="me-2 ">
                  @{props.t.tweetedBy?.fullname}
                </Link>
                <p
                  className=""
                  style={{ fontSize: 12, marginTop: 5, fontWeight: 400 }}
                 
                >
                 
                  {new Date(props.t.created_at).toLocaleDateString("en-IN")}
                </p>
                <div>
                {props.t.tweetedBy && props.t.tweetedBy._id === user._id && (
  <div
    onClick={() => deletePost(props.t._id)}
    className="mb-1 fs-5 fa-sharp fa-regular fa-heart"
  > click me dude to get delelted</div>
)}


      </div>
              </div>
               <div >
               <div onClick={()=>{navigate(`/tweet/${props.t._id}`)}} style={{cursor : "pointer"}} className="">
                <p>{props.t.description}</p>
              </div>
              <div onClick={()=>{navigate(`/tweet/${props.t._id}`)}} style={{cursor : "pointer"}} className="  ms-4">
                <img  style={{ width: 400, height: 400 }} src={props.t.image} />
              </div>
               </div>
             
            </div>
        
        </div>






        <div className=" border row mt-4 ">
          <div className="d-flex flex-row p-2 align-items-center">
            {/* div for like  */}
            <div className=" d-flex flex-row mx-4 align-items-center ">
              {hasLiked === false ? (
                <i
                  style={{ cursor: "pointer" }}
                  onClick={likeTweet}
                  className=" mb-1 fs-5 fa-sharp fa-regular fa-heart"
                ></i>
              ) : (
                <i
                  style={{ cursor: "pointer" }}
                  onClick={likeTweet}
                  className=" mb-1 fs-5 fa-solid fa-heart"
                ></i>
              )}

              <div className="d-flex flex-row align-items-center">
                <p className=" mx-2 sfs-5 mt-2">{like}</p>
              </div>
            </div>
       
            {/* div for comments */}
            <div className=" d-flex flex-row mx-4 align-items-center ">
              <i
                style={{ cursor: "pointer" }}
                onClick={handleShow}
                className=" mb-1 fs-5 fa-regular fa-comment"
              >comet</i>
              <div className="d-flex flex-row align-items-center">
                <p className=" mx-2 sfs-5 mt-2">{commentLength}</p>
              </div>
            </div>
                 {/* div for retweet */}
                 <div className=" d-flex flex-row mx-4 align-items-center ">
              <i
                style={{ cursor: "pointer" }}
                onClick={() => {
                  alert("hellor")
                }}
                className=" mb-1 fs-5 fa-solid fa-retweet"
              >retet</i>
              <div className="d-flex flex-row align-items-center">
                <p className=" mx-2 sfs-5 mt-2">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tweet your reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Add a comment</Form.Label>
              {/* <Form.Control as="textarea" rows={4} /> */}
              <div class="input-group">
                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  class="form-control"
                  aria-label="With textarea"
                ></textarea>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={addcommentForTweet}>
            Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Card;
