import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getSession } from "../sessions.server";
import connectDb from '../db/connectDb.server';

/* ====== SECTIONS STYLE ====== */
/* ~ POSTS (Section Style)  ~ */
const postSectionStyle = {
  "--section-bg-s1-margin": "0 auto",
  "--section-bg-s1-min_height": "auto",
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

/* For more settings go to ["styles/index.scss"] */
/* =================|END|================= */

/* ~ POSTS (Section Title)  ~ */
const postsSectionTitle = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "20px 20px 10px 20px",
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
    "padding": "5px",
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

export const loader = async ({request}) => { 
  const session = await getSession(request.headers.get("Cookie"));
  const userId = await session.get("userId");
  const db = await connectDb(); // connect to the database

  const user = await db.models.User.findOne( { _id: userId } );

  //get all posts liked by the username and sort them by newest (createdAt)
  const userData = await db.models.User.aggregate(
    [
      {
        $match: {
          username: user.username 
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "username",
          foreignField: "favored",
          as: "posts",
          pipeline: [
            { "$sort" : { "createdAt" : -1 }}
          ]
        }
      },
      { 
        $project: { 
          "password": 0, 
          "email": 0,
          "_id": 0
        }
      }
    ]
  );

  if (!userId) {
    return redirect("/");
  }
  else {
    return json(userData[0]);
  }
}

const Favorites = () => {
  const user = useLoaderData(); //get the user data from the loader
  console.log(user);

  const postsLinks = () => {
    return (
      user.posts.map(element => {
        return (
          <article key={element._id} className="grid-col-5-9 form" style={postForm}>
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
      <section className="grid section" style={postSectionStyle}>
        <header className="grid-wrapper-column">
          <h1 style={postsSectionTitle}>My Favorites</h1>
        </header>

        {postsLinks()}
      </section>
    </>
  );
};

export default Favorites;