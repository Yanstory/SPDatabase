import { useDisplay } from 'vuetify';

export function getIsMobile() {
  const { mobile } = useDisplay();
  return mobile;
}
