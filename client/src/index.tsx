import React from 'react';
import ReactDOM from 'react-dom/client';
import { Helmet } from 'react-helmet';

import './assets/styles.css';
import SearchPage from './pages/search-page';

const App = () => {
   return (
      <div className="bg-main bg-cover h-screen w-screen">
         <Helmet>
            <meta charSet="utf-8" />
            <title>Skyscraper</title>
         </Helmet>
         <div className="relative h-full w-full backdrop-brightness-[.8] backdrop-blur-[2px] overflow-y-scroll flex flex-col justify-center items-center">
            <SearchPage />
         </div>
      </div>
   );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);
