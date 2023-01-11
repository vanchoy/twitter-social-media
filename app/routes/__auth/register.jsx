import { Link, Form, useActionData } from '@remix-run/react';

import { json, redirect } from "@remix-run/node";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';

import { ButtonRegular } from '../../components/buttons/ButtonRegular';
import heroImg from '../../assets/register-wallpaper.jpg';
import { buttonColor, whiteRegular } from '../../constants/styles';

import { getSession } from "../../sessions.server";
import connectDb from "../../db/connectDb.server";

/* ====== REGISTER SECTION STYLE ====== */

/* ~ REGISTER (Section Style)  ~ */
const registerSection = {
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

/* ~ REGISTER (Section Title)  ~ */
const registerSectionTitle = {
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

/* ~ REGISTER (Section SubTitle)  ~ */
const registerSectionSubTitle = {
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

/* ~ REGISTER (Section Paragraph Text)  ~ */
const sectionText = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "0",
  "--section-text-display": "block",
  "--section-text-color": "#fff",
  "--section-font_family": "inherit",
  "--section-font_size": "16px",
  "--section-font_weight": "normal",
  "--section-font_style": "normal",
  "--section-text_decoration": "none",
  "--section-text_align": "center",
  "--section-text_shadow": "none",
  "--section-text-line_height": "1.5"
};
  /* ----------~(end)~---------- */

/* For more settings go to ["styles/index.scss"] */
/* =================|END|================= */

/* ====== REGISTER FORM STYLE ====== */

const registerForm = {
  "--form-width": "100%",
  "--form-min_width": "auto",
  "--form-max_width": "700px",
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
  "--form-a-font_style": "normal",
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
  if (session.has("userId")) {
    return redirect("/");
  }

  return null;
};

export async function action({ request }) {
  const db = await connectDb();
  const formData = await request.formData();
  const user = db.models.User;
  let data = Object.fromEntries(formData);

  const _username = await user.find( { username: data.username } );
  const _email = await user.find( { email: data.email } );

  // checks if the user input fields are empty
  if (data.password === "" || data.username === "" || data.email === "") {
    return json(
      { errorMessage: "Please fill out all fields", values: data },
      { status: 400 }
    );
  }

  //checks if the passwords are matching
  if (data.password !== data.passwordConfirm) {
    return json(
      { errorMessage: "Passwords do not match", values: data },
      { status: 400 }
    );
  } 

  //checks if the username or email already exist in the db
  if (_username === data.username || _email === data.email) {
    return json(
      { errorMessage: "Email or username already exist", values: data },
      { status: 400 }
    );
  }

  //creates new user and redirects to the login page
  else {
    let svg = createAvatar(style, {
      seed: 'twitter',
      // ... and other options
    });
    
    const newUser = new user({
      username: data.username,
      password: data.password,
      email: data.email,
      avatar: svg
    });
    await newUser.save();
    return redirect("/login");
  }
}

const RegisterPage = () => {
  const dataAction = useActionData();

  return (
    <section className="grid section" style={registerSection}>
      <div className="grid-col-4-10 grid-col-center">
        <Form className="grid-list-2reg-2lrg-2mid-2sml form" style={registerForm} method="post">
          <header className="grid-col-all">
            <h1 style={registerSectionTitle}>
              <em>Twitter</em>
            </h1>
            <h2 style={registerSectionSubTitle}>
              Join the alternative Social Media
            </h2>
          </header>
          <div className="grid-col-1-7 fields-position">
            <label className="left" htmlFor="username">
              <FontAwesomeIcon icon="user" size="1x" />
              <span className="details">
                Username: <em className="required-field">*</em>
              </span>
            </label>
            <input id="username" name="username" type="text" pattern="[^'\x22]+" title="Invalid input" placeholder=" Username" required/>
          </div>
          <div className="grid-col-7-13 fields-position">
            <label className="left" htmlFor="email">
              <FontAwesomeIcon icon="envelope" size="1x" />
              <span className="details">
                E-mail address: <em className="required-field">*</em>
              </span>
            </label>
            <input id="email" name="email" type="email" pattern="[^'\x22]+" title="Invalid input" placeholder=" Your e-mail" />
          </div>
          <div className="grid-col-1-7 fields-position">
            <label className="left" htmlFor="password">
              <FontAwesomeIcon icon="key" size="1x" />
              <span className="details">
                Password: <em className="required-field">*</em>
              </span>
            </label>
            <input id="password" name="password" type="password" placeholder=" Password" pattern=".{8,}" title="Eight or more characters" required/>
          </div>
          <div className="grid-col-7-13 fields-position">
            <label className="left" htmlFor="passwordConfirm">
              <FontAwesomeIcon icon="key" size="1x" />
              <span className="details">
                Repeat Password: <em className="required-field">*</em>
              </span>
            </label>
            <input id="passwordConfirm" name="passwordConfirm" type="password" pattern=".{8,}" title="Eight or more characters" placeholder=" Repeat password" required/>
          </div>
          <div className="grid-col-1-7 fields-position checkbox-wrapper checkbox-container">
            <div className="checkbox">
              <input type="checkbox" id="privacyPolicy" name="privacyPolicy" required/>
              <label htmlFor="privacyPolicy"><span>Agree to Privacy Policy <em className="required-field">*</em></span></label>
            </div>
            <div className="checkbox">
              <input type="checkbox" id="termsService" name="termsService" required/>
              <label htmlFor="termsService"><span>Accept the Terms of Service <em className="required-field">*</em></span></label>
            </div>
          </div>
          <div className="grid-col-7-13 fields-position">
            <li>
              <Link to="/login">
                Already have an account?
              </Link>
            </li>
            <li>
              <Link to="/contact">
                Have questions, contact us!
              </Link>
            </li>
          </div>
          <div className="grid-col-all fields-position">
            <p style={sectionText}>
              <span>
                All fields marked with <em className="required-field">*</em> are required
              </span>
            </p>
          </div>
          <div className="grid-col-all">
            <p>{dataAction?.errorMessage}</p>
            <ButtonRegular type="submit" btnColor={buttonColor} btnHover="#EFD345" btnTextColor={whiteRegular} btnTextHoverColor={whiteRegular} btnText="Register">
              <FontAwesomeIcon pull="right" icon="user-plus" size="1x" />
            </ButtonRegular>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default RegisterPage;
