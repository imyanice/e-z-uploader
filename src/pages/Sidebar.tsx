import { useRouter } from "next/router";
import { useSidebar } from "../components/SidebarContext";
import eztransparent from "../assets/eztransparent.png";

export default function Sidebar({ page }: { page: string }) {
  const router = useRouter();

  const { minimized, setMinimized } = useSidebar();

  function minimize() {
    setMinimized(true);
  }
  function maximize() {
    setMinimized(false);
  }

  return (
    <>
      {minimized ? (
        <aside
          className={`min-[900px]:w-24 duration-200 flex flex-col w-0 fixed top-0 z-[100] h-screen bg-zinc-925 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-zinc-925 scrollbar-thumb-zinc-900`}
        >
          <nav className="p-4 min-[900px]:block hidden">
            <svg className="h-12 w-12 mx-auto cursor-pointer" id="Layer_1" data-name="Layer 1"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1011.67 806.28">
              <defs>
                <style>
                


                </style>
              </defs>
              <g id="Layer_13" data-name="Layer 13">
                <g>
                  <path className="sidebar-2"
                        d="M243.62,177.2c17.23-19.74,36.85-37.65,58.63-53.21h.01c-8.03,21.85-14.71,44.6-19.94,68.11,19.4-4.32,38.84-8.52,58.3-12.66,8.19-27.49,18.71-53.6,31.31-77.98.22-.44.46-.88.7-1.32.77-1.5,1.57-2.98,2.35-4.46,1.39-2.6,2.82-5.18,4.25-7.72,1.27-2.27,2.58-4.52,3.89-6.75,7.48-2.77,14.99-5.26,22.54-7.47h0l19.08,87.56c12.83-2.79,28.7-6.2,46.62-9.93l-19.15-87.86c7.96-1.18,15.93-2.07,23.88-2.67h.01c.07.04.14.1.22.15,2.25,1.57,4.49,3.15,6.71,4.77,2.37,1.72,4.73,3.48,7.08,5.25,1.33,1.02,2.67,2.04,4,3.08.4.29.79.6,1.18.91,22.06,17.29,42.89,37.1,62.11,59.26h0c13.47-2.54,27.18-5.06,40.9-7.47,4.1-.72,8.19-1.44,12.27-2.13,2.18-.34,4.37-.67,6.55-1.01-15.36-20.61-31.87-39.77-49.34-57.36,24.21,4.73,47.78,12.07,70.31,21.81.01,0,.04-.02.06-.02,16.45,7.12,32.35,15.53,47.52,25.14,4.94-.73,9.89-1.45,14.83-2.16.06,0,.11,0,.17-.01,10.72-1.54,21.45-3.01,32.19-4.41,12.35-1.6,24.71-3.14,37.08-4.61-15.72-13.98-32.45-26.65-50.02-37.94-.4-.26-.81-.52-1.21-.77-1.37-.88-2.75-1.74-4.13-2.59-2.73-1.69-5.47-3.35-8.23-4.97-1.14-.67-2.28-1.33-3.43-1.99-1.41-.81-2.82-1.61-4.24-2.4-1.07-.6-2.15-1.2-3.23-1.78-1.08-.59-2.16-1.18-3.25-1.76-2.04-1.09-4.07-2.16-6.13-3.21-18.27-9.38-37.24-17.35-56.72-23.85,19.49,6.49,38.46,14.47,56.74,23.85-30.49-15.7-62.94-27.49-96.52-35-.31-.07-.62-.14-.94-.2.02.04.04.07.06.11h-.01c-74.01-16.37-153.48-12.07-229.64,16.83-83.9,31.84-150.99,88.66-196.01,158.79l-.1-.37c-.26.4-.52.82-.78,1.22-8.67,13.59-16.51,27.68-23.49,42.19,27.25-7.62,54.6-14.91,82.07-21.69,7.07-10.13,14.7-19.9,22.87-29.26Z"></path>
                  <path className="sidebar-2"
                        d="M782.37,601.18c27.31-6.31,54.51-13.11,81.52-20.54-43.44,88.61-119.32,161.55-218.86,199.32-114.8,43.57-237.1,31.22-336.94-23.55-.16-.09-.34-.18-.5-.27-2.16-1.19-4.32-2.4-6.46-3.62-1.77-1.02-3.54-2.05-5.3-3.1-.88-.52-1.76-1.05-2.64-1.58-.88-.52-1.76-1.06-2.63-1.6-.54-.34-1.08-.67-1.62-1.01-1-.61-1.98-1.23-2.97-1.86-.03-.02-.05-.04-.08-.05-18.87-11.95-36.79-25.49-53.55-40.52,3.51-.48,7.02-.96,10.53-1.45.03,0,.05,0,.08,0,25.49-2.64,50.45-5.61,74.61-8.8,18.93,12.03,38.99,22.18,59.85,30.29.01.02.02.04.04.07,19.35,7.56,39.41,13.36,59.9,17.32-17.72-17.79-34.39-37.1-49.83-57.74,21.16-3.3,41.35-6.68,60.31-10.01,24.47,28.02,51.69,52.57,81,72.92,7.55-.59,15.11-1.45,22.67-2.55l-18.84-86.47c18.54-3.78,34.26-7.17,46.62-9.93l18.79,86.21c7.69-2.24,15.35-4.77,22.98-7.59h0c17.59-29.86,31.75-62.48,42.19-97.04,19.52-4.28,39.03-8.64,58.53-13.04-5.22,23.09-11.86,45.56-19.84,67.25,17.1-12.23,32.86-25.9,47.19-40.76,12.15-12.61,23.25-26.09,33.25-40.28Z"></path>
                  <path className="sidebar-1"
                        d="M1011.56,142.62c-.88,10.28-1.98,20.54-3.06,30.81-2.13,20.14-4.4,40.25-6.44,60.4-.88,8.71-3.39,16.7-8.32,24-24.49,36.23-51.86,70.2-81.51,102.29-21.94,23.74-44.78,46.64-67.25,69.88-1.19,1.23-2.73,2.11-4.1,3.15.39.54.78,1.08,1.17,1.61h0c15.76-3.4,31.57-6.57,47.25-10.28,25.95-6.13,51.81-12.63,77.72-18.94,4.75-1.15,7.26.52,7.26,5.49,0,4.24-.83,8.51-1.58,12.72-3.91,22.04-8,44.06-11.85,66.11-1.87,10.71-6.48,18.94-17.41,22.8-24.21,8.57-48.1,18.11-72.55,25.94-43.39,13.9-87.47,25.43-131.9,35.54-40.62,9.24-81.24,18.53-121.98,27.18-32.75,6.95-65.68,13.07-98.57,19.34-4.53.86-9.35,1.01-13.94.55-6.94-.7-10.26-5.41-9.2-12.28,3.9-25.2,7.99-50.37,11.84-75.57,1.42-9.29,5.62-17.18,12.33-23.33,9.89-9.06,20.29-17.59,30.71-26.06,60.78-49.38,121.9-98.34,182.37-148.1,42.26-34.78,83.66-70.61,125.46-105.95.73-.62,1.62-1.06,2.43-1.58-.21-.37-.41-.73-.62-1.1-3.93.07-7.89-.13-11.8.26-26.16,2.61-52.33,5.12-78.45,8.13-23.01,2.64-45.99,5.74-68.94,8.9-24.88,3.44-49.72,7.14-74.57,10.85-13.86,2.07-27.67,4.47-41.54,6.52-5.37.79-10.84,1.56-16.24,1.38-8.7-.29-12.34-5.25-11.35-13.96,2.52-22.06,5.09-44.1,7.35-66.18.7-6.9,4.13-11.47,10.38-13.39,7.03-2.16,14.28-3.86,21.55-4.97,35.8-5.47,71.58-11.18,107.49-15.85,38.04-4.94,76.18-9.12,114.33-13.08,53.5-5.56,107.16-8.84,160.98-8.67,6.43.02,12.84.43,19.27.6,9.87.27,14.13,4.88,13.27,14.85Z"></path>
                  <path className="sidebar-1"
                        d="M250.15,662.75c-28.21,3.47-56.46,6.73-84.78,9.18-31.81,2.76-63.68,5.09-95.57,6.46-19.02.82-38.15-.26-57.21-1-10.03-.39-13.12-3.99-12.52-14.2.75-12.82,1.97-25.63,3.45-38.38,3.09-26.49,6.12-52.99,9.85-79.39,3.48-24.67,7.32-49.31,11.93-73.78,6.88-36.53,14.34-72.95,22.03-109.32,3.82-18.09,8.5-35.99,13.14-53.89,2.4-9.26,8.42-15.8,17.63-18.79,32.95-10.69,65.71-22.08,98.99-31.6,39.28-11.24,78.82-21.76,118.64-30.89,57.09-13.1,114.53-24.68,171.83-36.87,7.8-1.66,15.62-3.32,23.49-4.61,4.39-.71,8.92-1.01,13.37-.85,6.02.22,8.36,3.28,7.33,9.26-4.08,23.79-8.28,47.56-12.45,71.33-1.09,6.2-4.97,10.4-9.95,13.82-6.98,4.81-15.15,5.84-23.16,7.47-55.32,11.26-110.74,22.03-165.89,34.01-39.36,8.55-78.34,18.82-117.51,28.17-4.1.98-6.26,2.91-7.35,7.06-2.55,9.79-5.61,19.45-8.4,29.18-.46,1.59-.58,3.27-1,5.71h.01c9.65-2.3,18.45-4.54,27.32-6.49,46.57-10.25,93.15-20.42,139.73-30.6,7.99-1.74,15.98-3.49,24.01-5.01,3.42-.64,6.96-1.04,10.43-.97,8.43.17,12.43,5.08,10.96,13.41-3.53,19.94-7.29,39.83-10.78,59.76-2.11,12.08-4.06,24.19-5.78,36.33-1.91,13.43-10.28,20.86-22.69,23.5-16.93,3.61-34.08,6.25-51.14,9.23-27.99,4.88-56.01,9.69-84.01,14.54-19.76,3.42-39.5,6.91-59.26,10.28-2.47.42-4.61.76-4.97,3.8-1.47,12.57-2.98,25.12-4.43,37.69-.06.51.29,1.07.47,1.68.61.13,1.18.42,1.7.34,23.1-3.45,46.22-6.9,69.31-10.42,22.71-3.46,45.42-6.89,68.1-10.51,21.53-3.43,43.03-7.05,64.54-10.66,31.87-5.35,63.72-10.82,95.6-16.08,4.37-.72,8.96-.95,13.37-.55,7.56.67,11.73,5.44,11.02,12.99-.92,9.88-2.6,19.68-3.93,29.52-2.77,20.45-5.72,40.87-8.2,61.35-1.23,10.15-6.19,17.03-15.59,20.69-3.43,1.33-7.02,2.52-10.63,3.08-30.38,4.76-60.78,9.5-91.2,13.97-26.58,3.9-53.17,7.77-79.84,11.05Z"></path>
                  <path className="sidebar-1"
                        d="M456.8,364.72c41.36-7.34,82.73-14.62,124.11-21.81,25.88-4.49,51.77-8.84,77.68-13.11,3.09-.51,7.24-2.03,8.95,1.77,1.78,3.98-1.35,7.03-4.26,9.38-10.91,8.8-21.91,17.49-32.92,26.16-15.45,12.16-30.98,24.23-46.4,36.41-13.72,10.83-29.1,17.88-46.4,20.58-39.78,6.19-79.57,12.34-119.35,18.5-1.35.21-2.7.32-3.68.43h0c-6.4.28-8.74-2.28-7.78-8.77,1.64-11.15,3.57-22.27,5.38-33.39,1.06-6.52,2.24-13.02,3.09-19.58.76-5.82,3.99-9.19,9.53-10.33,10.66-2.19,21.34-4.36,32.07-6.26Z"></path>
                </g>
              </g>
            </svg>

            <ul className="flex flex-col mt-4 gap-y-2">
              <li className="text-blue-100 font-poppins gap-y-1 rounded-md bg-zinc-900">
                <button
                    onClick={() => router.push(`/`)}
                    className={`${
                        page === 'dash'
                            ? 'self-center bg-zinc-925 border-2 border-blue-700 w-full p-1.5 text-center rounded-t-md'
                            : 'self-center bg-zinc-900 hover:bg-zinc-925 duration-300 border-2 border-zinc-900 w-full p-1.5 text-center rounded-t-md'
                    }`}
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-blue-100 h-8 w-8 mx-auto"
                      viewBox="0 0 16 16"
                  >
                    <path
                        d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
                  </svg>
                </button>
              </li>
              <li className="text-blue-100 font-poppins gap-y-1 rounded-md bg-zinc-900">
                <button
                    onClick={() => router.push(`/Settings`)}
                    className={`${
                        page === 'settings'
                            ? 'self-center bg-zinc-925 border-2 border-blue-700 w-full p-1.5 text-center'
                            : 'self-center bg-zinc-900 hover:bg-zinc-925 duration-300 border-2 border-zinc-900 w-full p-1.5 text-center'
                    }`}
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-blue-100 h-8 w-8 mx-auto"
                      viewBox="0 0 16 16"
                  >
                    <path
                        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path
                        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                </button>
              </li>
              <li className="text-blue-100 font-poppins gap-y-1 rounded-md bg-zinc-900">
                <button
                    onClick={() => router.push(`/Upload`)}
                    className={`${
                        page === 'upload'
                            ? 'self-center bg-zinc-925 border-2 border-blue-700 w-full p-1.5 text-center rounded-b-md'
                            : 'self-center bg-zinc-900 hover:bg-zinc-925 duration-300 border-2 border-zinc-900 w-full p-1.5 text-center rounded-b-md'
                    }`}
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-blue-100 h-8 w-8 mx-auto"
                      viewBox="0 0 16 16"
                  >
                    <path
                        fillRule="evenodd"
                        d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                    />
                    <path
                        d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
          <button
              onClick={maximize}
              className="bg-zinc-800 w-full p-2 mt-auto text-white font-poppins flex flex-row text-2xl px-8"
          >
            <>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-blue-100 h-8 w-8 mx-auto"
                  viewBox="0 0 16 16"
              >
                <path
                    fillRule="evenodd"
                    d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8Zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5Z"
                />
              </svg>
            </>
          </button>
        </aside>
      ) : (
          <aside
              className={`min-[900px]:w-52 duration-200 flex flex-col w-0 fixed top-0 z-[100] h-screen bg-zinc-925 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-zinc-925 scrollbar-thumb-zinc-900`}
          >
            <nav className="p-4 min-[900px]:block hidden duration-300">
              <img
                  onClick={() => router.push('/')}
                  className={`mx-auto h-20 w-20`}
                  alt=""
                  src="https://cdn.e-z.host/e-zimagehosting/eztransparent.png"
              ></img>
              <ul className="flex flex-col mt-4 gap-y-2">
                <li className="text-blue-100 font-poppins gap-y-1 rounded-md bg-zinc-900">
                  <button
                      onClick={() => router.push(`/`)}
                      className={`${
                          page === 'dash'
                              ? 'self-center bg-zinc-925 border-2 border-blue-700 w-full p-1.5 text-center rounded-t-md'
                      : "self-center bg-zinc-900 hover:bg-zinc-925 duration-300 border-2 border-zinc-900 w-full p-1.5 text-center rounded-t-md"
                  }`}
                >
                  Home
                </button>
              </li>
              <li className="text-blue-100 font-poppins gap-y-1 rounded-md bg-zinc-900">
                <button
                  onClick={() => router.push(`/Settings`)}
                  className={`${
                    page === "settings"
                      ? "self-center bg-zinc-925 border-2 border-blue-700 w-full p-1.5 text-center"
                      : "self-center bg-zinc-900 hover:bg-zinc-925 duration-300 border-2 border-zinc-900 w-full p-1.5 text-center"
                  }`}
                >
                  Settings
                </button>
              </li>
              <li className="text-blue-100 font-poppins gap-y-1 rounded-md bg-zinc-900">
                <button
                  onClick={() => router.push(`/Upload`)}
                  className={`${
                    page === "upload"
                      ? "self-center bg-zinc-925 border-2 border-blue-700 w-full p-1.5 text-center rounded-b-md"
                      : "self-center bg-zinc-900 hover:bg-zinc-925 duration-300 border-2 border-zinc-900 w-full p-1.5 text-center rounded-b-md"
                  }`}
                >
                  Upload
                </button>
              </li>
            </ul>
          </nav>
          <button
            onClick={minimize}
            className="bg-zinc-800 w-full p-2 mt-auto text-white font-poppins flex flex-row text-2xl px-8"
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="fill-blue-100 h-8 w-8 mx-auto"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5ZM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5Z"
                />
              </svg>
            </>
          </button>
        </aside>
      )}
    </>
  );
}
