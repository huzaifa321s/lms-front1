import axios from "axios";
import { getCookie } from "../../../../shared/utils/helperFunction";
import { Outlet, redirect } from "@tanstack/react-router";

export function initializeAxios() {
        const TOKEN = getCookie('adminToken')
        const credentials = getCookie('adminCredentials');
        console.log('admin token ==',TOKEN);
        console.log('admin creds',credentials)
        function showLoader() {
  // Check if loader already exists
  if (document.getElementById("custom-loader")) return;

  // Create loader element
  const loader = document.createElement("div");
  loader.id = "custom-loader";
  loader.innerHTML = `
    <style>
      @keyframes hexagonPulse {
        0%, 100% { 
          transform: scale(1);
          border-color: #2563eb !important;
        }
        50% { 
          transform: scale(1.05);
          border-color: #1d4ed8 !important;
          filter: drop-shadow(0 0 10px rgba(37, 99, 235, 0.3));
        }
      }

      @keyframes spinClockwise {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes spinCounterClockwise {
        0% { transform: translate(-50%, -50%) rotate(360deg); }
        100% { transform: translate(-50%, -50%) rotate(0deg); }
      }

      @keyframes starPulse {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(1);
          filter: drop-shadow(0 0 5px rgba(37, 99, 235, 0.5));
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.2);
          filter: drop-shadow(0 0 10px rgba(37, 99, 235, 0.8));
        }
      }

      .custom-loader-container {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
      }

      .custom-loader-content {
        text-align: center;
        background: transparent;
        padding: 24px;
        max-width: 320px;
        width: 100%;
      }

      .hexagon-container {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto;
      }

      .hexagon {
        width: 120px;
        height: 120px;
        border: 4px solid #2563eb !important;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        position: relative;
        animation: hexagonPulse 2s ease-in-out infinite;
      }

      .circle-outer {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border: 4px solid transparent;
        border-top: 4px solid #10b981 !important;
        border-right: 4px solid #10b981 !important;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        animation: spinClockwise 3s linear infinite;
      }

      .circle-middle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        border: 3px solid #ef4444 !important;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        animation: spinCounterClockwise 2.5s linear infinite;
      }

      .circle-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 2px dashed #f59e0b !important;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        animation: spinClockwise 4s linear infinite;
        opacity: 0.8;
      }

      .star {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        color: #2563eb !important;
        animation: starPulse 1.5s ease-in-out infinite;
      }

      @media (max-width: 480px) {
        .custom-loader-content {
          padding: 16px;
          max-width: 280px;
        }

        .hexagon-container {
          width: 100px;
          height: 100px;
        }

        .hexagon {
          width: 100px;
          height: 100px;
        }

        .circle-outer {
          width: 66px;
          height: 66px;
        }

        .circle-middle {
          width: 50px;
          height: 50px;
        }

        .circle-inner {
          width: 34px;
          height: 34px;
        }

        .star {
          font-size: 16px;
        }
      }
    </style>

    <div class="custom-loader-container">
      <div class="custom-loader-content">
        <div class="hexagon-container">
          <div class="hexagon">
            <div class="circle-outer"></div>
            <div class="circle-middle"></div>
            <div class="circle-inner"></div>
            <div class="star">★</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add to body
  document.body.appendChild(loader);
}

function hideLoader() {
   const loader = document.getElementById('custom-loader');
   if (loader) {
       loader.remove();
   }
}
                if (TOKEN && credentials) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
    
    // Axios request interceptor for showing loader
    axios.interceptors.request.use(
      function (config) {
        // showLoader();
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    
    // Axios response interceptor for hiding loader
    axios.interceptors.response.use(
      function (response) {
        // hideLoader();
        return response;
      },
      function (error) {
        // hideLoader();
        return Promise.reject(error);
      }
    );
    
    return <Outlet />;
  } else {
    // TanStack Router ka redirect syntax theek hai
    throw redirect({ to: '/admin/login' });
  }
}
  


