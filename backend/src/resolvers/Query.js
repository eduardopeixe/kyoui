const { forwardTo } = require('prisma-binding');

const Query = {
  // if yoga and prisma is exactly the same
  // we can forward it from yoga to prisma without creating as the comment below
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')

  //   async items(parent, args, ctx, info) {
  //     const items = await ctx.db.query.items();
  //     return items;
  //   }
};

module.exports = Query;
