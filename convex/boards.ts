import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const defaultContent = [
      {
        name: "To Do",
        contents: [],
      },
      {
        name: "In Progress",
        contents: [],
      },
      {
        name: "Done",
        contents: [],
      },
    ];

    const board = await ctx.db.insert("boards", {
      title: args.title,
      userId,
      content: JSON.stringify(defaultContent, null, 2),
      isArchived: false,
      isPublished: false,
    });

    return board;
  },
});

export const getById = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Not found");
    }

    if (board.isPublished && !board.isArchived) {
      return board;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (board.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return board;
  },
});

export const getSidebar = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const boards = await ctx.db
      .query("boards")
      .withIndex("by_user", (q) =>
        q.eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return boards;
  },
});

export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingBoard = await ctx.db.get(args.id);

    if (!existingBoard) {
      throw new Error("Not found");
    }

    if (existingBoard.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.patch(args.id, {
      ...rest,
    });

    return board;
  },
});

export const removeIcon = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject;

    const existingBoard = await ctx.db.get(args.id);

    if (!existingBoard) {
      throw new Error("Not found");
    }

    if (existingBoard.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return board;
  },
});