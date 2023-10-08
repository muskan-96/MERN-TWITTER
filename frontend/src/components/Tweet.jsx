import React from "react";
import "./Tweet.css";

function Tweet() {
  return (
    <div className="post">
      <div className="post_avatar">
        <img src="hlks.jpg" alt="image" />
      </div>
      <div className="post_body">
        <div className="post_header">
          <div className="post_headerText">
            <h3>Muskan</h3>
          </div>
          <div className="post_headerDescription">
            <p>Trying my best to built this app all by today</p>
          </div>
        </div>
        <img src="image.jpg" alt="image" />
        <div className="post__footer">
         
          </div>
      </div>

    </div>
  );
}

export default Tweet;
