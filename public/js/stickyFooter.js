window.addEventListener('DOMContentLoaded', () => {
  var footer = document.getElementById('footer');
  var footerHeight = footer.offsetHeight;
  var body = document.body;
  var html = document.documentElement;
  var windowHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

  if (windowHeight > window.innerHeight) {
    footer.style.position = 'relative';
    footer.style.bottom = '1%';
  } else {
    footer.style.position = 'absolute';
    footer.style.bottom = '1%';
    footer.style.left = '4%';
  }
});