import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        programs: resolve(root, 'programs.html'),
        impact: resolve(root, 'impact.html'),
        donate: resolve(root, 'donate.html'),
        partner: resolve(root, 'partner.html'),
        volunteer: resolve(root, 'volunteer.html'),
        transparency: resolve(root, 'transparency.html'),
        contact: resolve(root, 'contact.html'),
      },
    },
  },
});
