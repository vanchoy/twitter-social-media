import { redirect, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import mongoose from 'mongoose';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonRegular } from '../../components/buttons/ButtonRegular';
import { buttonColor, whiteRegular, buttonHoverColor } from '../../constants/styles';

import { requireUserSession } from "../../sessions.server";
import connectDb from '../../db/connectDb.server';

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

/* ~ POSTS (Section Title)  ~ */
const postSectionTitle = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "0 20px 10px 20px",
  "--section-text-display": "block",
  "--section-text-color": "#000",
  "--section-font_family": "inherit",
  "--section-font_size": "36px",
  "--section-font_weight": "bold",
  "--section-font_style": "normal",
  "--section-text_align": "center",
  "--section-text_decoration": "none",
  "--section-text_shadow": "1px 1px 1px rgba(0, 0, 0, 0.3)",
  "--section-text-line_height": "1.5"
};
  /* ----------~(end)~---------- */

/* ~ POSTS (Section SubTitle)  ~ */
const postSectionSubTitle = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "0 20px 40px 20px",
  "--section-text-display": "block",
  "--section-text-color": "#666",
  "--section-font_family": "inherit",
  "--section-font_size": "20px",
  "--section-font_weight": "normal",
  "--section-font_style": "oblique",
  "--section-text_decoration": "none",
  "--section-text_align": "center",
  "--section-text_shadow": "1px 1px 1px rgba(0, 0, 0, 0.1)",
  "--section-text-line_height": "1.3"
};
  /* ----------~(end)~---------- */

/* For more settings go to ["styles/index.scss"] */

const postForm = {
  "--form-width": "100%",
  "--form-min_width": "100%",
  "--form-max_width": "100%",
  "--form-height": "auto",
  "--form-min_height": "auto",
  "--form-max_height": "auto",
  "--form-margin": "0 auto",
  "--form-padding": "20px",
  "--form-bg-color": "rgba(255, 255, 255, 0.3)",
  "--form-text-align": "center",
  "--form-border": "1px solid rgba(255,255,255,0.2)",
  "--form-border-radius": "60px",
  "--form-box-shadow": "0 0 6px 1px rgba(0,0,0,0.06)",
  "--form-backdrop-filter": "blur(16px)",
    
  "--form-field-min_width": "100%",
  "--form-field-width": "100%",
  "--form-field-height": "50px",
  "--form-field-max_width": "100%",
  "--form-field-margin": "0 auto",
  "--form-field-padding": "0",
  "--form-field-bg_color": "rgba(255,255,255,0.7)",
  "--form-field-font_size": "20px",
  "--form-field-font_family": "Calibri",
  "--form-field-text_color": "#626262",
  "--form-field-border": "1px solid #E9EFC0",  
  "--form-field-border_radius":" 9px",
  "--form-field-box_shadow": "rgba(0,0,0, 0.16) 0px 0px 3px",
  "--form-field-outline": "#EFD345",
  "--form-ro-field-background": "f9f9f9",
  "--form-ro-field-opacity": "0.6",
  "--form-req-field-color": "#9e0000",
  "--form-fields-position-padding": "10px",
  
  "--form-textarea-height": "300px",
  "--form-textarea-max_height": "auto",
  
  "--label-margin": "0 auto",
  "--label-padding": "5px 0 5px 0",
  "--label-display": "block",
  "--label-color": "#000",
  "--label-font_family": "inherit",
  "--label-font_size": "22px",
  "--label-font_weight": "normal",
  "--label-font_style": "normal",
  "--label-text_decoration": "none",
  "--label-text_align": "center",
  "--label-text_shadow": "rgba(0,0,0, 0.16) 1px 1px 3px",
  "--label-line_height": "1.5",
  
  "--form-li-width": "auto",
  "--form-li-padding": "10px",
  "--form-li-display": "inline-block",
  "--form-li-text_align": "left",
  
  "--form-a-display": "inline-block",
  "--form-a-color": "#000",
  "--form-a-decoration": "underline",
  "--form-a-font_style": "normal",
  "--form-a-font_size": "16px",
  "--form-a-hover-color": "#EFD345",
  
  "--form-details-margin":  "0 0 0 10px"
};
/* =================|END|================= */

export async function loader({ request }) {
  const session = await requireUserSession(request);

  if (session.has("userId")) {
    return json({ userId: session.get("userId") });
  }
  else {
    return redirect("/login");
  }
};

export const action = async ({request}) => {
  const formData = await request.formData(); //request the data from the form
  const values = Object.fromEntries(formData); // the data passed from the form
  const db = await connectDb(); // connect to the database
  const user = await db.models.User.findById(values.uid); //get the logged in user by id
  const id = mongoose.Types.ObjectId(); //create the post id in advance, so we can redirect to it after creation

  const addPost = await db.collection('posts').insertOne({
    _id: id,
    title: values.title,
    content: values.content,
    uid: user.username,
    favored: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }); 

  return redirect(`/${user.username}/${id}`, addPost);
};

const AddPost = () => {
  const { userId } = useLoaderData();

  return (
    <>
      <section className="grid section" style={postSectionStyle}>
        <div className="grid-col-5-9 grid-col-center">
          <Form className="grid form" style={postForm} method="post" acceptCharset="utf-8" encType="multipart/form-data">
            <header className="grid-col-all center">
              <h1 style={postSectionTitle}>Add Post</h1>
              <h2 style={postSectionSubTitle}>Here you can add a post</h2>
            </header>
            <div className="grid-col-2-12 fields-position">
              <label htmlFor="title">
                <span className="user-details">
                  Post title: <em className="requiredField">*</em>
                </span>
              </label>
              <input id="title" name="title" type="text" pattern="[^'\x22]+" placeholder=" Type a post title" required />
            </div>
            <div className="grid-col-2-12 fields-position">
              <label htmlFor="content">
                <span className="user-details">
                  Post content: <em className="requiredField">*</em>
                </span>
              </label>
              <textarea id="content" name="content" placeholder="Your post content. Max 500 chars" maxlength="500" required />
            </div>
            <div className="grid-col-all">
              <input type="hidden" name="uid" value={userId} />
              <ButtonRegular type="submit" name="_action" value="create" btnColor={buttonColor} btnHover={buttonHoverColor} btnTextColor={whiteRegular} btnTextHoverColor={buttonColor} btnText="Add post">
                <FontAwesomeIcon pull="right" icon="plus" size="1x" />
              </ButtonRegular>
            </div>
          </Form>
        </div>
      </section>
    </>
  );
};

export default AddPost;