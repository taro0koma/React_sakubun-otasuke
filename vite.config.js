import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import env from "vite-plugin-env-compatible";
// import './src/assets/css/index.css';

// tailWind
// import {VitePluginTailwind} from 'vite-plugin-tailwind';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react(),env({prefix:"VITE",mountedPath:"process.env"})],
  plugins: [react(),env({prefix:"REACT_APP_",mountedPath:"process.env"})],
})