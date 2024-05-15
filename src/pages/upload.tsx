import React from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../components/SidebarContext";
import { invoke } from "@tauri-apps/api/tauri";
export default function Upload() {
  const { minimized } = useSidebar();
  return (
    <>
      <Sidebar page={"upload"} />
      <main
        className={`relative h-screen ${
          minimized ? "min-[900px]:ml-24" : "min-[900px]:ml-52"
        } pt-8 p-8 duration-100`}
      >
        <div className="bg-zinc-925 rounded-lg w-full relative sm:p-4 p-0 mb-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-4">
            <div className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 w-full p-4 rounded-lg">
              <h1 className="text-blue-100 font-bold text-xl">
                File Uploader
              </h1>
              <div className="flow-root mt-3">
                <div className="sm:overflow-x-auto ">
                  <div className="flex flex-col items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700 rounded-lg cursor-pointer duration-300 bg-zinc-800 hover:bg-zinc-700 hover:border-blue-700">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                          Click to upload a file
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          Allowed Mimetypes are Image, Video and Application.
                        </p>
                      </div>
                      <button
                        tabIndex={0}
                        className={"hidden"}
                        onClick={() => {
                          invoke("select_files_to_upload");
                        }}
                      ></button>
                    </label>
                  </div>
                </div>
              </div>
              <ul className=" grid min-[900px]:grid-cols-5 place-items-center md:grid-cols-3 grid-cols-1 gap-4"></ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
