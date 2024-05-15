import React, { useEffect, useState } from "react";
import { useSidebar } from "../components/SidebarContext";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import Sidebar from "./Sidebar";
import Loading from "../components/LoadingScreen";
import { getClient } from "@tauri-apps/api/http";
import Settings from "./Settings";

interface UploadedFile {
  name: string;
  path: string;
  deletion_url: string;
  size: number;
  url: string;
}
interface UserData {
  key: string;
  motd: string;
  storageUsed: string;
  success: boolean;
  uid: number;
  uploads: number;
  username: string;
  uuid: string;
}

function App() {
  const { minimized } = useSidebar();
  const [uploadCount, setUploadCount] = useState(420);
  const [ssFolderSize, setSsFolderSize] = useState("420");
  const [recentImagesAsset, setRecentImagesAsset] = useState([]);
  const [recentImagesPath, setRecentImagesPath] = useState([]);
  const [recentImagesName, setRecentImagesName] = useState([]);
  const [recentImagesDeletionUrl, setRecentImagesDeletionUrl] = useState([]);
  const [recentImagesUrl, setRecentImagesUrl] = useState([]);
  const [recentImagesSize, setRecentImagesSize] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [jsonLength, setJsonLength] = useState(420);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [username, setUsername] = useState("");
  const [MOTD, setMOTD] = useState("");
  const [storageUsedServer, setStorageUsedServer] = useState("");
  const [serverUploadCount, setServerUploadCount] = useState(420);
  const [UID, setUID] = useState(420);
  const [isSetup, setIsSetup] = useState(true);

  function updateQuickView() {
    readTextFile("uploaded_files.json", { dir: BaseDirectory.AppData })
      .then((r) => {
        let json: UploadedFile[] = JSON.parse(r);
        let file_assets: string[] = [];
        let file_paths: string[] = [];
        let file_names: string[] = [];
        let deletion_urls: string[] = [];
        let file_urls: string[] = [];
        let file_size: string[] = [];
        if (json.length < 3) {
          setShowQuickView(false);
          setShowLoadingScreen(false);
          return;
        }
        for (let i = 1; i < 4; i++) {
          file_assets.push(convertFileSrc(json[json.length - i].path));
          file_paths.push(json[json.length - i].path);
          file_names.push(json[json.length - i].name);
          file_urls.push(json[json.length - i].url);
          deletion_urls.push(json[json.length - i].deletion_url);
          let bytes = json[json.length - i].size;
          if (bytes >= 1000 && bytes < 1000000)
            file_size.push((bytes / 1000).toFixed(2) + " KiB");
          if (bytes >= 1000000 && bytes < 1000000000)
            file_size.push((bytes / 1000000).toFixed(2) + " MiB");
          if (bytes > 1000000000)
            file_size.push((bytes / 1000000000).toFixed(2) + " GiB");
          if (bytes < 100) file_size.push(bytes + " Bytes");
        }
        setJsonLength(json.length);
        setRecentImagesPath(file_paths);
        setRecentImagesSize(file_size);
        setRecentImagesName(file_names);
        setRecentImagesAsset(file_assets);
        setRecentImagesDeletionUrl(deletion_urls);
        setRecentImagesUrl(file_urls);
        setShowQuickView(true);
        setShowLoadingScreen(false);
      })
      .catch(() => {
        console.log("File does not exist, the app is probably not setup!");
        setShowLoadingScreen(false);
      });
  }
  useEffect(() => {
    invoke("is_setup").then((r) => {
      if (!r) return setIsSetup(false);
      invoke("get_api_key").then((key) => {
        setShowLoadingScreen(true);
        getClient().then((client) => {
          client
            .get("https://api.e-z.gg/app?key=" + key, {
              headers: {
                "User-Agent": "i love tsoxas, he is very hot",
              },
            })
            .then((r) => {
              if (!r.ok) return setShowLoadingScreen(false);
              let data: UserData = r.data as UserData;
              setMOTD(data.motd);
              setUsername(data.username);
              setServerUploadCount(data.uploads);
              setUID(data.uid);
              setStorageUsedServer(data.storageUsed);
              setShowLoadingScreen(false);
            });
        });
      });

      invoke("upload_count").then((r: number) => setUploadCount(r));

      invoke("ss_folder_size").then((bytes: number) => {
        if (bytes >= 1000 && bytes < 1000000)
          return setSsFolderSize((bytes / 1000).toFixed(2) + " KiB");
        if (bytes >= 1000000 && bytes < 1000000000)
          return setSsFolderSize((bytes / 1000000).toFixed(2) + " MiB");
        if (bytes > 1000000000)
          return setSsFolderSize((bytes / 1000000000).toFixed(2) + " GiB");
        if (bytes < 100) return setSsFolderSize("Wow, it's quite clean!");
      });
      updateQuickView();
    });
  }, []);

  return (
    <>
      {isSetup ? (
        <>
          {showLoadingScreen ? (
            <Loading message={"Loading..."} />
          ) : (
            <>
              <Sidebar page={"dash"} />
              <main
                className={`relative h-screen ${
                  minimized ? "min-[900px]:ml-24" : "min-[900px]:ml-52"
                } pt-8 p-8 duration-100`}
              >
                <div className="bg-zinc-925 rounded-lg w-full relative sm:p-4 p-2 mb-4">
                  <h1 className="text-blue-100 font-poppins font-bold text-center md:text-3xl text-xl pt-2 pb-4">
                    Welcome, {username} 👋
                  </h1>
                  <div className="flex md:flex-row flex-col mx-4 gap-4">
                    <ul className="grid min-[900px]:grid-cols-2 grid-cols-1 gap-4 w-full">
                      <li className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                        <h1 className="text-blue-100 font-poppins font-bold text-center min-[900px]:text-xl text-lg">
                          Uploads
                        </h1>
                        <p className="text-blue-100 font-poppins text-center min-[900px]:text-xl text-lg group flex flex-col items-center cursor-help">
                          {serverUploadCount}
                          <div
                            className={`z-[100] absolute border-2 max-w-[320px] bg-zinc-800 border-zinc-700 rounded-md p-1 scale-0 group-hover:scale-100 group-hover:translate-y-[1.75rem] duration-300 transform-gpu`}
                          >
                            <span
                              className={`font-poppins text-white font-semibold text-sm text-center flex`}
                            >
                              {"Local uploads: " + uploadCount}
                            </span>
                          </div>
                        </p>
                      </li>
                      <li className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                        <h1 className="text-blue-100 font-poppins font-bold text-center min-[900px]:text-xl text-lg">
                          Storage Used
                        </h1>
                        <p className="text-blue-100 font-poppins text-center min-[900px]:text-xl text-lg">
                          {storageUsedServer}
                        </p>
                      </li>
                      <li className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                        <h1 className="text-blue-100 font-poppins font-bold text-center min-[900px]:text-xl text-lg">
                          User ID
                        </h1>
                        <p className="text-blue-100 font-poppins text-center min-[900px]:text-xl text-lg">
                          {UID}
                        </p>
                      </li>
                      <li className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                        <h1 className="text-blue-100 font-poppins font-bold text-center min-[900px]:text-xl text-lg">
                          Local Storage
                        </h1>
                        <p className="text-blue-100 font-poppins text-center min-[900px]:text-xl text-lg group flex flex-col items-center cursor-help">
                          {ssFolderSize}
                          <div
                            className={`z-[100] absolute border-2 max-w-[320px] bg-zinc-800 border-zinc-700 rounded-md p-1 scale-0 group-hover:scale-100 group-hover:translate-y-[1.75rem] duration-300 transform-gpu`}
                          >
                            <span
                              className={`font-poppins text-white font-semibold text-sm text-center flex`}
                            >
                              {
                                "You could save this space by enabling Auto-Wipe in settings!"
                              }
                            </span>
                          </div>
                        </p>
                      </li>
                    </ul>
                    <div className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 w-full min-[900px]:h-44 h-96 rounded-md p-4 px-4 pb-4 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-800 overflow-y-auto">
                      <h1 className="text-blue-100 font-poppins font-bold text-xl pb-2">
                        MOTD
                      </h1>
                      <p className="text-blue-100 font-poppins text-base">
                        {MOTD}
                      </p>
                    </div>
                  </div>
                </div>

                {showQuickView ? (
                  <div className={"flex lg:flex-row flex-col gap-3"}>
                    <div className="bg-zinc-925 content-center shadow-sm shadow-zinc-950  duration-100  rounded-md p-4 px-4 pb-4 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-800 w-full overflow-y-auto">
                      <h1 className="text-blue-100 font-poppins font-bold text-xl pb-2">
                        Quick view
                      </h1>
                      <ul className={"p-4 grid grid-cols-3 gap-4"}>
                        <li className="group col-span-1 bg-zinc-900 border-[1px] border-zinc-800 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 w-full rounded-lg">
                          <div>
                            <button
                              className="absolute z-10 bg-red-700 hover:bg-red-800 p-2 rounded-full m-2 group-hover:opacity-100 opacity-0 duration-100"
                              onClick={async () => {
                                setShowLoadingScreen(true);
                                const client = await getClient();
                                await client.get(recentImagesDeletionUrl[0], {
                                  headers: {
                                    "User-Agent":
                                      "i love tsoxas, he is very hot",
                                  },
                                });
                                invoke("delete_file", {
                                  filePath: recentImagesPath[0],
                                  index: jsonLength - 1,
                                });
                                updateQuickView();
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-white h-4 w-4"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"></path>
                              </svg>
                            </button>
                            <button
                              className="absolute z-10 bg-blue-700 hover:bg-blue-800 p-2 rounded-full m-2 ml-12 group-hover:opacity-100 opacity-0 duration-100"
                              onClick={() => {
                                invoke("write_to_cb", {
                                  text: recentImagesUrl[0],
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-white h-4 w-4"
                                viewBox="0 0 16 16"
                              >
                                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"></path>
                                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"></path>
                                <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"></path>
                              </svg>
                            </button>
                            <img
                              src={recentImagesAsset[0]}
                              className="overflow-hidden rounded-t-lg object-cover h-36 w-full border-b-[1px] border-zinc-800"
                              loading="lazy"
                              alt=""
                            />
                          </div>
                          <div>
                            <div className="py-2 px-3">
                              <h1 className="text-blue-100 font-poppins font-semibold text-lg overflow-hidden">
                                {recentImagesName[0]}
                              </h1>
                              <p className="text-blue-100 font-poppins text-base">
                                {recentImagesSize[0]}
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="group col-span-1 bg-zinc-900 border-[1px] border-zinc-800 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 w-full rounded-lg">
                          <div>
                            <button
                              className="absolute z-10 bg-red-700 hover:bg-red-800 p-2 rounded-full m-2 group-hover:opacity-100 opacity-0 duration-100"
                              onClick={async () => {
                                setShowLoadingScreen(true);
                                const client = await getClient();
                                await client.get(recentImagesDeletionUrl[1], {
                                  headers: {
                                    "User-Agent":
                                      "i love tsoxas, he is very hot",
                                  },
                                });
                                invoke("delete_file", {
                                  filePath: recentImagesPath[1],
                                  index: jsonLength - 2,
                                });
                                updateQuickView();
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-white h-4 w-4"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"></path>
                              </svg>
                            </button>
                            <button
                              className="absolute z-10 bg-blue-700 hover:bg-blue-800 p-2 rounded-full m-2 ml-12 group-hover:opacity-100 opacity-0 duration-100"
                              onClick={() => {
                                invoke("write_to_cb", {
                                  text: recentImagesUrl[1],
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-white h-4 w-4"
                                viewBox="0 0 16 16"
                              >
                                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"></path>
                                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"></path>
                                <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"></path>
                              </svg>
                            </button>
                            <img
                              src={recentImagesAsset[1]}
                              className="overflow-hidden rounded-t-lg object-cover h-36 w-full border-b-[1px] border-zinc-800"
                              loading="lazy"
                              alt=""
                            />
                          </div>
                          <div>
                            <div className="py-2 px-3">
                              <h1 className="text-blue-100 font-poppins font-semibold text-lg overflow-hidden">
                                {recentImagesName[1]}
                              </h1>
                              <p className="text-blue-100 font-poppins text-base">
                                {recentImagesSize[1]}
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="group col-span-1 bg-zinc-900 border-[1px] border-zinc-800 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 w-full rounded-lg">
                          <div>
                            <button
                              className="absolute z-10 bg-red-700 hover:bg-red-800 p-2 rounded-full m-2 group-hover:opacity-100 opacity-0 duration-100"
                              onClick={async () => {
                                setShowLoadingScreen(true);
                                const client = await getClient();
                                await client.get(recentImagesDeletionUrl[2], {
                                  headers: {
                                    "User-Agent":
                                      "i love tsoxas, he is very hot",
                                  },
                                });
                                invoke("delete_file", {
                                  filePath: recentImagesPath[2],
                                  index: jsonLength - 3,
                                });
                                updateQuickView();
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-white h-4 w-4"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"></path>
                              </svg>
                            </button>
                            <button
                              className="absolute z-10 bg-blue-700 hover:bg-blue-800 p-2 rounded-full m-2 ml-12 group-hover:opacity-100 opacity-0 duration-100"
                              onClick={() => {
                                invoke("write_to_cb", {
                                  text: recentImagesUrl[2],
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-white h-4 w-4"
                                viewBox="0 0 16 16"
                              >
                                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"></path>
                                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"></path>
                                <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"></path>
                              </svg>
                            </button>
                            <img
                              src={recentImagesAsset[2]}
                              className="overflow-hidden rounded-t-lg object-cover h-36 w-full border-b-[1px] border-zinc-800"
                              loading="lazy"
                              alt=""
                            />
                          </div>
                          <div>
                            <div className="py-2 px-3">
                              <h1 className="text-blue-100 font-poppins font-semibold text-lg overflow-hidden">
                                {recentImagesName[2]}
                              </h1>
                              <p className="text-blue-100 font-poppins text-base">
                                {recentImagesSize[2]}
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </main>
            </>
          )}
        </>
      ) : (
        <Settings dontShowSb={true} />
      )}
    </>
  );
}

export default App;
