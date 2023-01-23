import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles.css';
import SearchPage from './pages/search-page';

const App = () => {
   useEffect(() => {
      document.title = "Skyscraper";
   }, []);

   return (
      <div className="bg-main bg-cover h-screen w-screen">
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
