import prisma from "@/component/gh/helper/orm";
import enc from "@gh/helper/encryption";

import axios from "axios";

export default async function handler(r, res) {
  if (r.method === "POST") {
    let token = r.headers?.authorization.split(" ")[1];

    try {
      let decode = await enc.checkToken(token);
      let user = await prisma.where("user", { id: decode?.id });
      return res.status(200).json(prisma.responseFilter({ ...user, token: await enc.getToken(user) }));
    } catch (error) {
      return res.status(500).json("un autorized");
    }
  }
}
