<script setup>
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

function getIsMobile() {
  return mobile;
}

defineExpose({
  getIsMobile,
});
</script>
