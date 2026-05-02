// src/BaseApi.jsx
//
// Backend base URL. In development, set VITE_API_BASE in a `.env.local` file
// at the repo root, e.g.
//
//     VITE_API_BASE=http://127.0.0.1:8000/
//
// to point the SPA at your local Django dev server. If unset, it falls back
// to the production Koyeb deployment.

const BASE_API =
  import.meta.env.VITE_API_BASE ||
  "https://sticky-merla-ranaumairpy-7c72ead8.koyeb.app/";
//testing

export default BASE_API;
