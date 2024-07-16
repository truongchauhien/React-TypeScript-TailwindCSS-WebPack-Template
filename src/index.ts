import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './app';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(createElement(App));
