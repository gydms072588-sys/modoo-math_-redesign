document.querySelectorAll('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.add('open');
    document.querySelector('.drawer-backdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.drawer-backdrop')?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('.options').forEach((group) => {
  group.querySelectorAll('.option').forEach((button) => {
    button.addEventListener('click', () => {
      group.querySelectorAll('.option').forEach((option) => {
        option.classList.remove('selected');
        option.textContent = option.textContent.replace('✓ ', '');
      });
      button.classList.add('selected');
      button.textContent = `✓ ${button.textContent}`;
    });
  });
});

document.querySelectorAll('[data-answer]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach((answer) => answer.classList.remove('selected'));
    button.classList.add('selected');
  });
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const isOpen = button.parentElement.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('[data-auth-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.href = 'home.html';
  });
});
