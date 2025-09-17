import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'src/html/login.html'),
        register: path.resolve(__dirname, 'src/html/register.html'),
        addAgent: path.resolve(__dirname, 'src/html/ajouterAgent.html'),
        gererConge: path.resolve(__dirname, 'src/html/gererConges.html'),
      }
    }
  }
});
