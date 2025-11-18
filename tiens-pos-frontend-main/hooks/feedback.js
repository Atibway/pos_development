import { useState, useEffect } from 'react';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export const useFeedback = () => {
  const [loading, setLoading] = useState(null);

  const mountLoadingSwal = () => {
    Swal.fire({
      title: "Fetching Some information, Please wait...",
      allowOutsideClick: false,
      backdrop: true,
      showConfirmButton: false,
      timerProgressBar: true,
      // Add loading animation: https://sweetalert2.github.io/#loading-animation
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  const unmountLoadingSwal = () => {
    Swal.close();
  };

  useEffect(() => {
    if (loading) {
      mountLoadingSwal();
    } else if (loading === false) {
      unmountLoadingSwal();
    }
  }, [loading]);

  const toggleFeedback = (status, message = null) => {
    const MySwal = withReactContent(Swal);
    if (message === null) {
      MySwal.fire({
        icon: status,
        showConfirmButton: false,
        timer: 500,
      });
    } else {
      MySwal.fire({
        icon: status,
        title: message.title,
        text: message.text,
      });
    }
  }

  return { toggleFeedback, loading, setLoading }
}
