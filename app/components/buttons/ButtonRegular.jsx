import { Link } from '@remix-run/react';
import checkExternal from '../../js/urlPathCheck';

const ButtonRegular = (props) => {
  let button;
  let sharedButtonStyle = {
    /* ====== BUTTONS SETTINGS ====== */
      /* ~  (Button Rectangle Style #1)  ~ */
        "--btn-rec-s1-margin": props.btnMargin ? props.btnMargin : "0 auto",
        "--btn-rec-s1-padding": props.btnPadding ? props.btnPadding : "22px",
        "--btn-rec-s1-width": props.btnWidth ? props.btnWidth : "220px",
        "--btn-rec-s1-max-width": "100%",
        "--btn-rec-s1-height": "auto",
        "--btn-rec-s1-bg": props.btnColor,
        "--btn-rec-s1-text-color": props.btnTextColor,
        "--btn-rec-s1-font-family": "'Gili Sans', sans-serif",
        "--btn-rec-s1-font-size": "18px",
        "--btn-rec-s1-text-align": "center",
        "--btn-rec-s1-text-shadow": "-1px 0 #949494",
        "--btn-rec-s1-position": "relative", /* Edit only if you know what you are doing*/
        "--btn-rec-s1-z-index": "0", /* Edit only if you know what you are doing */
        "--btn-rec-s1-display": "block", /* Edit only if you know what you are doing*/
        "--btn-rec-s1-border": "none",
        "--btn-rec-s1-border-radius": props.btnBorderRadius ? props.btnBorderRadius : "16px",
        "--btn-rec-s1-cursor": "pointer",
        "--btn-rec-s1-box-shadow": "0 3px 6px 0 rgba(0, 0, 0, 0.2)",
        "--btn-rec-s1-transition": "all .6s",
      /* ----------~(end)~---------- */
  
      /* Button Rectangle Style Hover */
        "--btn-rec-s1-hov-bg": props.btnHover,
        "--btn-rec-s1-hov-opacity": "1",
        "--btn-rec-s1-hov-text-color": props.btnTextHoverColor,
        "--btn-rec-s1-hov-text-shadow": "none",
        "--btn-rec-s1-hov-box-shadow": "0 3px 6px 0 rgba(0, 0, 0, 0.15)"
      /* ----------~(end)~---------- */
    /* =================|END|================= */
  };

  if (!props.linkRef) {
    //console.log('no link')
    button =         
      <button 
        className="btn-rec-s1" 
        btnmargin={props.btnMargin}
        btncolor={props.btnColor} 
        btnhover={props.btnHover}
        btntextcolor={props.btnTextColor}
        btntexthovercolor={props.btnTextHoverColor}
        onClick={props.onClick} 
        type={props.type}
        btnborderradius={props.btnBorderRadius}
        btnwidth={props.btnWidth}
        btnpadding={props.btnPadding}
        name={props.name}
        value={props.value}
        style={sharedButtonStyle}
      >
        {props.btnText}
        {props.children}
      </button>
    ;
  }
  else if (checkExternal(props.linkRef)) {
    //console.log(props.linkRef)
    button = 
      <a 
        className="btn-rec-s1" 
        btnmargin={props.btnMargin}
        btncolor={props.btnColor} 
        btnhover={props.btnHover}
        btntextcolor={props.btnTextColor}
        btntexthovercolor={props.btnTextHoverColor}
        btnborderradius={props.btnBorderRadius}
        btnwidth={props.btnWidth}
        btnpadding={props.btnPadding}
        onClick={props.onClick}
        href={props.linkRef}
        target="_blank" 
        rel="noopener noreferrer"

        style={sharedButtonStyle}
      >
        {props.btnText}
        {props.children}
      </a>
    ;
  }
  else {
    //console.log(props.linkRef)
    button = 
      <Link 
        to={props.linkRef} 
        className="btn-rec-s1" 
        btnmargin={props.btnMargin}
        btncolor={props.btnColor} 
        btnhover={props.btnHover}
        btntextcolor={props.btnTextColor}
        btntexthovercolor={props.btnTextHoverColor}
        btnborderradius={props.btnBorderRadius}
        btnwidth={props.btnWidth}
        btnpadding={props.btnPadding}

        style={sharedButtonStyle}
      >
        {props.btnText}
        {props.children}
      </Link>
    ;
  }

  return button;
};

const ButtonFileUpload = (props) => {
  return (
    <>
      <input
        id={props.id}
        type={props.type}
        onClick={props.onClick} 
        onChange={props.onChange} 
        hidden
      />
      <span className="fileNameText">{props.fileName.name}</span>
      <label 
        className="btn-rec-s1" 
        btnmargin={props.btnMargin}
        htmlFor={props.id}
        btncolor={props.btnColor} 
        btnhover={props.btnHover}
        btntextcolor={props.btnTextColor}
        btntexthovercolor={props.btnTextHoverColor}
        type={props.type}
        btnborderradius={props.btnBorderRadius}
        btnwidth={props.btnWidth}
        btnpadding={props.btnPadding}

        style={sharedButtonStyle}
      >
        {props.btnText}
        {props.children}
      </label>
    </>
  );
};

export { ButtonRegular, ButtonFileUpload };