// src/utils/swal.js
import Swal from 'sweetalert2';

const swal = Swal.mixin({
  customClass: {
    popup: `
      rounded-3xl           /* sudut super bulat */
      !p-5                  /* padding lebih kecil */
      max-w-xs              /* lebar maksimal lebih kecil */
      w-full
      shadow-2xl            /* shadow halus & dalam */
      border border-gray-200/60
      backdrop-blur-md
      text-sm
    `,
    title: 'text-lg font-bold text-gray-800 mb-2',
    htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-4',

    confirmButton: `
      px-5 py-2.5 
      bg-gradient-to-r from-indigo-600 to-purple-600 
      hover:from-indigo-700 hover:to-purple-700
      text-white font-medium text-sm
      rounded-xl shadow-md hover:shadow-lg 
      transform hover:-translate-y-0.5 transition-all duration-200
      mx-1.5
    `,
    cancelButton: `
      px-5 py-2.5 
      bg-gray-400 hover:bg-gray-500
      text-white font-medium text-sm
      rounded-xl shadow-md hover:shadow-lg 
      transform hover:-translate-y-0.5 transition-all duration-200
      mx-1.5
    `,
    denyButton: `
      px-5 py-2.5 
      bg-red-500 hover:bg-red-600
      text-white font-medium text-sm
      rounded-xl shadow-md hover:shadow-lg 
      transform hover:-translate-y-0.5 transition-all duration-200
      mx-1.5
    `,
  },
  buttonsStyling: false,
  width: '360px',                    // lebih kecil dari default (640px)
  padding: 0,
  background: '#ffffff',
  backdrop: 'rgba(0, 0, 0, 0.45)',
});

// Bonus: Toast kecil di pojok (sangat direkomendasikan!)
export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  padding: '0.75rem 1rem',
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-gray-200/80 text-sm font-medium',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export default swal;