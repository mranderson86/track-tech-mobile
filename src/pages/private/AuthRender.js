import React from "react";

// Renderiza apenas elementos autorizados ao usuário.
function AuthRender(props) {
  return <>{props.auth ? props.children : <></>}</>;
}

export default AuthRender;
