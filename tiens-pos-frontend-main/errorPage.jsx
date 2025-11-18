import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="mt-[20vh]">
        <center>
            <img src="notfound.png" className="w-1/4"/>
        <h1 className="text-primary text-2xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
        </center>
      
    </div>
  );
}
