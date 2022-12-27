import toast from 'react-hot-toast';

export const repeatRequest = () =>
  toast.error('Enter a new word in the search field', {
    duration: 3000,
    position: 'top-right',
  });

export const emptyRequest = () =>
  toast.error('Enter a word in the search field', {
    duration: 3000,
    position: 'top-right',
  });
