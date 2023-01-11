import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonRegular } from '../components/buttons/ButtonRegular';
import { buttonColor, whiteRegular, buttonHoverColor } from '../constants/styles';

import heroWallpaper from '../assets/hero-wallpaper.jpg';

/* ====== SECTIONS STYLE ====== */

/* HERO (Section Style) */
const heroSectionStyle = {
  "--section-bg-s1-margin": "0 auto",
  "--section-bg-s1-min_height": "100vh",
  "--section-bg-s1-max_height": "auto",
  "--section-bg-s1-padding": "20px",
  "--section-bg-s1-bg_color": "rgba(0,0,0, 0.6)",
  "--section-bg-s1-bg_image": `url(${heroWallpaper})`,
  "--section-bg-s1-bg_attachment": "fixed",
  "--section-bg-s1-bg_position": "center",
  "--section-bg-s1-bg_repeat": "no-repeat",
  "--section-bg-s1-bg_blend_mode": "darken",
  "--section-bg-s1-bg_size": "cover",
  "--section-bg-s1-box_shadow": "none"
}
/* ----------~(end)~---------- */

/* ~ HERO (Section SubTitle)  ~ */
const heroSectionTitle = {
  "--section-text-margin": "0 auto",
  "--section-text-padding": "0px",
  "--section-text-display": "block",
  "--section-text-color": "#fff",
  "--section-font_family": "inherit",
  "--section-font_size": "64px",
  "--section-font_weight": "bold",
  "--section-font_style": "normal",
  "--section-text_align": "center",
  "--section-text_decoration": "none",
  "--section-text_shadow": "1px 1px 1px #8B4513",
  "--section-text-line_height": "1.5"
};    
  /* ----------~(end)~---------- */

/* For more settings go to ["styles/index.scss"] */
/* =================|END|================= */

const IndexPage = () => {
  return (
    <>
      <section className="grid section" style={heroSectionStyle}>
        <header className="grid-wrapper-column grid-col-center">
          <h1 style={heroSectionTitle}>
            Join the alternative Social Media
          </h1>
        </header>
        <div className="grid-col-5-7">
          <ButtonRegular type="button" linkRef="/register" btnColor={buttonColor} btnHover={buttonHoverColor} btnTextColor={whiteRegular} btnTextHoverColor={buttonColor} btnText="Register">
            <FontAwesomeIcon pull="right" icon="user-plus" size="1x" />
          </ButtonRegular>
        </div>
        <div className="grid-col-7-9">
          <ButtonRegular type="button" linkRef="/login" btnColor={buttonColor} btnHover={buttonHoverColor} btnTextColor={whiteRegular} btnTextHoverColor={buttonColor} btnText="Login">
            <FontAwesomeIcon pull="right" icon="right-to-bracket" size="1x" />
          </ButtonRegular>
        </div>
      </section>
    </>
  );
};

export default IndexPage;