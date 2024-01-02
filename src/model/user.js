export const user = {
  idType: "string",
  includes: {
    activeorganization: {
      select: {
        // user_id: true,
        // organization_id: true,
        // id: true,
        name: true,

        // Organization: {
        //   select: {
        //     name: true,
        //   },
        // },
      },

      where: {
        deleted_at: null,
      },
      // include: {
      //   Organization: true,
      // },
      // includes: {
      //   organization: {
      //     select: {
      //       id: true,
      //       name: true,
      //     },
      //     where: {
      //       deleted_at: null,
      //     },
      //   },
      // },
    },
  },
};
