// import React from 'react'
import './Home.css'
import React, { useState, useRef,useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from './Card';
import { BASE_URL } from '../config'
import axios from 'axios';
import Swal from 'sweetalert2'
import Sidebar from './Sidebar';
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-UjiRgSKF4CRj6r9Y4U47T76AGSb9v/o3LZp56o9WEXDM1XnV4ijmRb+RcQVJ5cKpjI2JyjFL+g7Qiu3h/8L1jQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />



const Home = () => {

    const is_user_present = localStorage.getItem("user")
    const user = (JSON.parse(localStorage.getItem("user")))
    //console.log(user);
    console.log(is_user_present)
    console.log(user.name)
    if (is_user_present === null) {
        // navigate("/login")
        console.log("kya bo ri")
    }
    const user_info = (JSON.parse(is_user_present));



    const [modal, setModal] = useState(false);
    const [loggedUserpic , setLoggedUserPic] = useState(user_info?.profileImg)

    const toggleModal = () => {
        setModal(!modal);
    };
    const [image, setImage] = useState({ preview: '', data: '' });
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0],
        };
        setImage(img);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };
    // const [like, setLike] = useState(props.t.likes.length);
    const [show, setShow] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [Tweets, setTweets] = useState([])
    const [myallposts, setMyallposts] = useState([]);
    const [showPost, setShowPost] = useState(false);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);
    const [selectedFile, setSelectedFile] = useState(null);


    const [postDetail, setPostDetail] = useState({});
    const [comment, setComment] = useState("Hey!💜 ");
    // const [commentLength, setCommentLength] = useState(props.t.comments.length);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(()=>{

        async  function  getAllPost(){
            const response = await axios.get(`${BASE_URL}/allpost`);
          const userOriginal  = await axios.get(`${BASE_URL}/originalperson/${user_info._id}`)
      
             setLoggedUserPic(userOriginal.data.profileImg)
            setTweets(response.data.posts)
           // console.log(response.data.posts)
           
          }
          
          getAllPost()
        } , [])

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const deletePost = async (postId) => {
        debugger;
        const response = await axios.delete(`${BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);

        if (response.status === 200) {
            getMyPosts();
            setShow(false);
        }
    }
    const handleImgUpload = async (selectedFile) => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "YOUR_UPLOAD_PRESET");
      
        try {
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
            formData
          );
          return res;
        } catch (err) {
          console.log(err);
        }
      };
      
      
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


    const addPost = async () => {


        if (caption === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post caption is mandatory!'
            })
        } else {
            setLoading(true);
            const imgRes = await handleImgUpload(selectedFile);

console.log(imgRes);
const request = { description: caption };
if (selectedFile) {
  request.image = `${BASE_URL}/files/${imgRes.data.fileName}`;
}
                        debugger
            // write api call to create post
            const postResponse = await axios.post(`${BASE_URL}/createpost`, request, CONFIG_OBJ)
            setLoading(false);
            if (postResponse.status == 201) {
                console.log("successfull")

                // navigate("/posts")
                setShowPost(false)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred while creating post'
                })
            }
        }
    }



    return (


        <div class>
            {/* <Sidebar/> */}
            <div className="border  tweets    ">

                <div className='tcontainer'>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>Home</div>
                        <button onClick={() => setModal(true)} style={{ marginLeft: 'auto' }}>Tweet</button>
                    </div>


                    <div className=' overflow-hidden d-flex flex-column'>


                        {Tweets.length > 0 && Tweets.map((t) => (
                            <div key={t._id}>
                                <Card t={t} />
                            </div>
                        ))}







                    </div>

                </div>
            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
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
                    <Button variant="primary" >
                        Comment
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <Modal size='lg' show={modal} onHide={toggleModal} className='custom-modal'>
                    <Modal.Header closeButton>
                        <Modal.Title>PopUp</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='column2'>
                            <textarea onChange={(ev) => setCaption(ev.target.value)}
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='reason'
                                name='reason'
                                rows='6'
                                cols='55'
                                placeholder='Write your Tweet '
                            />
                            <div>
                                <div className='dropZoneContainer'>
                                    <div className='dropZoneOverlay'>
                                        {image.preview ? (
                                            <img src={image.preview} width='150' height='150' />
                                        ) : (
                                            <FontAwesomeIcon icon={faImage} onClick={handleImageClick} />
                                        )}
                                    </div>
                                    <input
                                        name='file'
                                        type='file'
                                        id='drop_zone'
                                        className='FileUpload'
                                        accept='.jpg,.png,.gif'
                                        onChange={handleFileSelect}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <div class='modal-footer'>
                        <button type='button' class='btn btn-secondary' onClick={toggleModal}>
                            Close
                        </button>

                        <button onClick={() => addPost()} type='button' class='btn btn-primary'>
                            Tweet
                        </button>
                    </div>
                </Modal>

            </div>
            </div>



            );
}



            export default Home;
