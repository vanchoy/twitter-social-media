import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';
import { json } from "@remix-run/node";

import { getSession } from "./sessions.server";
import connectDb from './db/connectDb.server';

import { library } from '@fortawesome/fontawesome-svg-core'; // The { library } import has an add() method which takes any number of arguments and registers icons for later use
import { faBars, faHouse, faUser, faRightToBracket, faClock, faPersonWalkingArrowRight, faStar, faGear, faUserPlus, faPenToSquare, faPlus, faHeart, faTrash, faCircleInfo, faEnvelope, faCopyright, faKey, faChevronRight, faLaptopCode, faCode, faGlobe, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'; // Importing the selected icons

import Header from './components/Header';

import globalStyle from './styles/index.css';
import headerMenu from './styles/header.css';
import buttons from './styles/buttons.css';
import form from './styles/form.css';
import checkBox from './styles/checkbox.css';

//This is the add() method for fontawesome icons. These icons are saved for later use in the project, so there's no need of importing them again
library.add(faBars, faHouse, faUser, faRightToBracket, faClock, faPersonWalkingArrowRight, faStar, faGear, faUserPlus, faPlus, faPenToSquare, faCircleInfo, faTrash, faHeart, faEnvelope, faCopyright, faKey, faChevronRight, faLaptopCode, faCode, faGlobe, faPeopleGroup);

// link the styles for the UI
export const links = () => [{rel: 'stylesheet', href: globalStyle}, {rel: 'stylesheet', href: headerMenu}, {rel: 'stylesheet', href: buttons}, {rel: 'stylesheet', href: form}, {rel: 'stylesheet', href: checkBox}];

//Website metadata
export const meta = () => ({
  charset: "utf-8",
  title: "Twitter",
  viewport: "width=device-width,initial-scale=1"
});

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = await session.get("userId");
  const db = await connectDb(); // connect to the database

  if (session.has("userId")) {
    const user = await db.models.User.findById({
      _id: userId
    });
    const username = user.username;
    const dataObj = {userId,username,isAuthenticated: session.has("userId")};
    return json(dataObj);
  }
  return isAuthenticated = false;
}

export default function App() {
  //const { isAuthenticated, userId } = useLoaderData();
  return (
    <html lang="en">
      <head>
        {/* All meta exports on all routes will go here */}
        <Meta />
        
        {/* All link exports on all routes will go here */}
        <Links/>
      </head>
      <body>
        <Header /> {/* header component */}
        <Outlet />
        {/* footer component */}
        
        {/* Manages scroll position for client-side transitions */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <ScrollRestoration />

        {/* Script tags go here */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <Scripts />

        {/* Sets up automatic reload when you change code */}
        {/* and only does anything during development */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <LiveReload />
      </body>
    </html>
  );
};
