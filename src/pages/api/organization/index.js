import prisma from "@/component/gh/helper/orm";
import serverMiddleware from "@/component/middleware/server";
import { getUser } from "@gh/helper/encryption";
import authMiddleware from "@/component/middleware/server/auth";

const handler = async (r, res) => {
  !r?.auth && res.status(401).json({ msg: "un autorized" });

  try {
    if (r.method == "POST") {
      let data;
      if (r?.body?.organization_id) {
        // try register into existing org
        // check if org exist
        data = await prisma.set("userorganization", { user_id: r?.auth.id, organization_id: r?.body?.organization_id });
      } else {
        // create & register new org
        data = await prisma.set("organization", { ...r?.body, owner_id: r?.auth.id });
        await prisma.set("userorganization", { user_id: r?.auth.id, organization_id: data.id });
      }
      if (data) {
        await prisma.update("user", { id: r?.auth.id, active_organization: r?.body?.organization_id || data.id });
        res.status(200).json(prisma.responseFilter(data));
      }
    }
    if (r.method == "DELETE") {
      let data = await prisma.update("organization", r?.body);
      res.status(200).json(prisma.responseFilter(data));

      res.status(200).json(r.body);
    } else {
      let data = await prisma.get("organization");
      res.status(200).json(prisma.responseFilter(data));
    }
  } catch (error) {
    res.status(400).json("bad request");
  }
};

export default serverMiddleware(handler);
