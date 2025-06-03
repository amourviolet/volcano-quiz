// 简单火山题目交互
const buttons = document.querySelectorAll('.options button');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const correct = btn.getAttribute('data-correct') === 'true';
    if (correct) {
      btn.style.backgroundColor = '#4caf50';
    } else {
      btn.style.backgroundColor = '#e53935';
    }
    setTimeout(() => {
      btn.style.backgroundColor = '#ffab40';
    }, 1000);
  });
});
