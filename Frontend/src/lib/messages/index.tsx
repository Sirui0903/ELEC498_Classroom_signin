import Swal from 'sweetalert2';

export const ErrorMessage = (error: any) => {
  let errorMessage = 'An error occurred'; // 默认错误消息

  // 如果错误对象是 axios 错误，且包含响应数据中的消息
  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    // 如果错误对象有消息属性
    errorMessage = error.message;
  }

  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: errorMessage,
  });
};
