import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default function signUpHandler() {
  const root = document.querySelector('[data-container="sign-up"]');
  const formEl = document.querySelector('[data-form="sign-up"]');
  if (!formEl) return;

  const submitBtn = formEl.querySelector('[type="submit"]');

  const state = onChange({
    values: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    errors: {},
    submitting: false,
  }, () => {
    renderForm();
  });

  const renderForm = () => {
    // Обновляем значения инпутов, если они не совпадают с состоянием
    Object.entries(state.values).forEach(([fieldName, fieldValue]) => {
      const input = formEl.querySelector(`[name="${fieldName}"]`);
      if (input && input.value !== fieldValue) {
        input.value = fieldValue;
      }
    });

    // Убираем классы ошибок и сообщения
    formEl.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    formEl.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

    // Добавляем ошибки валидации
    Object.entries(state.errors).forEach(([field, error]) => {
      const input = formEl.querySelector(`[name="${field}"]`);
      if (!input) return;
      input.classList.add('is-invalid');

      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.textContent = error.message;
      input.parentNode.appendChild(errorDiv);
    });

    // Управляем состоянием кнопки отправки
    const hasErrors = !isEmpty(state.errors);
    const allFilled = Object.values(state.values).every(val => val.trim() !== '');
    submitBtn.disabled = state.submitting || hasErrors || !allFilled;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isEmpty(state.errors) || state.submitting) {
      return;
    }
    state.submitting = true;
    try {
      await axios.post(routes.usersPath(), state.values);
      root.innerHTML = 'User Created!';
    } catch (error) {
      state.submitting = false;
      alert(errorMessages.network.error);
    }
  };

  const onInput = (event) => {
    const { name, value } = event.target;
    state.values = { ...state.values, [name]: value };
    state.errors = validate(state.values);
  };

  formEl.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', onInput);
  });

  formEl.addEventListener('submit', onSubmit);

  // Инициализация кнопки
  submitBtn.disabled = true;
}
// END

