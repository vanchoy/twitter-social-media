import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonRegular } from '../../components/buttons/ButtonRegular';
import { buttonColor, whiteRegular } from '../../constants/styles';

import heroImg from '../../assets/login-wallpaper.jpg';

import { getSession, commitSession } from "../../sessions.server";
import connectDb from "../../db/connectDb.server";

/* ====== LOGIN SECTION STYLE ====== */

/* ~ LOGIN (Section Style)  ~ */
const loginSection = {
  "--section-bg-s1-margin": "0 auto",
  "--section-bg-s1-min_height": "100vh",
  "--section-bg-s1-max_height": "auto",
  "--section-bg-s1-padding": "20px",
  "--section-bg-s1-bg_color": "rgba(0,0,0, 0.6)",
  "--section-bg-s1-bg_image": `url(${heroImg})`,
  "--section-bg-s1-bg_attachment": "fixed",
  "--section-bg-s1-bg_position": "center",
  "--section-bg-s1-bg_repeat": "no-repeat",
  "--section-bg-s1-bg_blend_mode": "darken",
  "--section-bg-s1-bg_size": "cover",
  "--section-bg-s1-box_shadow": "none"
};
  /* ----------~(end)~---------- */

/* ~ LOGIN (Section Title)  ~ */
const loginSectionTitle = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "20px 20px 10px 20px",
  "--section-text-display": "block",
  "--section-text-color": "#fff",
  "--section-font_family": "Calibri",
  "--section-font_size": "42px",
  "--section-font_weight": "bold",
  "--section-font_style": "normal",
  "--section-text_align": "center",
  "--section-text_decoration": "none",
  "--section-text_shadow": "1px 1px 3px #1DA1F2",
  "--section-text-line_height": "1.5"
};
  /* ----------~(end)~---------- */

/* ~ LOGIN (Section SubTitle)  ~ */
const loginSectionSubTitle = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "0",
  "--section-text-display": "block",
  "--section-text-color": "#EFD345",
  "--section-font_family": "Calibri",
  "--section-font_size": "30px",
  "--section-font_weight": "normal",
  "--section-font_style": "regular",
  "--section-text_decoration": "none",
  "--section-text_align": "center",
  "--section-text_shadow": "1px 1px 3px #666",
  "--section-text-line_height": "1.3"
};
  /* ----------~(end)~---------- */

/* For more settings go to ["styles/index.scss"] */
/* =================|END|================= */

/* ====== LOGIN FORM STYLE ====== */

const loginForm = {
  "--form-width": "100%",
  "--form-min_width": "auto",
  "--form-max_width": "550px",
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
  "--label-color": "#fff",
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
  "--form-a-font_style": "italic",
  "--form-a-font_size": "16px",
  "--form-a-hover-color": "#EFD345",

  "--form-details-margin":  "0 0 0 10px"
};

/* For more settings go to ["styles/form.scss"] */
/* =================|END|================= */

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  // Our session cookie is HTTPOnly, so we have to read it on the server and
  // return it to the client as loader data
  return json({ userId: session.get("userId") });
};

export async function action({ request }) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const user = await db.models.User.findOne({
    username: formData.get("username").trim()
  });
  if (!user) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "User not found", values: formDataObject },
      { status: 404 }
    );
  }
  const passwordIsValid = user.password === formData.get("password").trim();
  if (!passwordIsValid) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "Invalid password", values: formDataObject },
      { status: 401 }
    );
  }
  // If the user exists and the password is valid, set the userId in the session...
  session.set("userId", user._id);
  // ...and reload the login page, updating the session cookie
  return redirect("/", {
    headers: {
      // Because we've set a value on the session, we need to commit it to the
      // session cookie
      "Set-Cookie": await commitSession(session)
    }
  });
};

const LoginPage = () => {
  const actionData = useActionData();
  const { userId } = useLoaderData();

  return (
    <section className="grid section" style={loginSection}>
      <div className="grid-col-4-10 grid-col-center">
        {
          userId ? (
            <Form className="grid form" style={loginForm} method="post" action="/logout">
              <header className="grid-col-all">
                <h1 style={loginSectionTitle}>
                  <em className="oblique-text">Twitter</em>
                </h1>
                <h2 style={loginSectionSubTitle}>
                  You are already a logged in user
                </h2>
              </header>
              <div className="grid-col-all">
                <ButtonRegular btnColor={buttonColor} btnHover="#EFD345" btnTextColor={whiteRegular} btnTextHoverColor={whiteRegular} btnText="Logout">
                  <FontAwesomeIcon pull="right" icon="right-to-bracket" size="1x" />
                </ButtonRegular>
              </div>
            </Form>
          )
            :
            (
              <Form className="grid form" style={loginForm} method="post" reloadDocument>
                <header className="grid-col-all">
                  <h1 style={loginSectionTitle}>
                    <em className="oblique-text">Twitter</em>
                  </h1>
                  <h2 style={loginSectionSubTitle}>
                  The alternative social media
                  </h2>
                </header>
                <div className="grid-col-all fields-position">
                  <label className="left" htmlFor="username">
                    <FontAwesomeIcon icon="user" size="1x" />
                    <span className="details">
                    Username:
                    </span>
                  </label>
                  <input id="username" name="username" type="text" placeholder=" Type your username" defaultValue={actionData?.values?.username} required/>
                </div>
                <div className="grid-col-all fields-position">
                  <label className="left" htmlFor="password">
                    <FontAwesomeIcon icon="key" size="1x" />
                    <span className="details">
                    Password:
                    </span>
                  </label>
                  <input id="password" name="password" type="password" placeholder=" Type your password" defaultValue={actionData?.values?.password} required/>
                </div>
                <div className="grid-col-all fields-position">
                  <li>
                    <Link className="menu_item" to="/">
                    Forgot your password?
                    </Link>
                  </li>
                  <li>
                    <Link className="menu_item" to="/register">
                    Don't have an account?
                    </Link>
                  </li>
                </div>
                <div className="grid-col-all">
                  <ButtonRegular btnColor={buttonColor} btnHover="#EFD345" btnTextColor={whiteRegular} btnTextHoverColor={whiteRegular} btnText="Login">
                    <FontAwesomeIcon pull="right" icon="right-to-bracket" size="1x" />
                  </ButtonRegular>
                </div>
              </Form>
            )
        }
      </div>
    </section>
  );
}

export default LoginPage;
