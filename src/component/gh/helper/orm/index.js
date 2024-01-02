import { Prisma, PrismaClient } from "@prisma/client";
import enc from "../encryption";
import { getInfo } from "@/model";

const prisma = new PrismaClient();

const extendPrisma = prisma.$extends({
  model: {
    user: {
      async create(raw) {
        return await prisma.user.create({
          data: { ...raw.data, password: await enc.hashing(raw?.data.password || "password") },
        });
      },
    },
  },
});

const defaultfilter = ["password", "deleted_at", "updated_at", "created_at", "iat", "exp"];

const prismaorm = { get, set, update, find, responseFilter, findOrCreate, getschema, schemaFilter, where, manyUpsert };
export default prismaorm;
export { extendPrisma };

function responseFilter(e, inputFilter = defaultfilter) {
  if (!e) return e;
  if (typeof e == "object") {
    if (Array.isArray(e)) {
      return e.map((d) => responseFilter(d, inputFilter));
    } else {
      if (Object?.keys(e).length == 0) return {};
      for (let key of inputFilter) {
        delete e[key];
      }
      return e;
    }
  }
  return e;
}

function schemaFilter(e, inputFilter = defaultfilter) {
  return e.filter((d) => !inputFilter.includes(d.name));
}

function getschema(input) {
  return Prisma.dmmf.datamodel.models.find((model) => model.name.toLowerCase() == input)?.fields;
}

function getschemaname(input) {
  return Prisma.dmmf.datamodel.models.find((d) => d.name.toLowerCase() == input.toLowerCase())?.name;
}

async function find(model, id) {
  try {
    return await prisma[getschemaname(model)].findUnique({
      where: {
        id: getInfo(model, "idType") == "string" ? id : parseInt(id),
        deleted_at: where?.deleted_at || null,
      },
      include: getInfo(model, "includes") || {},
    });
  } catch (error) {
    return {};
  }
}

async function where(model, where = {}) {
  return await prisma[getschemaname(model)].findUnique({
    where: where,
    include: getInfo(model, "includes") || {},
  });
}

async function findOrCreate(model, where = {}, create, update = {}) {
  return await extendPrisma[getschemaname(model)].upsert({
    where: {
      ...where,
      deleted_at: where?.deleted_at || null,
    },
    update: update,
    create: { ...where, ...create },
  });
}

async function get(model, where = {}) {
  try {
    return await prisma[getschemaname(model)].findMany({
      where: {
        ...where,
        deleted_at: null,
      },
      include: getInfo(model, "includes") || {},
    });
  } catch (error) {
    return [];
  }
}

async function set(model, data) {
  if (data?.id) {
    return await extendPrisma[getschemaname(model)].upsert({
      where: {
        id: data.id,
      },
      update: data,
      create: data,
    });
  } else {
    return await extendPrisma[getschemaname(model)].create({
      data: data,
    });
  }
}

async function update(model, data) {
  return await extendPrisma[getschemaname(model)].update({
    where: { id: data?.id },
    data: data,
  });
}

async function manyUpsert(model, data) {
  let old_data = data.filter((d) => d?.id);
  let new_data = data.filter((d) => !d?.id);

  await extendPrisma[getschemaname(model)].createMany({
    data: new_data,
  });

  old_data.forEach(async (od) => {
    await extendPrisma[getschemaname(model)].update({
      where: { id: od?.id },
      data: od,
    });
  });

  return "ok";
}
