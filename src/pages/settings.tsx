import React, { useEffect, useState } from "react";
import SideBar from "../components/Sidebar";
import { useSidebar } from "../components/SidebarContext";
import { invoke } from "@tauri-apps/api/tauri";
import { useRouter } from "next/router";
import { disable, enable, isEnabled } from "tauri-plugin-autostart-api";
import Toggle from "../components/Toggle";

function Settings() {
  const { minimized } = useSidebar();
  let router = useRouter();

  const [apiKey, setApiKey] = useState(null);
  const [uploadUrlPlaceHolder, setUploadUrlPlaceHolder] = useState(null);
  const [autolaunchOn, setAutolaunchOn] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [autoWipeOn, setAutoWipeOn] = useState(false);

  const [uploadUrlValue, setUploadUrlValue] = useState("");

  const [showApiKey, setShowApiKey] = useState(false);

  const onInput = (e) => setUploadUrlValue(e.target.value);

  const onClear = () => {
    setUploadUrlValue("https://api.e-z.host/files");
  };

  useEffect(() => {
    invoke("get_api_key").then((r) => {
      setApiKey(r);
    });
    invoke("get_upload_url").then((r) => {
      setUploadUrlPlaceHolder(r);
      setUploadUrlValue(r as string);
    });
    invoke("is_setup").then((r: boolean) => {
      setSetupCompleted(r);
    });
    isEnabled().then((r) => setAutolaunchOn(r));
    invoke("auto_wipe_on").then((r: boolean) => {
      setAutoWipeOn(r);
    });
  }, []);

  return (
    <>
      {setupCompleted ? <SideBar page={'settings'} /> : <></>}
      <main className={`relative h-screen ${ setupCompleted ? minimized ? "min-[900px]:ml-24" : "min-[900px]:ml-52" : ""} pt-8 p-8 duration-100`}>
        <div className="bg-zinc-925 rounded-lg w-full relative sm:p-4 p-0 mb-4">
          <div className="grid min-[1100px]:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 p-4 grid-flow-row-dense">
            <div className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-4 w-full rounded-lg">
              <h1 className="text-blue-100 font-bold text-xl mb-2">
                App Settings
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Toggle
                  label="Auto Launch"
                  description="Automatically starts the app at login."
                  onChange={async (val) => {
                    val ? await enable() : await disable();
                    setAutolaunchOn(val);
                  }}
                  enabled={autolaunchOn}
                  bigText
                />
                <Toggle
                  label="Auto-Wipe"
                  description="Controls wether your files should be deleted locally after uploaded."
                  onChange={() => {
                    invoke("set_auto_wipe").then((r: boolean) => setAutoWipeOn(r));
                  }}
                  enabled={autoWipeOn}
                  bigText
                />
              </div>
            </div>
            <div className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-4 w-full rounded-lg">
              <h1 className="text-blue-100 font-bold text-xl mb-2">
                API Key
              </h1>
              <div className="flex flex-row">
                <input
                  type={showApiKey ? "text" : "password"}
                  className="w-full block border-0 text-sm bg-zinc-800 py-1.5 pl-3 rounded-md text-blue-100 shadow-sm ring-1 ring-zinc-700 focus:ring-1 focus:ring-blue-600"
                  placeholder={"API Key"}
                  id={"apiKeyInput"}
                  //@ts-ignore
                  defaultValue={apiKey}
                />
                <button
                  className="ml-2 px-3 py-2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    className="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                  </svg>
                </button>
              </div>
              <button
                className="relative mt-2 inline-flex items-center rounded-md bg-zinc-800 border-[1px] border-zinc-700 hover:bg-zinc-700 hover:border-blue-700 duration-300 active:translate-y-1 px-3 py-2 text-sm font-semibold text-blue-100 "
                onClick={() => {
                  const input = document.getElementById(
                    "apiKeyInput"
                  ) as HTMLInputElement;
                  const inputValue = input.value;
                  invoke("set_api_key", { apiKey: inputValue });
                }}
              >
                Save
              </button>
            </div>
            <div className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-4 w-full rounded-lg">
              <h1 className="text-blue-100 font-bold text-xl mb-2">
                Upload URL
              </h1>
              <input
                type="text"
                className="w-full block border-0 text-sm bg-zinc-800 py-1.5 pl-3 rounded-md text-blue-100 shadow-sm ring-1 ring-zinc-700 focus:ring-1 focus:ring-blue-600"
                placeholder={uploadUrlPlaceHolder}
                id={"uploadURLInput"}
                value={uploadUrlValue}
                onInput={onInput}
              />
              <div className={"flex w-full gap-1 mt-2"}>
                <button
                  className="relative inline-flex items-center rounded-md bg-zinc-800 border-[1px] border-zinc-700 hover:bg-zinc-700 hover:border-blue-700 duration-300 active:translate-y-1 px-3 py-2 text-sm font-semibold text-blue-100 "
                  onClick={() => {
                    const input = document.getElementById(
                      "uploadURLInput"
                    ) as HTMLInputElement;
                    const inputValue = input.value;
                    invoke("set_upload_url", { uploadUrl: inputValue });
                  }}
                >
                  Save
                </button>
                <button
                  className="relative inline-flex items-center rounded-md bg-zinc-800 border-[1px] border-zinc-700 hover:bg-zinc-700 hover:border-blue-700 duration-300 active:translate-y-1 px-3 py-2 text-sm font-semibold text-blue-100 "
                  onClick={() => {
                    invoke("set_upload_url", {
                      uploadUrl: "https://api.e-z.host/files",
                    }).then(() => {
                      onClear();
                    });
                  }}
                >
                  Reset to default
                </button>
              </div>
            </div>
            {setupCompleted ? (
              <></>
            ) : (
              <div className="bg-zinc-900 shadow-sm shadow-zinc-950 hover:shadow-md hover:shadow-zinc-950 duration-100 p-4 w-full rounded-lg">
                <h2 className="text-blue-100 font-bold text-xl">
                  Initialize the uploader
                </h2>
                <text className="text-gray-300">
                  The uploader will restart and live in your task bar, open the
                  settings from here from now on.
                </text>
                <br />
                <div className={"flex w-full gap-1"}>
                  <button
                    className="relative mt-4 inline-flex items-center rounded-md bg-zinc-800 border-[1px] border-zinc-700 hover:bg-zinc-700 hover:border-blue-700 duration-300 active:translate-y-1 px-3 py-2 text-sm font-semibold text-blue-100 "
                    onClick={() => {
                      invoke("setup");
                    }}
                  >
                    {"Set Up"}
                  </button>
                  <button
                    className="relative mt-4 inline-flex items-center rounded-md bg-zinc-800 border-[1px] border-zinc-700 hover:bg-zinc-700 hover:border-blue-700 duration-300 active:translate-y-1 px-3 py-2 text-sm font-semibold text-blue-100 "
                    onClick={async () => {
                      open(
                          'https://cdn.discordapp.com/attachments/1011662796141903933/1193605646516502578/image.png?ex=65ad52e2&is=659adde2&hm=deb66d82919cf92c4ef816fe3885ce16d1367841113dbb5d7faaec8ed29dbdd1&',
                      )
                    }}
                  >
                    {"More info"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Settings;
