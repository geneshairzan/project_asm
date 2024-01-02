import React, { useEffect } from "react";

import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import P404 from "../../pages/404";
import { nav, extra } from "@/component/app/_nav";
import Context from "@context/app";

function navReducer(a, b) {
  let tmp = b.path ? [b.path] : b.child.reduce(navReducer, []);
  return [...a, ...tmp];
}

export default function AppMiddleware({ children }) {
  const { auth } = React.useContext(Context);
  const router = useRouter();
  const allowedModel = [...nav, ...extra].reduce(navReducer, []);

  function isAllowed(params) {
    if (
      router.pathname == "/" ||
      allowedModel.includes(router.asPath) ||
      // allowedModel.map((d) => d.replaceAll("/", "")).includes(router?.query?.model) ||
      allowedModel.map((d) => d.replaceAll("/", "")).includes(router.asPath.split("/")[1]) ||
      router.asPath.includes("/p/")
    )
      return true;
    return false;
  }

  useEffect(() => {
    if (auth?.user?.id && !auth?.user.activeorganization) router.push("/organization/init");
  }, [auth?.user]);

  if (!isAllowed()) {
    return <P404 />;
  }

  return <>{children}</>;
}
