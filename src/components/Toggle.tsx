import { Fragment, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Toggle({
  label,
  description,
  onChange,
  enabled,
  bigText,
  centered,
}: {
  label: string;
  description: string;
  onChange: (e: any) => void;
  enabled: boolean;
  bigText?: boolean;
  centered?: boolean;
  warning?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`${
          centered ? "justify-center" : ""
        } flex flex-row items-center`}
      >
        <div className="group flex flex-col items-center cursor-help">
          <label
            className={`${
              bigText ? "text-base" : "text-sm"
            } cursor-help text-blue-100 font-poppins font-semibold mr-2 whitespace-nowrap`}
          >
            {label}
          </label>
          <div
            className={`z-[100] absolute border-2 max-w-[320px] bg-zinc-800 border-zinc-700 rounded-md p-1 scale-0 group-hover:scale-100 group-hover:translate-y-[1.75rem] duration-300 transform-gpu`}
          >
            <span
              className={`font-poppins text-white font-semibold text-sm text-center flex`}
            >
              {description}
            </span>
          </div>
        </div>
        <Switch
          checked={enabled}
          onChange={onChange}
          className={`${
            enabled ? "bg-blue-600" : "bg-zinc-800"
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
        >
          <span
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-zinc-200 shadow ring-0 transition duration-200 ease-in-out"
            )}
          >
            <span
              className={classNames(
                enabled
                  ? "opacity-0 duration-100 ease-out"
                  : "opacity-100 duration-200 ease-in",
                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
              )}
              aria-hidden="true"
            >
              <svg
                className="h-3 w-3 text-gray-400"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={classNames(
                enabled
                  ? "opacity-100 duration-200 ease-in"
                  : "opacity-0 duration-100 ease-out",
                "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
              )}
              aria-hidden="true"
            >
              <svg
                className="h-3 w-3 text-blue-600"
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            </span>
          </span>
        </Switch>
      </div>
    </>
  );
}
