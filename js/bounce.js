const scrollContainer = document.querySelector('.scroll-container');
const content = document.querySelector('.content');

scrollContainer.addEventListener('scroll', () => {
  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight;
  const clientHeight = scrollContainer.clientHeight;

  // Oben angekommen
  if (scrollTop === 0) {
	console.log('Oben angekommen');
    content.classList.add('bounce-top');
	console.log(content.classList);
    setTimeout(() => content.classList.remove('bounce-top'), 500);
  }

  // Unten angekommen
  if (scrollTop + clientHeight >= scrollHeight) {
	console.log('Unten angekommen');
    content.classList.add('bounce-bottom');
    setTimeout(() => content.classList.remove('bounce-bottom'), 500);
  }
});