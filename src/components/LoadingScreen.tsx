import eztransparent from "../assets/eztransparent.png";

export default function Loading({ message }: { message: string }) {
  return (
    <div className="flex h-screen justify-center">
      <div className="m-auto flex flex-col items-center">
        <img className={`h-44 w-44`} alt="" src={eztransparent.src}></img>
        <p className={`text-blue-100 text-xl font-semibold font-poppins`}>
          {message}
        </p>
      </div>
    </div>
  );
}
