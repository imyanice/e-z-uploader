import React from "react";
import SideBar from "./Sidebar";
import SettingsCard from "./SettingsCard";
import { useSidebar } from "../components/SidebarContext";
import { invoke } from "@tauri-apps/api/tauri";

function Settings({ dontShowSb = false }: { dontShowSb?: boolean }) {
  const { minimized } = useSidebar();
  return (
    <>
      {dontShowSb ? (
        <>
          <div className={`relative h-screen pt-8  p-8 duration-100`}>
            <div className="bg-zinc-925 rounded-lg w-full relative sm:p-4 p-0 mb-4">
              <h1 className="text-blue-100 font-poppins font-bold text-xl">
                Setting<span onClick={() => invoke("reset_settings")}>s</span>
              </h1>
              <SettingsCard />
            </div>
          </div>
        </>
      ) : (
        <>
          <SideBar page="settings" />

          <div
            className={`relative h-screen ${
              minimized ? "min-[900px]:ml-24" : "min-[900px]:ml-52"
            } pt-8  p-8 duration-100`}
          >
            <div className="bg-zinc-925 rounded-lg w-full relative sm:p-4 p-0 mb-4">
              <h1 className="text-blue-100 font-poppins font-bold text-xl">
                Setting<span onClick={() => invoke("reset_settings")}>s</span>
              </h1>
              <SettingsCard />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Settings;
