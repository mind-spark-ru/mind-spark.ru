import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../../config";

function AuthGoogleCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const code = searchParams.get("code");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!code) {
          setError("No Auth data");
          return;
        }

        const googleResponse = await fetch(
          `${API_URL}/v1/google/callback`,
          {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        if (!googleResponse.ok) {
          throw new Error(`HTTP error! status: ${googleResponse.status}`);
        }

        const googleData = await googleResponse.json();

        const userResponse = await fetch(
          `${API_URL}/v1/users/email/${googleData.email}`,
          {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          window.location.href = `mindspark://auth?email=${userData.email}`;
          return;
        }

        if (userResponse.status === 404) {
          const createResponse = await fetch(`${API_URL}/v1/users/`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: googleData.email,
              username: "NoName",
              password: "",
              fullname: googleData.name,
            }),
          });

          if (!createResponse.ok) {
            setError("Error");
            return;
          }

          const createdUser = await createResponse.json();
          window.location.href = `mindspark://auth?email=${createdUser.email}`;
          return;
        }

        setError("Error");
      } catch (err) {
        setError(err?.message ?? String(err));
      }
    };

    void handleCallback();
  }, [code]);

  if (error) {
    return <div>{error}</div>;
  }

  return null;
}

export default AuthGoogleCallback;