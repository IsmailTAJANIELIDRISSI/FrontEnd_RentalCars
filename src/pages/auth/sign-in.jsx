import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./auth_service";
import { jwtDecode } from "jwt-decode"; // import dependency

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      const decoded = jwtDecode(token);
      if (decoded?.exp * 1000 > Date.now()) {
        navigate("/");
      }
    }
  }, []);

  const handleLogin = () => {
    setLoading(true); // Set loading to true when handling the API response
    setErrorMessage(""); // Clear previous error messages

    login(email, password)
      .then((res) => {
        setLoading(false); // Set loading to false after handling the API response

        // Store the token in localStorage
        const { access_token } = res.data;
        const { user } = res.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // Decode the token to get roles
        const decodedToken = jwtDecode(access_token);
        const roles = decodedToken.roles;
        console.log(decodedToken);

        // Redirect based on roles
        if (roles.includes(2001)) {
          navigate("/user/home");
        } else if (roles.includes(2000)) {
          navigate("/admin/dashboard");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        if (error.response && error.response.data) {
          // Set the error message from the backend response
          setErrorMessage(error.response.data.errors);
        } else {
          // Set a generic error message if no specific message is provided
          setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
        }
      });
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="mt-24 w-full lg:w-3/5">
        <div className="text-center">
          <Typography variant="h2" className="mb-4 font-bold">
            Se Connecter
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Entrez votre email et mot de passe pour vous connecter.
          </Typography>
        </div>
        <form className="mx-auto mb-2 mt-8 w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Votre email
            </Typography>
            <Input
              size="lg"
              placeholder="nom@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Mot de passe
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && (
            <Typography
              variant="paragraph "
              color="red"
              className="mt-6 text-sm"
            >
              {errorMessage}
            </Typography>
          )}
          <Button
            className="mt-6"
            fullWidth
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Chargement..." : "Se Connecter"}
          </Button>

          <div className="mt-6 flex items-center justify-between gap-2">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Abonnez-moi à la newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Mot de passe oublié</a>
            </Typography>
          </div>
          <div className="mt-8 space-y-4">
            <Button
              size="lg"
              color="white"
              className="flex items-center justify-center gap-2 shadow-md"
              fullWidth
            >
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1156_824)">
                  <path
                    d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span>Se connecter avec Google</span>
            </Button>
            <Button
              size="lg"
              color="white"
              className="flex items-center justify-center gap-2 shadow-md"
              fullWidth
            >
              <img src="/img/twitter-logo.svg" height={24} width={24} alt="" />
              <span>Se connecter avec Twitter</span>
            </Button>
          </div>
          <Typography
            variant="paragraph"
            className="mt-4 text-center font-medium text-blue-gray-500"
          >
            Pas encore inscrit?
            <Link to="/auth/sign-up" className="ml-1 text-gray-900">
              Créer un compte
            </Link>
          </Typography>
        </form>
      </div>
      <div className="hidden h-full w-2/5 lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full rounded-3xl object-cover"
        />
      </div>
    </section>
  );
}

export default SignIn;
