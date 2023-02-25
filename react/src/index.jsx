import React from 'react';
import ReactDOM from 'react-dom/client';
import {setPrefix,ProfileComponent} from "./Bandung" ;
import {CategoryEntityComponent} from "./UncoverGemCommand";
import {BrowserRouter} from 'react-router-dom';
import './Bandung.css';

setPrefix("http://localhost:5000/https://www.uncovergem.com") ;
//setPrefix("http://localhost:5000/http://localhost:8080'") ;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <div className='App'>
            <header className='App-header'>
                <CategoryEntityComponent id='category'/>
                <ProfileComponent id='profile'/>
            </header>
		</div>
    </BrowserRouter> 
  </React.StrictMode>
) ;
