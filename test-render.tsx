import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App';

try {
  console.log("Rendering /processos?tab=automacoes...");
  renderToString(
    <StaticRouter location="/processos?tab=automacoes">
      <App />
    </StaticRouter>
  );
  console.log("Success automacoes.");

  console.log("Rendering /processos...");
  renderToString(
    <StaticRouter location="/processos">
      <App />
    </StaticRouter>
  );
  console.log("Success processos.");
} catch (e) {
  console.error("ERROR CAUGHT:");
  console.error(e);
}
