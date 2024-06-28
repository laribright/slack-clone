import { create } from 'zustand';

type CreateWorkSpaceValues = {
  name: string;
  imageUrl: string;
  updateImageUrl: (url: string) => void;
  updateValues: (values: Partial<CreateWorkSpaceValues>) => void;
  currStep: number;
  setCurrStep: (step: number) => void;
};

export const useCreateWorkspaceValues = create<CreateWorkSpaceValues>(set => ({
  name: '',
  imageUrl: '',
  updateImageUrl: url => set({ imageUrl: url }),
  updateValues: values => set(values),
  currStep: 1,
  setCurrStep: step => set({ currStep: step }),
}));
