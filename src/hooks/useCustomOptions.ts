import { useLocalStorage } from './useLocalStorage';
import { CustomOptions } from '../types';

const defaultCustomOptions: CustomOptions = {
  styles: [],
  moods: [],
  lighting: [],
  cameraAngles: [],
  artMediums: [],
  resolutions: [],
  qualities: [],
  technical: [],
  cameras: []
};

export function useCustomOptions() {
  const [customOptions, setCustomOptions] = useLocalStorage<CustomOptions>('custom-options', defaultCustomOptions);

  const addCustomOption = (category: keyof CustomOptions, option: string) => {
    setCustomOptions(prev => ({
      ...prev,
      [category]: [...prev[category], option]
    }));
  };

  const removeCustomOption = (category: keyof CustomOptions, option: string) => {
    setCustomOptions(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== option)
    }));
  };

  return {
    customOptions,
    addCustomOption,
    removeCustomOption
  };
}