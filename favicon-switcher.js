
const lightFavicon = 'lightFavicon.png';
const darkFavicon = 'darkFavicon.png';

const favicon = document.getElementById('favicon');

const matcher = window.matchMedia('(prefers-color-scheme: dark)');

function onUpdate() {
  if (matcher.matches) {
    favicon.href = darkFavicon;
  } else {
    favicon.href = lightFavicon;
  }
}

matcher.addEventListener('change', onUpdate);
onUpdate();
