import { redirect, json } from '@remix-run/node';
import { Form, useLoaderData, Link } from '@remix-run/react';

import mongoose from 'mongoose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonRegular } from '../../../components/buttons/ButtonRegular';
import { buttonColor, whiteRegular} from '../../../constants/styles';

import { getSession } from "../../../sessions.server";
import connectDb from '../../../db/connectDb.server';

/* ====== SECTIONS STYLE ====== */
/* ~ POSTS (Section Style)  ~ */
const postSectionStyle = {
  "--section-bg-s1-margin": "0 auto",
  "--section-bg-s1-min_height": "100vh",
  "--section-bg-s1-max_height": "auto",
  "--section-bg-s1-padding": "none",
  "--section-bg-s1-bg_color": "#f9f9f9",
  "--section-bg-s1-bg_image": "none",
  "--section-bg-s1-bg_attachment": "none",
  "--section-bg-s1-bg_position": "relative",
  "--section-bg-s1-bg_repeat": "none",
  "--section-bg-s1-bg_blend_mode": "none",
  "--section-bg-s1-bg_size": "border-box",
  "--section-bg-s1-box_shadow": "none"
};
  /* ----------~(end)~---------- */
  
const postForm = {
  "--form-width": "100%",
  "--form-min_width": "auto",
  "--form-max_width": "auto",
  "--form-height": "auto",
  "--form-min_height": "auto",
  "--form-max_height": "auto",
  "--form-margin": "10px auto",
  "--form-padding": "0",
  "--form-bg-color": "rgba(255, 255, 255, 0.3)",
  "--form-text-align": "center",
  "--form-border": "1px solid #e6e6e6",
  "--form-border-radius": "10px 10px 0 0",
  "--form-box-shadow": "0 0 6px 1px rgba(29, 161, 242,0.1)",
  "--form-backdrop-filter": "blur(16px)",
};

const postTextStyle = {
  "display":"block",
  "padding": "20px",
}

const dashedLine = {
  "width": "100%",
  "borderBottom": "1px dashed #f0f0f0"
}

const metaInfo = {
  "display": "inline-block",
  "padding": "5px"
}

const buttonPos = {
  "display": "inline-block",
  "padding": "10px"
}

const iconPos = {
  "padding": "5px"
}

  /* ----------~(end)~---------- */
/* For more settings go to ["styles/index.scss"] */
/* =================|END|================= */

export const loader = async ({params, request}) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = await session.get("userId");

  const _postId = params.postId; // the id from the url
  const db = await connectDb(); // connect to the database
  const dataPost = await db.models.Post.findById(_postId); // data object with the requested snipped id
  
  //checks if a session exist
  if (session.has("userId")) {
    const user = await db.models.User.findById({
      _id: userId
    });
    const username = user.username;
    const dataObj = {userId,username,dataPost};
    return json(dataObj);
  }
  else {
    if (dataPost) {
      return json({dataPost}); // returns the post with the requested id from the url
    }
    else {
      return redirect("/"); // if the requested id does not exist it will redirect to the page with all posts
    }
  }  
};

export const action = async ({request}) => {
  const db = await connectDb(); // connect to the database
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

 const isFavorite = await db.models.Post.findOne(
  {
    _id: values.id, favored: {$all: values.username}
  }
 );
 
  //delete post
  if (_action === "delete") {
    return await db.models.Post.deleteOne(
      {
        _id: mongoose.Types.ObjectId(values)
      },
      [
        {
          $set: {
            title: values.title,
            content: values.content,
            updatedAt: new Date()
          }
        }
      ]
    );
  }

  //like post onclick
  if (_action === "like" && !isFavorite) {
    return await db.models.Post.updateOne({_id: values.id},{$push: {favored: values.username}});
  }

  //unlike post onclick
  if (_action === "like" && isFavorite) {
    return await db.models.Post.updateOne({_id: values.id},{$pull: {favored: values.username}});
  }

  return null;
};

const Post = () => {
  const data = useLoaderData(); // data from the loader - the requested post
  //console.log(data);
  const post = data.dataPost; 
  //console.log(post);
  const userId = data.userId;
  //console.log(userId);

  return (
    <>
      <section className="grid section" style={postSectionStyle}>
        <article className="grid-col-5-9 grid-col-center form" style={postForm}> 
        <h2 style={postTextStyle}>{post.title}</h2>
            <div>
            <p style={metaInfo}><span style={iconPos}><FontAwesomeIcon icon="user" size="1x" /></span>Author: <Link style={metaInfo} to={`/${post.uid}`}>{post.uid}</Link></p>
            <p style={metaInfo}><span style={iconPos}><FontAwesomeIcon icon="clock" size="1x" /></span>{post.createdAt}</p>
            <p style={metaInfo}><span style={iconPos}><FontAwesomeIcon icon="heart" size="1x" /></span>{post.favored.length}</p>
            </div>
            <div style={dashedLine} />
            <p style={postTextStyle}>{post.content}</p>
            <div style={dashedLine} />
          {
            data.username && (
              <div>
                <Form style={buttonPos} method="post">
                  <input type="hidden" name="id" value={post._id} />
                  <input type="hidden" name="username" value={data.username} />
                  <ButtonRegular type="submit" name="_action" value="like" btnColor={buttonColor} btnHover="#333" btnTextColor={whiteRegular} btnWidth="auto" btnBorderRadius="50%" btnTextHoverColor={whiteRegular}>
                    <FontAwesomeIcon icon="heart" size="1x" />
                  </ButtonRegular>
                </Form>
                {
                  data.username === post.uid && (
                    <Form style={buttonPos} method="post">
                      <input type="hidden" name="id" value={post._id} />
                      <input type="hidden" name="username" value={data.username} />
                      <div style={buttonPos}>
                        <ButtonRegular type="button" linkRef={`/posts/${post._id}/edit`} btnColor={buttonColor} btnHover="#333" btnTextColor={whiteRegular} btnTextHoverColor={whiteRegular} btnWidth="auto" btnBorderRadius="50%">
                          <FontAwesomeIcon icon="pen-to-square" size="1x" />
                        </ButtonRegular>
                      </div>
                      <div style={buttonPos}>
                        <ButtonRegular type="submit" name="_action" value="delete" btnColor={buttonColor} btnHover="#333" btnTextColor={whiteRegular} btnTextHoverColor={whiteRegular} btnWidth="auto" btnBorderRadius="50%">
                          <FontAwesomeIcon icon="trash" size="1x" />
                        </ButtonRegular>
                      </div>
                    </Form>
                  )
                }
              </div>
            )
          }
        </article>
      </section>
    </>
  );
};

export default Post;