import { Link, useLoaderData } from '@remix-run/react';

import { json } from '@remix-run/node';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import connectDb from '../db/connectDb.server';

/* ====== SECTIONS STYLE ====== */
/* ~ POSTS (Section Style)  ~ */
const postsSectionStyle = {
  "--section-bg-s1-margin": "0 auto",
  "--section-bg-s1-min_height": "auto",
  "--section-bg-s1-max_height": "auto",
  "--section-bg-s1-padding": "20px 20px 40px 20px",
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
const postsSectionTitle = {
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

  const postForm = {
    "--form-width": "100%",
    "--form-min_width": "auto",
    "--form-max_width": "100%",
    "--form-height": "auto",
    "--form-min_height": "auto",
    "--form-max_height": "300px",
    "--form-margin": "10px auto",
    "--form-padding": "0",
    "--form-bg-color": "rgba(255, 255, 255, 0.3)",
    "--form-text-align": "center",
    "--form-border": "1px solid #e6e6e6",
    "--form-border-radius": "10px 10px 0 0",
    "--form-box-shadow": "0 0 6px 1px rgba(29, 161, 242,0.1)",
    "--form-backdrop-filter": "blur(16px)",
  
    "--form-li-width": "auto",
    "--form-li-padding": "10px",
    "--form-li-display": "block",
    "--form-li-text_align": "left",
  
    "--form-a-display": "block",
    "--form-a-color": "#000",
    "--form-a-decoration": "underline",
    "--form-a-font_style": "normal",
    "--form-a-font_size": "16px",
    "--form-a-hover-color": "#000",
  
    "--form-details-margin":  "0 0 0 10px"
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

  const seePostButton = {
    "width": "100%",
    "background": "#1da1f2",
    "padding": "20px",
    "textDecoration": "none",
    "color": "#fff"
  }

  const iconPos = {
    "padding": "5px"
  }

  /* ----------~(end)~---------- */

/* For more settings go to ["styles/index.scss"] */
/* =================|END|================= */

export async function loader() {
  const db = await connectDb(); // connect to the database
  const posts = await db.models.Post.find().sort( { favored: -1 }); // get all posts from the database and sort them by most stars

  return json(posts);
};

const PublicLocal = () => {
  const posts = useLoaderData();
  //console.log(posts);

  const postsLinks = () => {
    return (
      posts.map((element,id) => {
        return (
          <article key={id} className="grid-col-5-9 form" style={postForm}>
            <h2 style={postTextStyle}>{element.title}</h2>
            <p style={metaInfo}><span style={iconPos}><FontAwesomeIcon icon="user" size="1x" /></span>Author: <Link style={metaInfo} to={`/${element.uid}`}>{element.uid}</Link></p>
            <p style={metaInfo}><span style={iconPos}><FontAwesomeIcon icon="clock" size="1x" /></span>{element.createdAt}</p>
            <p style={metaInfo}><span style={iconPos}><FontAwesomeIcon icon="heart" size="1x" /></span>{element.favored.length}</p>
            <div style={dashedLine} />
            <p style={postTextStyle}>{element.content}</p>
            <div style={dashedLine} />
            <Link style={seePostButton} to={`/${element.uid}/${element._id}`}>
              See post
              <FontAwesomeIcon pull="right" icon="chevron-right" size="1x" />
            </Link>
          </article>
        );
      })
    );
  };

  return (
    <>
      <section className="grid section" style={postsSectionStyle}>
        <header className="grid-wrapper-column">
          <h1 style={postsSectionTitle}>Local</h1>
        </header>
        {postsLinks()}
      </section>
    </>
  );
};

export default PublicLocal;