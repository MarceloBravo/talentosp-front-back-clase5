import { create } from 'zustand';

const useModalStore = create((set) => ({
  title: 'Atención',
  message: '',
  type: '',
  isOpen: false,
  response: null,
  textBtnAcept: 'Aceptar',
  textBtnCancel: 'Cancelar',

  openModal: (title, message, type, textBtnAcept = 'Aceptar', textBtnCancel = 'Cancelar') => set({ isOpen: true, title, message, type, response: null, textBtnAcept, textBtnCancel}),
  closeModal: () => set({ isOpen: false, title: '', message: '', type: ''}),
  handleBtnOk: () => set({ isOpen: false, response: true}),
  handleBtnCancel: () => set({ isOpen: false, response: false}),
}));

export default useModalStore;